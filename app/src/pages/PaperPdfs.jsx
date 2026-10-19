import { useExam } from '../exam.jsx'
import { useManifest, pdfUrl } from '../manifest.js'
import { useT, useI18n, LOCALES } from '../i18n.jsx'
import { Pager, usePaged } from '../pager.jsx'

const MONTHS = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec']
const kb = (n) => (n > 1048576 ? (n / 1048576).toFixed(1) + ' MB' : Math.max(1, Math.round(n / 1024)) + ' KB')

// Reads the exam date, shift and stage out of a paper's file name ("...CBT-I...16-03-2026-S1-2.pdf", "...08-May-2026-Shift-1...").
export function paperInfo(file) {
  const n = file.path.split('/').pop().replace(/\.pdf$/i, '')
  const d = n.match(/(\d{1,2})[-_ ](\d{1,2}|[A-Za-z]{3,9})[-_ ](20\d\d)/)
  let date = null
  if (d) {
    const mo = /^\d+$/.test(d[2]) ? +d[2] - 1 : MONTHS.indexOf(d[2].slice(0, 3).toLowerCase())
    if (mo >= 0) date = new Date(+d[3], mo, +d[1])
  }
  const s = n.match(/(?:shift[^A-Za-z0-9]?|[^A-Za-z0-9]S)(\d)(?:[-_](\d))?(?!\d)/i)
  const stage = /CBT[-_ ]?I\b/i.test(n) ? 'CBT 1' : /CBT[-_ ]?II\b/i.test(n) ? 'CBT 2' : ''
  return { date, shift: s ? +s[1] : 0, copy: s && s[2] ? +s[2] : 0, stage, key: (date ? date.getTime() : 0) * 10 + (s ? +s[1] : 0) }
}

function Column({ title, files, folder, emptyNote }) {
  const t = useT()
  const { lang } = useI18n()
  const pg = usePaged(files, 10)
  return (
    <section className="card pcol">
      <h3>{title} <span className="muted small">({files.length})</span></h3>
      {!files.length && <div className="empty small">{emptyNote}</div>}
      {pg.items.map(({ f, info }) => (
        <div className="pitem" key={f.path}>
          <div className="grow">
            <b>{info.date ? info.date.toLocaleDateString(LOCALES[lang], { day: 'numeric', month: 'short', year: 'numeric' }) : f.name}</b>
            <div className="small muted">
              {[info.stage, info.shift ? t('Shift {n}', { n: info.shift }) : '', info.copy ? t('Set {n}', { n: info.copy }) : '', kb(f.size)].filter(Boolean).join(' · ')}
            </div>
          </div>
          <a className="btn sm" href={pdfUrl(folder, f.path)} download={f.path.split('/').pop()}>{t('Download')}</a>
        </div>
      ))}
      <Pager pg={pg} label={title} />
    </section>
  )
}

export default function PaperPdfs() {
  const t = useT()
  const X = useExam()
  const man = useManifest(X.folder)
  const pick = (lang) => man.files.filter((f) => f.folder.toLowerCase() === 'pyq/' + lang).map((f) => ({ f, info: paperInfo(f) })).sort((a, b) => a.info.key - b.info.key || a.f.path.localeCompare(b.f.path))
  return (
    <>
      <h2>{t('Previous year paper PDFs')}</h2>
      <p className="small muted" style={{ margin: 0 }}>{t('Question papers for {name}. Tap Download on a paper to save it. English and Hindi papers are in separate columns.', { name: t(X.name) })}</p>
      {man.loading && <div className="empty">{t('Loading library…')}</div>}
      {man.error && <div className="empty">{t('Could not read the library index. Run')} <code>npm run manifest</code> {t('in')} <code>app/</code> {t('and rebuild.')}</div>}
      {!man.loading && !man.error && (
        <div className="pcols">
          <Column title={t('English')} files={pick('english')} folder={X.folder} emptyNote={t('No English papers yet. Add PDFs to {path}', { path: X.folder + '/pdfs/pyq/english/' })} />
          <Column title={t('Hindi')} files={pick('hindi')} folder={X.folder} emptyNote={t('No Hindi papers yet. Add PDFs to {path}', { path: X.folder + '/pdfs/pyq/hindi/' })} />
        </div>
      )}
    </>
  )
}
