import { useState } from 'react'
import { useManifest, pdfUrl } from '../manifest.js'
import { Ext } from '../ui.jsx'

const FOLDERS = [['syllabus', 'Syllabus and notifications'], ['pyq', 'Previous-year papers'], ['notes', 'Notes'], ['books', 'Books'], ['other', 'Other']]
const kb = (n) => (n > 1048576 ? (n / 1048576).toFixed(1) + ' MB' : Math.max(1, Math.round(n / 1024)) + ' KB')

export default function Library() {
  const man = useManifest()
  const [q, setQ] = useState('')
  const [url, setUrl] = useState('')
  const [folder, setFolder] = useState('pyq')
  const [fname, setFname] = useState('')
  const [copied, setCopied] = useState(false)
  const needle = q.trim().toLowerCase()
  const files = man.files.filter((f) => !needle || f.name.toLowerCase().includes(needle) || f.folder.includes(needle))
  const known = FOLDERS.map(([k]) => k)
  const groups = FOLDERS.map(([k, l]) => [k, l, files.filter((f) => f.folder === k || f.folder.startsWith(k + '/'))])
  const rest = files.filter((f) => !known.some((k) => f.folder === k || f.folder.startsWith(k + '/')))
  if (rest.length) groups.push(['misc', 'Unsorted', rest])
  const name = (fname || 'paper-name').replace(/\.pdf$/i, '').replace(/[^\w.-]+/g, '-')
  const cmd = `npm run fetch-pdf -- "${url || 'https://example.com/file.pdf'}" ${folder}/${name}.pdf`
  const copy = async () => {
    try { await navigator.clipboard.writeText(cmd); setCopied(true); setTimeout(() => setCopied(false), 1500) } catch { /* select manually */ }
  }
  return (
    <>
      <h2>PDF library</h2>
      <p className="small muted" style={{ margin: 0 }}>Everything in <code>public/pdfs/</code> shows up here after the next build. The folder lives in git, so your papers and notes stay with the project. Download buttons save the file to your device.</p>
      <label className="f">Search<input type="text" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by name or folder" /></label>
      {man.loading && <div className="empty">Loading library…</div>}
      {man.error && <div className="empty">Could not read <code>pdfs/manifest.json</code>. Run <code>npm run manifest</code> and rebuild.</div>}
      {!man.loading && !man.error && !man.files.length && <div className="empty">No PDFs yet. Add one below, or copy files into <code>public/pdfs/</code>.</div>}
      {groups.filter(([, , f]) => f.length).map(([k, label, f]) => (
        <section className="card" key={k}>
          <h3>{label} <span className="muted small">({f.length})</span></h3>
          {f.map((x) => (
            <div className="mock" key={x.path} style={{ alignItems: 'center' }}>
              <div><b>{x.name}</b><div className="small muted">{x.path} · {kb(x.size)} · {x.modified}</div></div>
              <div className="row" style={{ flexWrap: 'nowrap' }}>
                <Ext className="btn ghost sm" href={pdfUrl(x.path)}>Open</Ext>
                <a className="btn sm" href={pdfUrl(x.path)} download={x.path.split('/').pop()}>Download</a>
              </div>
            </div>
          ))}
        </section>
      ))}
      <section className="card">
        <h3>Add a PDF to the library</h3>
        <p className="small muted" style={{ margin: '4px 0 10px' }}>A browser page cannot write into your git folder, so build the command here and run it in the project folder. It downloads the PDF into <code>public/pdfs/</code>. If a site blocks direct downloads, save the file from your browser and drop it into that folder yourself.</p>
        <div className="fgrid">
          <label className="f" style={{ gridColumn: '1/-1' }}>Direct PDF link<input type="text" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://…/paper.pdf" /></label>
          <label className="f">Folder<select value={folder} onChange={(e) => setFolder(e.target.value)}>{FOLDERS.map(([k]) => <option key={k}>{k}</option>)}</select></label>
          <label className="f">File name<input type="text" value={fname} onChange={(e) => setFname(e.target.value)} placeholder="ntpc-2025-cbt1-shift1" /></label>
        </div>
        <code className="cmd" style={{ marginTop: 10 }}>{cmd}</code>
        <div className="row" style={{ marginTop: 10 }}><button className="btn sm" onClick={copy}>{copied ? 'Copied' : 'Copy command'}</button></div>
        <p className="small muted" style={{ margin: '10px 0 0' }}>Then commit it: <code>git add public/pdfs &amp;&amp; git commit -m "Add paper" &amp;&amp; git push</code></p>
      </section>
    </>
  )
}
