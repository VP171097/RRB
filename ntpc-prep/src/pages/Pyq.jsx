import { useApp } from '../store.jsx'
import { PYQ_SETS, TOPIC_PYQ, searchLink } from '../data/resources.js'
import { useManifest, pdfUrl } from '../manifest.js'
import { Ext, Bar } from '../ui.jsx'
import { todayIso } from '../lib.js'

const SLOTS = Array.from({ length: 12 }, (_, i) => i + 1)

export default function Pyq({ go }) {
  const { state, update } = useApp()
  const man = useManifest()
  const saved = man.files.filter((f) => f.folder === 'pyq' || f.folder.startsWith('pyq/'))
  const doneCount = SLOTS.filter((n) => state.pyq['p' + n]?.done).length
  const set = (n, patch) => update((s) => { s.pyq['p' + n] = { ...(s.pyq['p' + n] || {}), ...patch } })
  return (
    <>
      <h2>Previous-year papers</h2>
      <p className="small muted" style={{ margin: 0 }}>RRB does not publish shift papers itself, so these links search for them. Download a paper you trust, then drop it into <code>public/pdfs/pyq/</code> (or use the fetch command in the PDF library) to keep it in git.</p>

      <section className="card">
        <h3>Where to get papers</h3>
        {PYQ_SETS.map((p) => (
          <div className="res" key={p.id}>
            <b>{p.title}</b>
            <span className="small muted">{p.note}</span>
            <div className="row small">{p.links.map(([l, u]) => <Ext key={l} href={u}>{l}</Ext>)}</div>
          </div>
        ))}
      </section>

      <section className="card">
        <h3>Topic-wise PYQs</h3>
        <div className="row" style={{ marginTop: 8 }}>
          {TOPIC_PYQ.map(([l, q]) => <Ext key={l} className="btn ghost sm" href={searchLink(q)}>{l}</Ext>)}
        </div>
      </section>

      <section className="card">
        <div className="row" style={{ justifyContent: 'space-between' }}><h3>Full-paper log</h3><span className="small num muted">{doneCount}/12 attempted</span></div>
        <p className="small muted" style={{ margin: '4px 0 8px' }}>The plan has one full paper a day in weeks 8 and 9. Log each one here with its score out of 100.</p>
        <Bar a={doneCount} b={12} accent />
        {SLOTS.map((n) => {
          const p = state.pyq['p' + n] || {}
          return (
            <div className="mock" key={n} style={{ alignItems: 'center' }}>
              <label className="sub" style={{ padding: 0 }}>
                <input type="checkbox" checked={!!p.done} onChange={(e) => set(n, { done: e.target.checked, date: e.target.checked ? todayIso() : '' })} />
                <span className="box" /><span className="tx"><b>Paper #{n}</b>{p.date && <span className="muted small"> · {p.date}</span>}</span>
              </label>
              <input type="number" aria-label={`Paper ${n} score`} placeholder="Score" step="0.01" style={{ width: 90 }} value={p.score ?? ''} onChange={(e) => set(n, { score: e.target.value })} />
            </div>
          )
        })}
      </section>

      <section className="card">
        <div className="row" style={{ justifyContent: 'space-between' }}><h3>Saved in your library</h3><button className="btn ghost sm" onClick={() => go('library')}>Open library</button></div>
        {saved.length ? saved.map((f) => (
          <div className="res" key={f.path}><Ext href={pdfUrl(f.path)}>{f.name}</Ext><span className="small muted">{(f.size / 1024).toFixed(0)} KB</span></div>
        )) : <div className="empty" style={{ marginTop: 8 }}>No PYQ PDFs in <code>public/pdfs/pyq/</code> yet.</div>}
      </section>
    </>
  )
}
