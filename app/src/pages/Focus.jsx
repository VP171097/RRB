import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { useApp } from '../store.jsx'
import { useT } from '../i18n.jsx'
import { useExam } from '../exam.jsx'
import { Ring } from '../widgets.jsx'
import { Bar } from '../ui.jsx'
import { notify, confetti, sfx } from '../fx.jsx'
import { intent } from '../nav.js'
import { todayIso, iso, addDays, parse, round1, dayName } from '../lib.js'

const PRESETS = [25, 45, 60, 0]
const TKEY = 'ntpc-prep-timer-v2'
const mmss = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`

export default function Focus() {
  const t = useT()
  const { state, update } = useApp()
  const X = useExam()
  const LOG_SUBS = [...X.SUBS, 'Mock + analysis', 'Revision']
  const SUB_CLS = { ...X.colorOf, 'Mock + analysis': 'mock', Revision: 'rev' }
  const hint = intent.focus
  useEffect(() => { intent.focus = null }, [])
  const [sub, setSub] = useState(LOG_SUBS.includes(hint?.sub) ? hint.sub : LOG_SUBS[0])
  const [mins, setMins] = useState(hint?.min ?? 25)
  const [manual, setManual] = useState('30')
  // run: { sub, dur, acc, since }. acc = seconds already run; since = when the current stretch began, or null while paused.
  const [run, setRun] = useState(() => {
    try {
      const r = JSON.parse(localStorage.getItem(TKEY))
      return r && r.at != null ? { sub: r.sub, dur: r.dur, acc: 0, since: r.at } : r
    } catch { return null }
  })
  const [now, setNow] = useState(Date.now())

  useEffect(() => {
    if (!run || !run.since) return
    const id = setInterval(() => setNow(Date.now()), 250)
    return () => clearInterval(id)
  }, [run])

  // The timer covers the whole screen while it runs, and the screen is kept awake where the browser allows it.
  useEffect(() => {
    if (!run) return
    document.body.classList.add('focus-open')
    let lock = null
    const hold = () => { try { navigator.wakeLock?.request('screen').then((l) => { lock = l }).catch(() => {}) } catch { /* not supported */ } }
    hold()
    const vis = () => { if (document.visibilityState === 'visible') hold() }
    document.addEventListener('visibilitychange', vis)
    return () => { document.body.classList.remove('focus-open'); document.removeEventListener('visibilitychange', vis); try { lock?.release() } catch { /* ignore */ } }
  }, [!!run]) // eslint-disable-line react-hooks/exhaustive-deps

  const add = (day, s, m) => update((st) => { const d = (st.log[day] ||= {}); d[s] = (d[s] || 0) + m })
  const persist = (r) => { try { r ? localStorage.setItem(TKEY, JSON.stringify(r)) : localStorage.removeItem(TKEY) } catch { /* ignore */ } setRun(r) }
  const secs = (r, at) => Math.floor((r.acc || 0) + (r.since ? (at - r.since) / 1000 : 0))
  const start = () => { try { document.documentElement.requestFullscreen?.({ navigationUI: 'hide' }).catch(() => {}) } catch { /* not allowed here */ } persist({ sub, dur: mins * 60, acc: 0, since: Date.now() }); setNow(Date.now()) }
  const pause = () => persist({ ...run, acc: secs(run, Date.now()), since: null })
  const resume = () => { persist({ ...run, since: Date.now() }); setNow(Date.now()) }
  const discard = () => { persist(null); try { if (document.fullscreenElement) document.exitFullscreen() } catch { /* ignore */ } }
  const finish = (auto) => {
    const sec = secs(run, Date.now())
    const m = Math.max(0, Math.round((run.dur ? Math.min(sec, run.dur) : sec) / 60))
    if (m > 0) add(todayIso(), run.sub, m)
    persist(null)
    try { if (document.fullscreenElement) document.exitFullscreen() } catch { /* ignore */ }
    if (auto) { notify('Session complete: {m} min of {sub}', 'badge', { m, sub: t(run.sub) }); confetti(120); sfx('celebrate'); try { navigator.vibrate?.([200, 100, 200]) } catch { /* ignore */ } }
  }
  const elapsed = run ? secs(run, Math.max(now, run.since || 0)) : 0
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

  const paused = run && !run.since
  return (
    <>
      {run && createPortal(
        <div className={'focus-full s-' + sc + (paused ? ' paused' : '')} role="dialog" aria-modal="true" aria-label={t('Focus timer')}>
          <Ring value={progress} size={Math.min(360, Math.round(Math.min(window.innerWidth, window.innerHeight) * 0.72))} stroke={16} color="#ffffff" label={t('Focus timer')}>
            <div className="ff-time" aria-label={t(run.sub)}>{run.dur ? mmss(left) : mmss(elapsed)}</div>
          </Ring>
          <div className="ff-actions">
            <button className="btn big-btn" onClick={paused ? resume : pause}>{paused ? t('Resume') : t('Pause')}</button>
            <button className="btn ghost big-btn" onClick={() => finish(false)}>{run.dur ? t('End and save') : t('Stop and save')}</button>
          </div>
          <button className="ff-discard" onClick={discard}>{t('Discard without saving')}</button>
        </div>,
        document.body
      )}
      <h2>{t('Focus')}</h2>
      <section className={'card focus s-' + sc}>
        <Ring value={progress} size={200} stroke={14} color="var(--sc)" label={t('Focus timer')}>
          <div className="timer">{run ? (run.dur ? mmss(left) : mmss(elapsed)) : mins ? mmss(mins * 60) : '00:00'}</div>
          <div className="small muted">{run ? `${t(run.sub)}${run.dur ? '' : ' · ' + t('stopwatch')}` : t('ready')}</div>
        </Ring>
        <div className="seg" role="group" aria-label={t('Subject')}>
          {LOG_SUBS.map((s) => <button key={s} className={'btn ghost sm sbtn s-' + SUB_CLS[s]} disabled={!!run} aria-pressed={(run ? run.sub : sub) === s} onClick={() => setSub(s)}>{t(s)}</button>)}
        </div>
        {(
          <div className="seg" role="group" aria-label={t('Length')}>
            {PRESETS.map((p) => <button key={p} className="btn ghost sm" aria-pressed={mins === p} onClick={() => setMins(p)}>{p ? t('{n} min', { n: p }) : t('Stopwatch')}</button>)}
          </div>
        )}
        <button className="btn big-btn" onClick={() => { sfx('ok'); start() }}>{t('Start focus')}</button>
        <p className="small muted" style={{ margin: 0, textAlign: 'center' }}>{t('Keeps running if you reload. Saved minutes earn XP.')}</p>
      </section>

      <section className="card">
        <div className="row" style={{ justifyContent: 'space-between' }}><h3>{t('Today')}</h3><span className="small num muted">{t('{a}h of {b}h', { a: round1(total(today) / 60), b: state.settings.dailyHours })}</span></div>
        <div style={{ margin: '8px 0 10px' }}><Bar a={total(today)} b={target} /></div>
        {Object.keys(todayBy).length ? Object.entries(todayBy).map(([s, m]) => (
          <div className={'row small s-' + SUB_CLS[s]} key={s} style={{ justifyContent: 'space-between' }}><span><i className="dot" style={{ background: 'var(--sc)' }} /> {t(s)}</span><span className="num">{t('{n} min', { n: m })}</span></div>
        )) : <div className="empty">{t('Nothing logged today.')}</div>}
        <div className="row" style={{ marginTop: 12 }}>
          <input type="number" min="1" style={{ width: 90 }} aria-label={t('Minutes')} value={manual} onChange={(e) => setManual(e.target.value)} />
          <span className="small muted">{t('min to')}</span>
          <span className="small"><b>{t(sub)}</b></span>
          <button className="btn ghost sm" onClick={() => +manual > 0 && add(today, sub, Math.round(+manual))}>{t('Add by hand')}</button>
        </div>
      </section>

      <section className="card">
        <div className="row" style={{ justifyContent: 'space-between' }}><h3>{t('Last 7 days')}</h3><span className="small num muted">{t('{n}h total', { n: round1(week / 60) })}</span></div>
        <div className="hbar" style={{ marginTop: 12 }} role="img" aria-label={t('Study hours per day')}>
          {days.map((d) => (
            <div key={d}><span className="num">{round1(total(d) / 60)}</span><i style={{ height: (total(d) / mxDay) * 80 + '%' }} /><span>{dayName(parse(d), 'narrow')}</span></div>
          ))}
        </div>
      </section>
    </>
  )
}
