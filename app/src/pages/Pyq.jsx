import { useApp } from '../store.jsx'
import { useExam } from '../exam.jsx'
import { searchLink } from '../../../RRB_Graduate/resources.js'
import { useManifest, pdfUrl } from '../manifest.js'
import { Ext, Bar } from '../ui.jsx'
import { Pager, usePaged } from '../pager.jsx'
import { todayIso } from '../lib.js'
import { useT } from '../i18n.jsx'

const SLOTS = Array.from({ length: 12 }, (_, i) => i + 1)

export default function Pyq({ go }) {
  const t = useT()
  const { state, update } = useApp()
  const X = useExam()
  const { PYQ_SETS, TOPIC_PYQ } = X.RES
  const man = useManifest(X.folder)
  const saved = man.files.filter((f) => f.folder === 'pyq' || f.folder.startsWith('pyq/'))
  const sets = usePaged(PYQ_SETS, 3)
  const slots = usePaged(SLOTS, 6)
  const doneCount = SLOTS.filter((n) => state.pyq['p' + n]?.done).length
  const set = (n, patch) => update((s) => { s.pyq['p' + n] = { ...(s.pyq['p' + n] || {}), ...patch } })

  return (
    <>
      <h2>{t('Previous-year papers')}</h2>
      <p className="small muted" style={{ margin: 0 }}>{t('RRB does not publish shift papers itself, so these links search for them. Save a paper you trust into')} <code>{X.folder}/pdfs/pyq/</code> {t('to keep it in git.')}</p>

      <section className="card">
        <h3>{t('Where to get papers')}</h3>
        {sets.items.map((p) => (
          <div className="res" key={p.id}>
            <b>{t(p.title)}</b>
            <span className="small muted">{t(p.note)}</span>
            <div className="row small">{p.links.map(([l, u]) => <Ext key={l} href={u}>{t(l)}</Ext>)}</div>
          </div>
        ))}
        <Pager pg={sets} label={t('Paper sources')} info={false} />
      </section>

      <details>
        <summary><h3>{t('Topic-wise questions')}</h3></summary>
        <div className="in"><div className="row">{TOPIC_PYQ.map(([l, q]) => <Ext key={l} className="btn ghost sm" href={searchLink(q)}>{t(l)}</Ext>)}</div></div>
      </details>

      <section className="card">
        <div className="row" style={{ justifyContent: 'space-between' }}><h3>{t('Full-paper log')}</h3><span className="small num muted">{t('{n}/12 attempted', { n: doneCount })}</span></div>
        <p className="small muted" style={{ margin: '4px 0 8px' }}>{t('One full paper a day in weeks 8 and 9. Log each with its score out of 100.')}</p>
        <Bar a={doneCount} b={12} accent />
        {slots.items.map((n) => {
          const p = state.pyq['p' + n] || {}
          return (
            <div className="mock" key={n} style={{ alignItems: 'center' }}>
              <label className="sub" style={{ padding: 0 }}>
                <input type="checkbox" checked={!!p.done} onChange={(e) => set(n, { done: e.target.checked, date: e.target.checked ? todayIso() : '' })} />
                <span className="box" /><span className="tx"><b>{t('Paper #{n}', { n })}</b>{p.date && <span className="muted small"> · {p.date}</span>}</span>
              </label>
              <input type="number" aria-label={t('Paper {n} score', { n })} placeholder={t('Score')} step="0.01" style={{ width: 90 }} value={p.score ?? ''} onChange={(e) => set(n, { score: e.target.value })} />
            </div>
          )
        })}
        <Pager pg={slots} label={t('Paper log')} info={false} />
      </section>

      <section className="card">
        <div className="row" style={{ justifyContent: 'space-between' }}><h3>{t('Saved in your library')}</h3><button className="btn ghost sm" onClick={() => go('library')}>{t('Open library')}</button></div>
        {saved.length ? saved.slice(0, 5).map((f) => <div className="res" key={f.path}><Ext href={pdfUrl(X.folder, f.path)}>{f.name}</Ext></div>) : <div className="empty" style={{ marginTop: 8 }}>{t('No PDFs in')} <code>{X.folder}/pdfs/pyq/</code> {t('yet.')}</div>}
      </section>
    </>
  )
}
