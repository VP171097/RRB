import { useEffect, useState } from 'react'
import { useApp } from '../store.jsx'
import { useExam } from '../exam.jsx'
import { Ring } from '../widgets.jsx'
import { Bar } from '../ui.jsx'
import { notify, confetti, sfx } from '../fx.jsx'
import { intent } from '../nav.js'
import { todayIso, iso, addDays, parse, round1 } from '../lib.js'

const PRESETS = [25, 45, 60, 0]
const TKEY = 'ntpc-prep-timer-v2'
const mmss = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`

export default function Focus() {
  const { state, update } = useApp()
  const X = useExam()
  const LOG_SUBS = [...X.SUBS, 'Mock + analysis', 'Revision']
  const SUB_CLS = { ...X.colorOf, 'Mock + analysis': 'mock', Revision: 'rev' }
  const hint = intent.focus
  useEffect(() => { intent.focus = null }, [])
  const [sub, setSub] = useState(LOG_SUBS.includes(hint?.sub) ? hint.sub : LOG_SUBS[0])
  const [mins, setMins] = useState(hint?.min ?? 25)
  const [manual, setManual] = useState('30')
  const [run, setRun] = useState(() => { try { return JSON.parse(localStorage.getItem(TKEY)) } catch { return null } })
  const [now, setNow] = useState(Date.now())

  useEffect(() => {
    if (!run) return
    const id = setInterval(() => setNow(Date.now()), 250)
    return () => clearInterval(id)
  }, [run])

  const add = (day, s, m) => update((st) => { const d = (st.log[day] ||= {}); d[s] = (d[s] || 0) + m })
  const persist = (r) => { try { r ? localStorage.setItem(TKEY, JSON.stringify(r)) : localStorage.removeItem(TKEY) } catch { /* ignore */ } setRun(r) }
  const start = () => { persist({ sub, at: Date.now(), dur: mins * 60 }); setNow(Date.now()) }
  const finish = (auto) => {
    const m = Math.max(0, Math.round((Math.min(Date.now(), run.dur ? run.at + run.dur * 1000 : Date.now()) - run.at) / 60000))
    if (m > 0) add(todayIso(), run.sub, m)
    persist(null)
    if (auto) { notify(`Session complete: ${m} min of ${run.sub}`, 'badge'); confetti(90); sfx('done') }
  }
  const elapsed = run ? Math.floor((now - run.at) / 1000) : 0
  const left = run && run.dur ? Math.max(0, run.dur - elapsed) : 0
  useEffect(() => { if (run && run.dur && elapsed >= run.dur) finish(true) }) // eslint-disable-line react-hooks/exhaustive-deps

  const today = todayIso()
  const days = Array.from({ length: 7 }, (_, i) => iso(addDays(parse(today), i - 6)))
  const total = (d) => Object.values(state.log[d] || {}).reduce((a, b) => a + b, 0)
  const week = days.reduce((a, d) => a + total(d), 0)
  const mxDay = Math.max(60, ...days.map(total))
  const target = state.settings.dailyHours * 60
  const todayBy = state.log[today] || {}
  const sc = SUB_CLS[run ? run.sub : sub]
  const progress = run ? (run.dur ? (elapsed / run.dur) * 100 : (elapsed % 3600) / 36) : 0

  return (
    <>
      <h2>Focus</h2>
      <section className={'card focus s-' + sc}>
        <Ring value={progress} size={200} stroke={14} color="var(--sc)" label="Focus timer">
          <div className="timer">{run ? (run.dur ? mmss(left) : mmss(elapsed)) : mins ? mmss(mins * 60) : '00:00'}</div>
          <div className="small muted">{run ? `${run.sub}${run.dur ? '' : ' · stopwatch'}` : 'ready'}</div>
        </Ring>
        <div className="seg" role="group" aria-label="Subject">
          {LOG_SUBS.map((s) => <button key={s} className={'btn ghost sm sbtn s-' + SUB_CLS[s]} disabled={!!run} aria-pressed={(run ? run.sub : sub) === s} onClick={() => setSub(s)}>{s}</button>)}
        </div>
        {!run && (
          <div className="seg" role="group" aria-label="Length">
            {PRESETS.map((p) => <button key={p} className="btn ghost sm" aria-pressed={mins === p} onClick={() => setMins(p)}>{p ? p + ' min' : 'Stopwatch'}</button>)}
          </div>
        )}
        {run
          ? <div className="row"><button className="btn" onClick={() => finish(false)}>{run.dur ? 'End early and save' : 'Stop and save'}</button><button className="btn ghost" onClick={() => persist(null)}>Discard</button></div>
          : <button className="btn big-btn" onClick={() => { sfx('ok'); start() }}>Start focus</button>}
        <p className="small muted" style={{ margin: 0, textAlign: 'center' }}>Keeps running if you reload. Saved minutes earn XP.</p>
      </section>

      <section className="card">
        <div className="row" style={{ justifyContent: 'space-between' }}><h3>Today</h3><span className="small num muted">{round1(total(today) / 60)}h of {state.settings.dailyHours}h</span></div>
        <div style={{ margin: '8px 0 10px' }}><Bar a={total(today)} b={target} /></div>
        {Object.keys(todayBy).length ? Object.entries(todayBy).map(([s, m]) => (
          <div className={'row small s-' + SUB_CLS[s]} key={s} style={{ justifyContent: 'space-between' }}><span><i className="dot" style={{ background: 'var(--sc)' }} /> {s}</span><span className="num">{m} min</span></div>
        )) : <div className="empty">Nothing logged today.</div>}
        <div className="row" style={{ marginTop: 12 }}>
          <input type="number" min="1" style={{ width: 90 }} aria-label="Minutes" value={manual} onChange={(e) => setManual(e.target.value)} />
          <span className="small muted">min to</span>
          <span className="small"><b>{sub}</b></span>
          <button className="btn ghost sm" onClick={() => +manual > 0 && add(today, sub, Math.round(+manual))}>Add by hand</button>
        </div>
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
