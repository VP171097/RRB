import { useEffect, useRef, useState } from 'react'
import { useApp } from '../store.jsx'
import { useT } from '../i18n.jsx'
import { confetti, sfx } from '../fx.jsx'
import { intent } from '../nav.js'
import { todayIso } from '../lib.js'

const ri = (a, b) => a + ((Math.random() * (b - a + 1)) | 0)
const FP = [[1, 2, 50], [1, 4, 25], [1, 5, 20], [1, 8, 12.5], [1, 10, 10], [1, 20, 5], [3, 4, 75], [3, 8, 37.5], [5, 8, 62.5], [7, 8, 87.5], [2, 5, 40], [3, 5, 60], [1, 16, 6.25], [1, 3, 33.33], [1, 6, 16.67], [1, 12, 8.33]]
const PCS = [5, 10, 12.5, 15, 20, 25, 30, 40, 60, 75]
const GEN = {
  sq: () => { const n = ri(11, 50); return { q: `${n}²`, a: n * n } },
  cu: () => { const n = ri(3, 20); return { q: `${n}³`, a: n ** 3 } },
  mul: () => { const a = ri(12, 49), b = ri(3, 9); return { q: `${a} × ${b}`, a: a * b } },
  fp: () => { const [a, b, p] = FP[ri(0, FP.length - 1)]; return { q: `${a}/${b} as a percent`, fp: { a, b }, a: p, tol: 0.05 } },
  pc: () => { const p = PCS[ri(0, PCS.length - 1)], n = 40 * ri(1, 20); return { q: `${p}% of ${n}`, a: (n * p) / 100 } },
  sr: () => { const m = ri(11, 50); return { q: `√${m * m}`, a: m } },
}
GEN.mix = () => GEN[['sq', 'cu', 'mul', 'fp', 'pc', 'sr'][ri(0, 5)]]()
const MODES = [['mix', 'Mixed'], ['sq', 'Squares'], ['cu', 'Cubes'], ['mul', 'Multiply'], ['fp', 'Fraction to %'], ['pc', '% of a number'], ['sr', 'Square roots']]
const SECONDS = 60

