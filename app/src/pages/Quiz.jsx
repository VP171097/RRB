import { useEffect, useMemo, useRef, useState } from 'react'
import { useApp } from '../store.jsx'
import { useT } from '../i18n.jsx'
import { useExam } from '../exam.jsx'
import { Pager, usePaged } from '../pager.jsx'
import { Bar } from '../ui.jsx'
import { confetti, notify, sfx } from '../fx.jsx'
import { uid, iso, addDays, parse, todayIso, round1 } from '../lib.js'

const shuffle = (a) => { const b = [...a]; for (let i = b.length - 1; i > 0; i--) { const j = (Math.random() * (i + 1)) | 0; [b[i], b[j]] = [b[j], b[i]] } return b }
const prep = (q) => { const idx = shuffle([0, 1, 2, 3]); return { ...q, opts: idx.map((i) => q.o[i]), ans: idx.indexOf(q.a) } }
const LABELS = ['A', 'B', 'C', 'D']

export default function Quiz() {
  const t = useT()
  const { state, update } = useApp()
  const { QUIZ, QUIZ_CATS } = useExam()
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
  const reviewPg = usePaged(qs, 6)

  const pool = useMemo(() => QUIZ.filter((q) => cat === 'All' || q.cat === cat), [cat, QUIZ])
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
      if (qs.length >= 10) { const d = (s.quiz.daily ||= {}), k = todayIso(); d[k] = Math.max(d[k] || 0, accAll) }
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
          <h3>{t('Quick quiz')}</h3>
          <p className="small muted" style={{ margin: '4px 0 12px' }}>{t('{n} questions across {cats}. Questions and options are shuffled every time.', { n: QUIZ.length, cats: QUIZ_CATS.filter((c) => c !== 'All').map((c) => t(c)).join(', ') })}</p>
          <div className="fgrid">
            <label className="f">{t('Topic')}<select value={cat} onChange={(e) => setCat(e.target.value)}>{QUIZ_CATS.map((c) => <option key={c} value={c}>{t(c)}</option>)}</select></label>
            <label className="f">{t('Questions')}<select value={count} onChange={(e) => setCount(+e.target.value)}><option value={10}>10</option><option value={20}>20</option><option value={0}>{t('All ({n})', { n: pool.length })}</option></select></label>
          </div>
          <div className="seg" style={{ margin: '12px 0' }} role="group" aria-label={t('Mode')}>
            <button className="btn ghost" aria-pressed={mode === 'learn'} onClick={() => setMode('learn')}>{t('Learn mode')}</button>
            <button className="btn ghost" aria-pressed={mode === 'exam'} onClick={() => setMode('exam')}>{t('Exam mode')}</button>
          </div>
          <p className="small muted" style={{ margin: '0 0 12px' }}>{mode === 'learn' ? t('See the answer and a short explanation after every question.') : t('Timed at 54 seconds a question, no feedback until the end, 1/3 negative marking, skipping is free.')}</p>
          <button className="btn big-btn" onClick={begin}>{t('Start quiz ({n} Q)', { n })}</button>
        </section>
        <section className="card"><div className="row" style={{ justifyContent: 'space-between' }}><span>{t('Quizzes played')}</span><b className="num">{state.quiz.played}</b></div>
          <div className="row" style={{ justifyContent: 'space-between' }}><span>{t('Best accuracy')}</span><b className="num">{state.quiz.best}%</b></div>
          <div className="row" style={{ justifyContent: 'space-between' }}><span>{t('Quiz XP')}</span><b className="num">{state.quiz.xp}</b></div></section>
      </>
    )
  }

  if (phase === 'play') {
    const q = qs[i], p = picks[i], leftS = Math.max(0, Math.round((end - now) / 1000))
    return (
      <section className="card quiz">
        <div className="row" style={{ justifyContent: 'space-between' }}>
          <span className="chip">{t(q.cat)}</span>
          <span className="small num muted">{t('Q')} {i + 1} / {qs.length}{mode === 'exam' ? ` · ${Math.floor(leftS / 60)}:${String(leftS % 60).padStart(2, '0')}` : ''}</span>
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
        {mode === 'learn' && shown && <div className={'explain ' + (p === q.ans ? 'ok' : 'bad')}><b>{p === q.ans ? t('Correct.') : t('Not quite.')}</b> {q.e}</div>}
        <div className="row" style={{ justifyContent: 'space-between', marginTop: 12 }}>
          {mode === 'exam' ? <button className="btn ghost" onClick={() => { const pk = [...picks]; pk[i] = null; setPicks(pk); next() }}>{t('Skip')}</button> : <span />}
          <button className="btn" onClick={() => next()} disabled={mode === 'learn' && !shown}>{i + 1 >= qs.length ? t('Finish') : t('Next')}</button>
        </div>
      </section>
    )
  }

  const r = result.current
  return (
    <>
      <section className="card result">
        <div className="lab2">{t('Result')} · {mode === 'exam' ? t('Exam mode') : t('Learn mode')}</div>
        <div className="sc num" style={{ fontSize: 48 }}>{r.score}<span className="muted" style={{ fontSize: 20 }}> / {qs.length}</span></div>
        <p className="small muted" style={{ margin: 0 }}>{t('{correct} right · {wrong} wrong · {skipped} skipped · {acc}% accuracy on attempted · +{gained} XP', r)}</p>
        <div className="row" style={{ marginTop: 12 }}>
          <button className="btn" onClick={begin}>{t('Play again')}</button>
          <button className="btn ghost" onClick={() => setPhase('setup')}>{t('Change setup')}</button>
          {r.wrong > 0 && <button className="btn ghost" disabled={saved} onClick={saveWrong}>{saved ? t('Saved') : t('Save wrong to error log')}</button>}
        </div>
      </section>
      <section className="card">
        <h3>{t('Review')}</h3>
        {reviewPg.items.map((q) => {
          const x = qs.indexOf(q)
          const pk = r.picks[x], ok = pk === q.ans
          return (
            <div className="res" key={x}>
              <div><span className={'pill ' + (pk === null ? 'prio-Low' : ok ? 'ok' : 'bad')}>{pk === null ? t('Skipped') : ok ? t('Right') : t('Wrong')}</span> <b>{q.q}</b></div>
              <span className="small">{t('Answer:')} <b>{q.opts[q.ans]}</b>{pk !== null && !ok && <span className="muted"> · {t('you chose {x}', { x: q.opts[pk] })}</span>}</span>
              <span className="small muted">{q.e}</span>
            </div>
          )
        })}
        <Pager pg={reviewPg} label="Review page" />
      </section>
    </>
  )
}
