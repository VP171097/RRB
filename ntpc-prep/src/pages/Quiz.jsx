import { useEffect, useMemo, useRef, useState } from 'react'
import { useApp } from '../store.jsx'
import { QUIZ, QUIZ_CATS } from '../data/quiz.js'
import { Bar } from '../ui.jsx'
import { confetti, notify, sfx } from '../fx.jsx'
import { uid, iso, addDays, parse, todayIso, round1 } from '../lib.js'

const shuffle = (a) => { const b = [...a]; for (let i = b.length - 1; i > 0; i--) { const j = (Math.random() * (i + 1)) | 0; [b[i], b[j]] = [b[j], b[i]] } return b }
const prep = (q) => { const idx = shuffle([0, 1, 2, 3]); return { ...q, opts: idx.map((i) => q.o[i]), ans: idx.indexOf(q.a) } }
const LABELS = ['A', 'B', 'C', 'D']

export default function Quiz() {
  const { state, update } = useApp()
  const [cat, setCat] = useState('All')
  const [count, setCount] = useState(10)
  const [mode, setMode] = useState('learn')
  const [phase, setPhase] = useState('setup')
  const [qs, setQs] = useState([])
  const [i, setI] = useState(0)
  const [picks, setPicks] = useState([])
  const [shown, setShown] = useState(false)
  const [end, setEnd] = useState(0)
  const [now, setNow] = useState(Date.now())
  const [saved, setSaved] = useState(false)
  const result = useRef(null)

  const pool = useMemo(() => QUIZ.filter((q) => cat === 'All' || q.cat === cat), [cat])
  const n = Math.min(count || pool.length, pool.length)

  const begin = () => {
    const set = shuffle(pool).slice(0, n).map(prep)
    setQs(set); setPicks(Array(set.length).fill(null)); setI(0); setShown(false); setSaved(false)
    setEnd(Date.now() + set.length * 54000); setNow(Date.now()); setPhase('play'); sfx('ok')
  }
  useEffect(() => {
    if (phase !== 'play' || mode !== 'exam') return
    const id = setInterval(() => setNow(Date.now()), 500)
    return () => clearInterval(id)
  }, [phase, mode])
  useEffect(() => { if (phase === 'play' && mode === 'exam' && now >= end) finish(picks) }) // eslint-disable-line react-hooks/exhaustive-deps

  const pick = (k) => {
    if (mode === 'learn') {
      if (shown) return
      const p = [...picks]; p[i] = k; setPicks(p); setShown(true)
      sfx(k === qs[i].ans ? 'ok' : 'bad')
    } else {
      const p = [...picks]; p[i] = p[i] === k ? null : k; setPicks(p)
    }
  }
  const next = () => {
    if (i + 1 >= qs.length) return finish(picks)
    setI(i + 1); setShown(false)
  }
  const finish = (pk) => {
    const correct = qs.filter((q, x) => pk[x] === q.ans).length
    const wrong = qs.filter((q, x) => pk[x] !== null && pk[x] !== q.ans).length
    const acc = correct + wrong ? Math.round((correct * 100) / (correct + wrong)) : 0
    const accAll = Math.round((correct * 100) / qs.length)
    const score = round1(correct - wrong / 3)
    const gained = correct * (mode === 'exam' ? 4 : 3) + (qs.length >= 10 && accAll >= 80 ? 10 : 0)
    result.current = { correct, wrong, skipped: qs.length - correct - wrong, acc, accAll, score, gained, picks: pk }
    update((s) => {
      s.quiz.xp += gained; s.quiz.played += 1
      s.quiz.best = Math.max(s.quiz.best, accAll)
      if (qs.length >= 10 && accAll >= 90) s.quiz.sharp = (s.quiz.sharp || 0) + 1
    })
    setPhase('result')
    if (accAll >= 80) { confetti(120); sfx('done') } else sfx('ok')
  }
  const saveWrong = () => {
    const r = result.current, base = iso(addDays(parse(todayIso()), 7))
    update((s) => {
      qs.forEach((q, x) => {
        if (r.picks[x] !== null && r.picks[x] !== q.ans) s.errors.push({ id: uid(), sub: q.s, cause: 'Did not know', topic: q.q.slice(0, 80), note: `${q.opts[q.ans]}. ${q.e}`, revisit: base, done: false })
      })
    })
    setSaved(true); notify('Saved to your error log', 'xp')
  }

  if (phase === 'setup') {
    return (
      <>
        <section className="card">
          <h3>Quick quiz</h3>
          <p className="small muted" style={{ margin: '4px 0 12px' }}>{QUIZ.length} questions across Railways, Polity, Science, History, Geography, Economy, Computers, Maths and Reasoning. Questions and options are shuffled every time.</p>
          <div className="fgrid">
            <label className="f">Topic<select value={cat} onChange={(e) => setCat(e.target.value)}>{QUIZ_CATS.map((c) => <option key={c}>{c}</option>)}</select></label>
            <label className="f">Questions<select value={count} onChange={(e) => setCount(+e.target.value)}><option value={10}>10</option><option value={20}>20</option><option value={0}>All ({pool.length})</option></select></label>
          </div>
          <div className="seg" style={{ margin: '12px 0' }} role="group" aria-label="Mode">
            <button className="btn ghost" aria-pressed={mode === 'learn'} onClick={() => setMode('learn')}>Learn mode</button>
            <button className="btn ghost" aria-pressed={mode === 'exam'} onClick={() => setMode('exam')}>Exam mode</button>
          </div>
          <p className="small muted" style={{ margin: '0 0 12px' }}>{mode === 'learn' ? 'See the answer and a short explanation after every question.' : 'Timed at 54 seconds a question, no feedback until the end, 1/3 negative marking, skipping is free.'}</p>
          <button className="btn big-btn" onClick={begin}>Start quiz ({n} Q)</button>
        </section>
        <section className="card"><div className="row" style={{ justifyContent: 'space-between' }}><span>Quizzes played</span><b className="num">{state.quiz.played}</b></div>
          <div className="row" style={{ justifyContent: 'space-between' }}><span>Best accuracy</span><b className="num">{state.quiz.best}%</b></div>
          <div className="row" style={{ justifyContent: 'space-between' }}><span>Quiz XP</span><b className="num">{state.quiz.xp}</b></div></section>
      </>
    )
  }

  if (phase === 'play') {
    const q = qs[i], p = picks[i], leftS = Math.max(0, Math.round((end - now) / 1000))
    return (
      <section className="card quiz">
        <div className="row" style={{ justifyContent: 'space-between' }}>
          <span className="chip">{q.cat}</span>
          <span className="small num muted">Q {i + 1} / {qs.length}{mode === 'exam' ? ` · ${Math.floor(leftS / 60)}:${String(leftS % 60).padStart(2, '0')}` : ''}</span>
        </div>
        <Bar a={i + (shown ? 1 : 0)} b={qs.length} accent />
        <h3 className="qtext" key={i}>{q.q}</h3>
        <div className="opts" key={'o' + i}>
          {q.opts.map((o, k) => {
            let cls = 'opt'
            if (mode === 'learn' && shown) cls += k === q.ans ? ' right' : k === p ? ' wrong' : ' dim'
            else if (p === k) cls += ' picked'
            return <button key={k} className={cls} onClick={() => pick(k)} disabled={mode === 'learn' && shown}><b>{LABELS[k]}</b><span>{o}</span></button>
          })}
        </div>
        {mode === 'learn' && shown && <div className={'explain ' + (p === q.ans ? 'ok' : 'bad')}><b>{p === q.ans ? 'Correct.' : 'Not quite.'}</b> {q.e}</div>}
        <div className="row" style={{ justifyContent: 'space-between', marginTop: 12 }}>
          {mode === 'exam' ? <button className="btn ghost" onClick={() => { const pk = [...picks]; pk[i] = null; setPicks(pk); next() }}>Skip</button> : <span />}
          <button className="btn" onClick={() => next()} disabled={mode === 'learn' && !shown}>{i + 1 >= qs.length ? 'Finish' : 'Next'}</button>
        </div>
      </section>
    )
  }

  const r = result.current
  return (
    <>
      <section className="card result">
        <div className="lab2">Result · {mode === 'exam' ? 'Exam mode' : 'Learn mode'}</div>
        <div className="sc num" style={{ fontSize: 48 }}>{r.score}<span className="muted" style={{ fontSize: 20 }}> / {qs.length}</span></div>
        <p className="small muted" style={{ margin: 0 }}>{r.correct} right · {r.wrong} wrong · {r.skipped} skipped · {r.acc}% accuracy on attempted · +{r.gained} XP</p>
        <div className="row" style={{ marginTop: 12 }}>
          <button className="btn" onClick={begin}>Play again</button>
          <button className="btn ghost" onClick={() => setPhase('setup')}>Change setup</button>
          {r.wrong > 0 && <button className="btn ghost" disabled={saved} onClick={saveWrong}>{saved ? 'Saved' : 'Save wrong to error log'}</button>}
        </div>
      </section>
      <section className="card">
        <h3>Review</h3>
        {qs.map((q, x) => {
          const pk = r.picks[x], ok = pk === q.ans
          return (
            <div className="res" key={x}>
              <div><span className={'pill ' + (pk === null ? 'prio-Low' : ok ? 'ok' : 'bad')}>{pk === null ? 'Skipped' : ok ? 'Right' : 'Wrong'}</span> <b>{q.q}</b></div>
              <span className="small">Answer: <b>{q.opts[q.ans]}</b>{pk !== null && !ok && <span className="muted"> · you chose {q.opts[pk]}</span>}</span>
              <span className="small muted">{q.e}</span>
            </div>
          )
        })}
      </section>
    </>
  )
}