export default function Speed() {
  const t = useT()
  const { state, update } = useApp()
  const [mode, setMode] = useState(intent.speedMode || 'mix')
  useEffect(() => { intent.speedMode = null }, [])
  const [phase, setPhase] = useState('setup')
  const [q, setQ] = useState(null)
  const [val, setVal] = useState('')
  const [end, setEnd] = useState(0)
  const [now, setNow] = useState(Date.now())
  const [stats, setStats] = useState({ score: 0, ok: 0, bad: 0, combo: 0, maxCombo: 0 })
  const [flash, setFlash] = useState(null)
  const [fin, setFin] = useState(null)
  const inp = useRef(null)
  const st = useRef(stats); st.current = stats

  const start = () => {
    setStats({ score: 0, ok: 0, bad: 0, combo: 0, maxCombo: 0 }); setQ(GEN[mode]()); setVal(''); setFlash(null)
    setEnd(Date.now() + SECONDS * 1000); setNow(Date.now()); setPhase('play'); sfx('ok')
    setTimeout(() => inp.current?.focus(), 50)
  }
  useEffect(() => {
    if (phase !== 'play') return
    const id = setInterval(() => setNow(Date.now()), 100)
    return () => clearInterval(id)
  }, [phase])
  useEffect(() => { if (phase === 'play' && now >= end) stop() }) // eslint-disable-line react-hooks/exhaustive-deps

  function stop() {
    const s = st.current
    const prevBest = state.speed.best[mode] || 0
    const record = s.score > prevBest && s.score > 0
    update((x) => { x.speed.xp += Math.round(s.score / 20); x.speed.best[mode] = Math.max(prevBest, s.score); const d = (x.speed.daily ||= {}), k = todayIso(); d[k] = Math.max(d[k] || 0, s.score) })
    setFin({ ...s, record, prevBest }); setPhase('result')
    if (record) { confetti(120); sfx('done') }
  }
  const submit = (e) => {
    e.preventDefault()
    if (val.trim() === '') return
    const good = Math.abs(parseFloat(val) - q.a) <= (q.tol || 0)
    setStats((s) => {
      const combo = good ? s.combo + 1 : 0
      const mult = 1 + Math.min(3, Math.floor(s.combo / 5))
      return { score: s.score + (good ? 10 * mult : 0), ok: s.ok + (good ? 1 : 0), bad: s.bad + (good ? 0 : 1), combo, maxCombo: Math.max(s.maxCombo, combo) }
    })
    setFlash(good ? 'ok' : 'bad'); sfx(good ? 'tick' : 'bad')
    setTimeout(() => setFlash(null), 250)
    setQ(GEN[mode]()); setVal('')
    inp.current?.focus()
  }
  const left = Math.max(0, (end - now) / 1000)

  if (phase === 'setup') {
    return (
      <>
        <section className="card">
          <h3>{t('Speed Maths sprint')}</h3>
          <p className="small muted" style={{ margin: '4px 0 12px' }}>{t('60 seconds. Type the answer and press Enter. Each correct answer scores 10, and every 5 in a row raises your multiplier up to 4x. A miss resets the combo. Build the calculation speed you need in the 30-question Maths section.')}</p>
          <div className="seg" role="group" aria-label={t('Drill type')}>
            {MODES.map(([k, l]) => <button key={k} className="btn ghost sm" aria-pressed={mode === k} onClick={() => setMode(k)}>{t(l)}</button>)}
          </div>
          <div className="row" style={{ margin: '12px 0' }}><span className="small muted">{t('Your best in this drill:')}</span><b className="num">{state.speed.best[mode] || 0}</b></div>
          <button className="btn big-btn" onClick={start}>{t('Start sprint')}</button>
        </section>
        <section className="card"><h3>{t('Personal bests')}</h3>
          {MODES.map(([k, l]) => <div className="row small" key={k} style={{ justifyContent: 'space-between' }}><span>{t(l)}</span><b className="num">{state.speed.best[k] || 0}</b></div>)}</section>
      </>
    )
  }
  if (phase === 'play') {
    const mult = 1 + Math.min(3, Math.floor(stats.combo / 5))
    return (
      <section className={'card speed flash-' + (flash || 'none')}>
        <div className="row" style={{ justifyContent: 'space-between' }}>
          <div><div className="lab2">{t('Score')}</div><b className="sc num">{stats.score}</b></div>
          <div style={{ textAlign: 'center' }}><div className="lab2">{t('Combo')}</div><b className="sc num">{stats.combo}{mult > 1 && <span className="mult"> x{mult}</span>}</b></div>
          <div style={{ textAlign: 'right' }}><div className="lab2">{t('Time')}</div><b className="sc num" style={{ color: left < 10 ? 'var(--bad)' : undefined }}>{Math.ceil(left)}</b></div>
        </div>
        <div className="bar" style={{ marginTop: 8 }}><i style={{ width: (left / SECONDS) * 100 + '%', background: left < 10 ? 'var(--bad)' : 'var(--accent)', transition: 'none' }} /></div>
        <div className="sq" aria-live="polite">{q.fp ? t('{a}/{b} as a percent', q.fp) : q.q}</div>
        <form onSubmit={submit} className="row" style={{ flexWrap: 'nowrap' }}>
          <input ref={inp} className="speed-in" type="text" inputMode="decimal" autoComplete="off" autoFocus value={val} onChange={(e) => setVal(e.target.value)} placeholder={t('Answer')} aria-label={t('Answer')} />
          <button className="btn" type="submit">{t('Enter')}</button>
        </form>
        <div className="row small muted" style={{ justifyContent: 'space-between', marginTop: 10 }}><span>{t('{ok} right · {bad} wrong', stats)}</span><button className="linkbtn" onClick={() => { setStats((s) => ({ ...s, combo: 0 })); setQ(GEN[mode]()); setVal(''); inp.current?.focus() }}>{t('Skip')}</button></div>
      </section>
    )
  }
  const acc = fin.ok + fin.bad ? Math.round((fin.ok * 100) / (fin.ok + fin.bad)) : 0
  return (
    <section className="card result">
      <div className="lab2">{t('Sprint over')}{fin.record ? ' · ' + t('new personal best') : ''}</div>
      <div className="sc num" style={{ fontSize: 56 }}>{fin.score}</div>
      <p className="small muted" style={{ margin: 0 }}>{t('{ok} right · {bad} wrong · {acc}% accuracy · best combo {maxCombo} · +{xp} XP', { ...fin, acc, xp: Math.round(fin.score / 20) })}</p>
      <p className="small" style={{ margin: '8px 0 0' }}>{t('{ok} answers in 60 s is {per} s per question. The exam gives you about 70 s per Maths question, so aim to answer simple calculations in under 5 s.', { ok: fin.ok, per: (60 / Math.max(1, fin.ok + fin.bad)).toFixed(1) })}</p>
      <div className="row" style={{ marginTop: 12 }}><button className="btn" onClick={start}>{t('Go again')}</button><button className="btn ghost" onClick={() => setPhase('setup')}>{t('Change drill')}</button></div>
    </section>
  )
}
