import { useApp } from '../store.jsx'
import { useExam } from '../exam.jsx'
import { searchLink } from '../../../RRB_Graduate/resources.js'
import { useManifest, pdfUrl } from '../manifest.js'
import { Ext, Bar } from '../ui.jsx'
import { Pager, usePaged } from '../pager.jsx'
import { todayIso } from '../lib.js'

const SLOTS = Array.from({ length: 12 }, (_, i) => i + 1)

export default function Pyq({ go }) {
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
      <h2>Previous-year papers</h2>
      <p className="small muted" style={{ margin: 0 }}>RRB does not publish shift papers itself, so these links search for them. Save a paper you trust into <code>{X.folder}/pdfs/pyq/</code> to keep it in git.</p>

      <section className="card">
        <h3>Where to get papers</h3>
        {sets.items.map((p) => (
          <div className="res" key={p.id}>
            <b>{p.title}</b>
            <span className="small muted">{p.note}</span>
            <div className="row small">{p.links.map(([l, u]) => <Ext key={l} href={u}>{l}</Ext>)}</div>
          </div>
        ))}
        <Pager pg={sets} label="Paper sources" info={false} />
      </section>

      <details>
        <summary><h3>Topic-wise questions</h3></summary>
        <div className="in"><div className="row">{TOPIC_PYQ.map(([l, q]) => <Ext key={l} className="btn ghost sm" href={searchLink(q)}>{l}</Ext>)}</div></div>
      </details>

      <section className="card">
        <div className="row" style={{ justifyContent: 'space-between' }}><h3>Full-paper log</h3><span className="small num muted">{doneCount}/12 attempted</span></div>
        <p className="small muted" style={{ margin: '4px 0 8px' }}>One full paper a day in weeks 8 and 9. Log each with its score out of 100.</p>
        <Bar a={doneCount} b={12} accent />
        {slots.items.map((n) => {
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
        <Pager pg={slots} label="Paper log" info={false} />
      </section>

      <section className="card">
        <div className="row" style={{ justifyContent: 'space-between' }}><h3>Saved in your library</h3><button className="btn ghost sm" onClick={() => go('library')}>Open library</button></div>
        {saved.length ? saved.slice(0, 5).map((f) => <div className="res" key={f.path}><Ext href={pdfUrl(X.folder, f.path)}>{f.name}</Ext></div>) : <div className="empty" style={{ marginTop: 8 }}>No PDFs in <code>{X.folder}/pdfs/pyq/</code> yet.</div>}
      </section>
    </>
  )
}
