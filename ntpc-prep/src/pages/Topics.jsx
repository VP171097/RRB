import { useState } from 'react'
import { useApp } from '../store.jsx'
import { TOPICS, SUBS, COLS } from '../data/plan.js'
import { Bar } from '../ui.jsx'

export default function Topics() {
  const { state, update } = useApp()
  const [sub, setSub] = useState('Maths')
  const list = TOPICS.filter((t) => t.sub === sub)
  const stages = list.reduce((a, t) => a + COLS.filter((_, i) => state.topics[t.k]?.[i]).length, 0)
  return (
    <>
      <h2>Topic tracker</h2>
      <p className="small muted" style={{ margin: 0 }}>Tap to mark each stage. Suggested rhythm: Rev 1 the next day, Rev 2 after a week, Rev 3 after a month.</p>
      <div className="seg" role="group" aria-label="Subject">
        {SUBS.map((s) => {
          const t = TOPICS.filter((x) => x.sub === s)
          const l = t.filter((x) => state.topics[x.k]?.[0]).length
          return <button key={s} className="btn ghost" aria-pressed={sub === s} onClick={() => setSub(s)}>{s} {l}/{t.length}</button>
        })}
      </div>
      <Bar a={stages} b={list.length * 5} accent />
      <section className="card">
        {list.map((t) => (
          <div className="tp" key={t.k}>
            <div className="row" style={{ justifyContent: 'space-between', flexWrap: 'nowrap' }}><span className="nm">{t.name}</span><span className="chip">Day {t.day}</span></div>
            <div className="cols">
              {COLS.map((c, i) => (
                <button key={c} aria-pressed={!!state.topics[t.k]?.[i]}
                  onClick={() => update((s) => { const o = (s.topics[t.k] ||= {}); o[i] = !o[i] })}>{c}</button>
              ))}
            </div>
          </div>
        ))}
      </section>
    </>
  )
}
