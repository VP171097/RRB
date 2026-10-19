import { useState } from 'react'
import { useApp } from '../store.jsx'
import { DAYS } from '../data/plan.js'
import { Bar, TaskList } from '../ui.jsx'
import { fmt } from '../lib.js'

export default function Days() {
  const { today, dateOf, dayDone, dayFull } = useApp()
  const [filter, setFilter] = useState('all')
  const curW = Math.floor((Math.max(1, Math.min(today, 91)) - 1) / 7) + 1
  const weeks = []
  for (let w = 1; w <= 13; w++) {
    const ds = DAYS.slice((w - 1) * 7, w * 7)
    const a = ds.reduce((s, d) => s + dayDone(d.n), 0)
    const b = ds.reduce((s, d) => s + d.tasks.length, 0)
    const shown = ds.filter((d) => filter === 'all' || !dayFull(d.n))
    if (!shown.length) continue
    weeks.push(
      <details key={w} open={w === curW}>
        <summary>
          <span className="grow"><h3>Week {w} <span className="chip p1">{ds[0].ph.name}</span></h3><div style={{ marginTop: 8 }}><Bar a={a} b={b} /></div></span>
          <span className="small num muted">{a}/{b}</span>
        </summary>
        <div className="in">
          {shown.map((d) => {
            const dn = dayDone(d.n), full = dn === d.tasks.length
            return (
              <details key={d.n} open={d.n === today}>
                <summary>
                  <span className="grow"><b>Day {d.n}</b> <span className="muted small">{fmt(dateOf(d.n))}</span>{d.n === today && <> <span className="chip now">Today</span></>}<br /><span className="small muted">{d.sum}</span></span>
                  <span className="small num" style={full ? { color: 'var(--ok)', fontWeight: 600 } : { color: 'var(--muted)' }}>{dn}/{d.tasks.length}</span>
                </summary>
                <div className="in"><TaskList n={d.n} /></div>
              </details>
            )
          })}
        </div>
      </details>
    )
  }
  return (
    <>
      <div className="row" style={{ justifyContent: 'space-between' }}>
        <h2>91-day plan</h2>
        <div className="seg">
          <button className="btn ghost sm" aria-pressed={filter === 'all'} onClick={() => setFilter('all')}>All</button>
          <button className="btn ghost sm" aria-pressed={filter === 'pending'} onClick={() => setFilter('pending')}>Unfinished</button>
        </div>
      </div>
      {weeks}
    </>
  )
}
