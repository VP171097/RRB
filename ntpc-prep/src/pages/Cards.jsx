import { useMemo, useState } from 'react'
import { useApp } from '../store.jsx'
import { NOTES } from '../data/notes.js'
import { Bar } from '../ui.jsx'
import { confetti, sfx } from '../fx.jsx'
import { todayIso, iso, addDays, parse } from '../lib.js'

const GAPS = [0, 1, 3, 7, 14, 30]
const shuffle = (a) => { const b = [...a]; for (let i = b.length - 1; i > 0; i--) { const j = (Math.random() * (i + 1)) | 0; [b[i], b[j]] = [b[j], b[i]] } return b }

// Decks are built from every two-column table in the Notes tab.
const DECKS = []
NOTES.forEach((n) => n.b.forEach((b, bi) => {
  if (b[0] === 'table' && b[1][0].length === 2 && b[1].length > 4) {
    const h = b[1][0]
    DECKS.push({ id: `${n.id}-${bi}`, name: `${h[0]} → ${h[1]}`, from: n.title, h, rows: b[1].slice(1) })
  }
}))

export default function Cards() {
  const { state, update } = useApp()
  const today = todayIso()
  const [deck, setDeck] = useState(null)
  const [reverse, setReverse] = useState(false)
  const [queue, setQueue] = useState([])
  const [flip, setFlip] = useState(false)
  const [done, setDone] = useState(0)
  const [phase, setPhase] = useState('list')

  const keys = (d) => d.rows.map((_, i) => `${d.id}|${i}`)
  const due = (d) => keys(d).filter((k) => { const c = state.cards[k]; return !c || c.due <= today })
  const known = (d) => keys(d).filter((k) => (state.cards[k]?.box || 0) >= 3).length
  const allDue = useMemo(() => DECKS.reduce((a, d) => a + due(d).length, 0), [state.cards]) // eslint-disable-line react-hooks/exhaustive-deps

  const begin = (d) => {
    const ks = d ? due(d) : DECKS.flatMap(due)
    const q = shuffle(ks).slice(0, 20)
    if (!q.length) return
    setDeck(d); setQueue(q); setFlip(false); setDone(0); setPhase('play'); sfx('ok')
  }
  const row = (k) => { const [id, i] = k.split('|'); const d = DECKS.find((x) => x.id === id); return { d, r: d.rows[+i] } }
  const rate = (good) => {
    const k = queue[0], c = state.cards[k] || { box: 0 }
    const box = good ? Math.min(5, c.box + 1) : 0
    update((s) => { s.cards[k] = { box, due: good ? iso(addDays(parse(today), GAPS[box])) : today } })
    sfx(good ? 'ok' : 'bad')
    const rest = queue.slice(1)
    const nq = good ? rest : [...rest, k]
    setFlip(false)
    if (good) setDone((x) => x + 1)
    if (!nq.length) { setPhase('end'); confetti(100); sfx('done') } else setQueue(nq)
  }

  if (phase === 'play') {
    const { d, r } = row(queue[0])
    const front = reverse ? r[1] : r[0], back = reverse ? r[0] : r[1]
    return (
      <section className="card">
        <div className="row" style={{ justifyContent: 'space-between' }}><span className="chip">{d.from}</span><span className="small num muted">{done} known · {queue.length} left</span></div>
        <Bar a={done} b={done + queue.length} accent />
        <button className={'flip' + (flip ? ' on' : '')} onClick={() => { setFlip(!flip); sfx('tick') }} aria-label="Flip card">
          <span className="face front"><small>{reverse ? d.h[1] : d.h[0]}</small><b>{front}</b><i>Tap to reveal</i></span>
          <span className="face back"><small>{reverse ? d.h[0] : d.h[1]}</small><b>{back}</b></span>
        </button>
        <div className="row" style={{ justifyContent: 'center', marginTop: 14 }}>
          <button className="btn ghost" disabled={!flip} onClick={() => rate(false)}>Again</button>
          <button className="btn" disabled={!flip} onClick={() => rate(true)}>Got it</button>
        </div>
        <div className="row" style={{ justifyContent: 'center', marginTop: 10 }}><button className="linkbtn" onClick={() => setPhase('list')}>Stop session</button></div>
      </section>
    )
  }
  if (phase === 'end') {
    return (
      <section className="card result">
        <div className="lab2">Session complete</div>
        <div className="sc num" style={{ fontSize: 48 }}>{done} cards</div>
        <p className="small muted" style={{ margin: 0 }}>Cards you miss come back sooner. Ones you know return after 1, 3, 7, 14 and 30 days. Cards at the third level count towards XP.</p>
        <div className="row" style={{ marginTop: 12 }}><button className="btn" onClick={() => setPhase('list')}>Back to decks</button></div>
      </section>
    )
  }
  return (
    <>
      <section className="card">
        <h3>Flashcards</h3>
        <p className="small muted" style={{ margin: '4px 0 12px' }}>Built from the tables in your Notes: zones, vitamins, units, abbreviations, days, headquarters and more. Missed cards return sooner; known cards come back after longer gaps.</p>
        <div className="row"><button className="btn" disabled={!allDue} onClick={() => begin(null)}>Study all due ({allDue})</button>
          <label className="sub" style={{ padding: 0 }}><input type="checkbox" checked={reverse} onChange={(e) => setReverse(e.target.checked)} /><span className="box" /><span className="tx">Reverse (answer to question)</span></label></div>
      </section>
      <div className="grid2">
        {DECKS.map((d) => (
          <button key={d.id} className="card deck" onClick={() => begin(d)} disabled={!due(d).length}>
            <b>{d.name}</b>
            <span className="tiny muted">{d.from}</span>
            <Bar a={known(d)} b={d.rows.length} />
            <span className="tiny muted">{known(d)}/{d.rows.length} known · {due(d).length} due</span>
          </button>
        ))}
      </div>
    </>
  )
}
