import { useState } from 'react'
import { useApp } from '../store.jsx'
import { SUBS, CAUSES } from '../data/plan.js'
import { Bar } from '../ui.jsx'
import { fmt, parse, todayIso, uid, iso, addDays } from '../lib.js'

const blankForm = () => ({ sub: SUBS[0], cause: CAUSES[0], topic: '', note: '' })

export default function Errors() {
  const { state, update } = useApp()
  const [f, setF] = useState(blankForm)
  const [filter, setFilter] = useState('open')
  const today = todayIso()
  const due = state.errors.filter((e) => !e.done && e.revisit <= today).length
  const counts = Object.fromEntries(CAUSES.map((c) => [c, state.errors.filter((e) => e.cause === c).length]))
  const mx = Math.max(1, ...Object.values(counts))
  const list = state.errors.filter((e) => filter === 'all' || !e.done).sort((a, b) => (a.revisit < b.revisit ? -1 : 1))
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value })
  const patch = (id, fn) => update((s) => { const x = s.errors.find((e) => e.id === id); if (x) fn(x) })
  return (
    <>
      <h2>Error log</h2>
      <p className="small muted" style={{ margin: 0 }}>Log every wrong, skipped or lucky-guess question from a mock. Revisit it a week later and redo it without notes.</p>
      {state.errors.length > 0 && (
        <section className="card"><h3>Where marks leak</h3>
          <div style={{ display: 'grid', gap: 8, marginTop: 10 }}>
            {CAUSES.map((c) => <div key={c}><div className="row small" style={{ justifyContent: 'space-between' }}><span>{c}</span><span className="num">{counts[c]}</span></div><Bar a={counts[c]} b={mx} accent /></div>)}
          </div>
        </section>
      )}
      <section className="card">
        <h3 style={{ marginBottom: 10 }}>Add an entry</h3>
        <form className="fgrid" onSubmit={(e) => { e.preventDefault(); update((s) => { s.errors.push({ id: uid(), sub: f.sub, cause: f.cause, topic: f.topic.trim(), note: f.note.trim(), revisit: iso(addDays(parse(today), 7)), done: false }) }); setF(blankForm()) }}>
          <label className="f">Subject<select value={f.sub} onChange={set('sub')}>{SUBS.map((s) => <option key={s}>{s}</option>)}</select></label>
          <label className="f">Cause<select value={f.cause} onChange={set('cause')}>{CAUSES.map((s) => <option key={s}>{s}</option>)}</select></label>
          <label className="f" style={{ gridColumn: '1/-1' }}>Topic<input type="text" required value={f.topic} onChange={set('topic')} placeholder="e.g. Compound interest, half-yearly" /></label>
          <label className="f" style={{ gridColumn: '1/-1' }}>Correct method or fact<textarea rows="2" required value={f.note} onChange={set('note')} /></label>
          <div style={{ gridColumn: '1/-1' }}><button className="btn" type="submit">Add to log</button></div>
        </form>
      </section>
      <div className="row" style={{ justifyContent: 'space-between' }}>
        <h3>Entries ({state.errors.length}) {due > 0 && <span className="pill bad">{due} due</span>}</h3>
        <div className="seg"><button className="btn ghost sm" aria-pressed={filter === 'open'} onClick={() => setFilter('open')}>Open</button><button className="btn ghost sm" aria-pressed={filter === 'all'} onClick={() => setFilter('all')}>All</button></div>
      </div>
      <section className="card">
        {list.length ? list.map((e) => {
          const isDue = !e.done && e.revisit <= today
          return (
            <div className="mock" key={e.id} style={{ gridTemplateColumns: '1fr' }}>
              <div>
                <span className="chip">{e.sub}</span> <span className="chip">{e.cause}</span>{' '}
                {e.done ? <span className="pill ok">Mastered</span> : isDue ? <span className="pill bad">Revisit now</span> : <span className="small muted">Revisit {fmt(parse(e.revisit))}</span>}
                <div style={{ marginTop: 4 }}><b>{e.topic}</b></div>
                <div className="small">{e.note}</div>
                <div className="row" style={{ marginTop: 6 }}>
                  <button className="btn ghost sm" onClick={() => patch(e.id, (x) => { x.done = !x.done })}>{e.done ? 'Reopen' : 'Redone correctly'}</button>
                  {!e.done && <button className="btn ghost sm" onClick={() => patch(e.id, (x) => { x.revisit = iso(addDays(parse(today), 7)) })}>Push 7 days</button>}
                  <button className="btn ghost sm" onClick={() => update((s) => { s.errors = s.errors.filter((x) => x.id !== e.id) })}>Delete</button>
                </div>
              </div>
            </div>
          )
        }) : <div className="empty">{state.errors.length ? 'Nothing open. Switch to All to see mastered entries.' : 'No entries yet. Your first mock will fill this.'}</div>}
      </section>
    </>
  )
}
