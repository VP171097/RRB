import { useEffect, useRef, useState } from 'react'
import { useApp } from '../store.jsx'
import { Bar } from '../ui.jsx'
import { todayIso, iso, addDays, parse, round1 } from '../lib.js'

const LOG_SUBS = ['Maths', 'Reasoning', 'GA', 'Mock + analysis', 'Revision']
const TKEY = 'ntpc-prep-timer'
const mmss = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`

export default function Log() {
  const { state, update } = useApp()
  const [sub, setSub] = useState(LOG_SUBS[0])
  const [running, setRunning] = useState(() => { try { return JSON.parse(localStorage.getItem(TKEY)) } catch { return null } })
  const [now, setNow] = useState(Date.now())
  const [manual, setManual] = useState('30')
  const tick = useRef(0)

  useEffect(() => {
    if (!running) return
    tick.current = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(tick.current)
  }, [running])

  const add = (day, s, mins) => update((st) => { const d = (st.log[day] ||= {}); d[s] = (d[s] || 0) + mins })
  const start = () => { const r = { sub, at: Date.now() }; try { localStorage.setItem(TKEY, JSON.stringify(r)) } catch { /* ignore */ } setRunning(r); setNow(Date.now()) }
  const stop = () => {
    const mins = Math.round((Date.now() - running.at) / 60000)
    if (mins > 0) add(todayIso(), running.sub, mins)
    try { localStorage.removeItem(TKEY) } catch { /* ignore */ }
    setRunning(null)
  }
  const elapsed = running ? Math.floor((now - running.at) / 1000) : 0

  const today = todayIso()
  const days = Array.from({ length: 7 }, (_, i) => iso(addDays(parse(today), i - 6)))
  const total = (d) => Object.values(state.log[d] || {}).reduce((a, b) => a + b, 0)
  const week = days.reduce((a, d) => a + total(d), 0)
  const mxDay = Math.max(60, ...days.map(total))
  const target = state.settings.dailyHours * 60
  const todayBy = state.log[today] || {}

  return (
    <>
      <h2>Study log</h2>
      <section className="card" style={{ display: 'grid', gap: 12 }}>
        <div className="row" style={{ justifyContent: 'space-between' }}>
          <div className="timer">{running ? mmss(elapsed) : '00:00'}</div>
          <span className="small muted">{running ? `Timing ${running.sub}` : 'Timer stopped'}</span>
        </div>
        <div className="row">
          <label className="f grow" style={{ minWidth: 160 }}>Subject
            <select value={running ? running.sub : sub} disabled={!!running} onChange={(e) => setSub(e.target.value)}>{LOG_SUBS.map((s) => <option key={s}>{s}</option>)}</select>
          </label>
          {running ? <button className="btn" onClick={stop}>Stop and save</button> : <button className="btn" onClick={start}>Start timer</button>}
        </div>
        <p className="small muted" style={{ margin: 0 }}>The timer keeps running if you reload the page. Stopping saves whole minutes to today.</p>
      </section>

      <section className="card">
        <h3>Add minutes by hand</h3>
        <div className="row" style={{ marginTop: 8 }}>
          <input type="number" min="1" style={{ width: 100 }} aria-label="Minutes" value={manual} onChange={(e) => setManual(e.target.value)} />
          <span className="small muted">min to</span>
          <select style={{ width: 'auto' }} value={sub} onChange={(e) => setSub(e.target.value)} aria-label="Subject for manual entry">{LOG_SUBS.map((s) => <option key={s}>{s}</option>)}</select>
          <button className="btn ghost" onClick={() => +manual > 0 && add(today, sub, Math.round(+manual))}>Add</button>
        </div>
      </section>

      <section className="card">
        <div className="row" style={{ justifyContent: 'space-between' }}><h3>Today</h3><span className="small num muted">{round1(total(today) / 60)}h of {state.settings.dailyHours}h</span></div>
        <div style={{ margin: '8px 0 10px' }}><Bar a={total(today)} b={target} /></div>
        {Object.keys(todayBy).length ? Object.entries(todayBy).map(([s, m]) => (
          <div className="row small" key={s} style={{ justifyContent: 'space-between' }}><span>{s}</span><span className="num">{m} min</span></div>
        )) : <div className="empty">Nothing logged today.</div>}
      </section>

      <section className="card">
        <div className="row" style={{ justifyContent: 'space-between' }}><h3>Last 7 days</h3><span className="small num muted">{round1(week / 60)}h total</span></div>
        <div className="hbar" style={{ marginTop: 12 }} role="img" aria-label="Study hours per day">
          {days.map((d) => (
            <div key={d}><span className="num">{round1(total(d) / 60)}</span><i style={{ height: (total(d) / mxDay) * 80 + '%' }} /><span>{parse(d).toLocaleDateString(undefined, { weekday: 'narrow' })}</span></div>
          ))}
        </div>
      </section>
    </>
  )
}
