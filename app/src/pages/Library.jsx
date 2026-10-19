import { useState } from 'react'
import { useExam } from '../exam.jsx'
import { useManifest, pdfUrl } from '../manifest.js'
import { Ext } from '../ui.jsx'
import { Pager, usePaged } from '../pager.jsx'
import { useT } from '../i18n.jsx'

const FOLDERS = [['all', 'All'], ['syllabus', 'Syllabus'], ['pyq', 'Papers'], ['notes', 'Notes'], ['books', 'Books'], ['other', 'Other']]
const kb = (n) => (n > 1048576 ? (n / 1048576).toFixed(1) + ' MB' : Math.max(1, Math.round(n / 1024)) + ' KB')

export default function Library() {
  const t = useT()
  const X = useExam()
  const man = useManifest(X.folder)
  const [q, setQ] = useState('')
  const [cat, setCat] = useState('all')
  const [url, setUrl] = useState('')
  const [folder, setFolder] = useState('pyq')
  const [fname, setFname] = useState('')
  const [copied, setCopied] = useState(false)
  const needle = q.trim().toLowerCase()
  const files = man.files.filter((f) => (cat === 'all' || f.folder === cat || f.folder.startsWith(cat + '/')) && (!needle || f.name.toLowerCase().includes(needle)))
  const pg = usePaged(files, 8)
  const name = (fname || 'paper-name').replace(/\.pdf$/i, '').replace(/[^\w.-]+/g, '-')
  const cmd = `npm run fetch-pdf -- "${url || 'https://example.com/file.pdf'}" ${X.id}/${folder}/${name}.pdf`
  const copy = async () => { try { await navigator.clipboard.writeText(cmd); setCopied(true); setTimeout(() => setCopied(false), 1500) } catch { /* select by hand */ } }

  return (
    <>
      <h2>{t('PDF library')}</h2>
      <p className="small muted" style={{ margin: 0 }}>{t('Files from')} <code>{X.folder}/pdfs/</code>{t('. They live in git, so papers and notes stay with the project.')}</p>
      <div className="seg" role="group" aria-label={t('Folder')}>
        {FOLDERS.map(([k, l]) => <button key={k} className="btn ghost sm" aria-pressed={cat === k} onClick={() => { setCat(k); pg.setPage(1) }}>{t(l)}</button>)}
      </div>
      <label className="f">{t('Search')}<input type="text" value={q} onChange={(e) => { setQ(e.target.value); pg.setPage(1) }} placeholder={t('Search by name')} /></label>
      {man.loading && <div className="empty">{t('Loading library…')}</div>}
      {man.error && <div className="empty">{t('Could not read the library index. Run')} <code>npm run manifest</code> {t('in')} <code>app/</code> {t('and rebuild.')}</div>}
      {!man.loading && !man.error && !man.files.length && <div className="empty">{t('No PDFs yet for {name}. Add one below, or copy files into', { name: t(X.name) })} <code>{X.folder}/pdfs/</code>.</div>}
      {!!pg.items.length && (
        <section className="card">
          {pg.items.map((x) => (
            <div className="mock" key={x.path} style={{ alignItems: 'center' }}>
              <div><b>{x.name}</b><div className="small muted">{x.path} · {kb(x.size)} · {x.modified}</div></div>
              <div className="row" style={{ flexWrap: 'nowrap' }}>
                <Ext className="btn ghost sm" href={pdfUrl(X.folder, x.path)}>{t('Open')}</Ext>
                <a className="btn sm" href={pdfUrl(X.folder, x.path)} download={x.path.split('/').pop()}>{t('Download')}</a>
              </div>
            </div>
          ))}
        </section>
      )}
      <Pager pg={pg} label={t('Library page')} />
      <details>
        <summary><h3>{t('Add a PDF')}</h3></summary>
        <div className="in">
          <p className="small muted" style={{ margin: '0 0 10px' }}>{t('A web page cannot write into your git folder, so build the command here and run it in the')} <code>app/</code> {t('folder. If a site blocks direct downloads, save the file from your browser and drop it into')} <code>{X.folder}/pdfs/</code>.</p>
          <div className="fgrid">
            <label className="f" style={{ gridColumn: '1/-1' }}>{t('Direct PDF link')}<input type="text" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://…/paper.pdf" /></label>
            <label className="f">{t('Folder')}<select value={folder} onChange={(e) => setFolder(e.target.value)}>{FOLDERS.slice(1).map(([k, l]) => <option key={k} value={k}>{t(l)}</option>)}</select></label>
            <label className="f">{t('File name')}<input type="text" value={fname} onChange={(e) => setFname(e.target.value)} placeholder="ntpc-2025-shift1" /></label>
          </div>
          <code className="cmd" style={{ marginTop: 10 }}>{cmd}</code>
          <div className="row" style={{ marginTop: 10 }}><button className="btn sm" onClick={copy}>{copied ? t('Copied') : t('Copy command')}</button></div>
          <p className="small muted" style={{ margin: '10px 0 0' }}>{t('Then commit it:')} <code>git add {X.folder}/pdfs &amp;&amp; git commit -m "Add paper" &amp;&amp; git push</code></p>
        </div>
      </details>
    </>
  )
}
