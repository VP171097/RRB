import { useMemo, useState } from 'react'
import { useApp } from '../store.jsx'
import { useExam } from '../exam.jsx'
import { Bar } from '../ui.jsx'
import { Pager, usePaged } from '../pager.jsx'
import { intent } from '../nav.js'
import { sfx } from '../fx.jsx'

const CLS = { Maths: 'maths', Reasoning: 'reas', Typing: 'typ' }

function Card({ t, go }) {
  const { state, update } = useApp()
  const [show, setShow] = useState(false)
  const on = !!state.tricks[t.id]
  return (
    <details className={'trick s-' + CLS[t.sub]}>
      <summary>
        <span className="grow"><b>{t.title}</b><br /><span className="tiny muted">{t.topic}</span></span>
        {on && <span className="pill ok">Learned</span>}
      </summary>
      <div className="in">
        <p style={{ margin: '0 0 10px' }}>{t.how}</p>
        <div className="tryit">
          <span className="lab2">Try it</span>
          <p style={{ margin: '4px 0 8px' }}>{t.q}</p>
          {show ? <p className="sol"><b>Worked: </b>{t.a}</p> : <button className="btn ghost sm" onClick={() => { setShow(true); sfx('tick') }}>Show solution</button>}
        </div>
        <div className="row" style={{ marginTop: 10 }}>
          <button className="btn sm" aria-pressed={on} onClick={() => { update((s) => { s.tricks[t.id] = !s.tricks[t.id] }); if (!on) sfx('ok') }}>{on ? 'Learned' : 'Mark as learned'}</button>
          {t.drill && <button className="btn ghost sm" onClick={() => { intent.speedMode = t.drill; go('speed') }}>Drill in Speed Maths</button>}
        </div>
      </div>
    </details>
  )
}

export default function Tricks({ go }) {
  const { state } = useApp()
  const { TRICKS } = useExam()
  const SUBJECTS = useMemo(() => Array.from(new Set(TRICKS.map((t) => t.sub))), [TRICKS])
  const [sub, setSub] = useState('Maths')
  const [topic, setTopic] = useState('All')
  const [q, setQ] = useState('')
  const [only, setOnly] = useState('all')
  const topics = useMemo(() => Array.from(new Set(TRICKS.filter((t) => t.sub === sub).map((t) => t.topic))), [TRICKS, sub])
  const list = useMemo(() => {
    const n = q.trim().toLowerCase()
    return TRICKS.filter((t) => t.sub === sub && (topic === 'All' || t.topic === topic) &&
      (only === 'all' || (only === 'todo' ? !state.tricks[t.id] : !!state.tricks[t.id])) && (!n || (t.title + t.how + t.topic + t.q).toLowerCase().includes(n)))
  }, [TRICKS, sub, topic, q, only, state.tricks])
  const pg = usePaged(list, 8)
  const subAll = TRICKS.filter((t) => t.sub === sub)
  const got = subAll.filter((t) => state.tricks[t.id]).length
  const pool = TRICKS.filter((t) => !state.tricks[t.id])
  const tod = (pool.length ? pool : TRICKS)[Math.floor(Date.now() / 864e5) % (pool.length || TRICKS.length)]
  const reset = () => pg.setPage(1)

  return (
    <>
      <h2>Tricks and shortcuts</h2>
      <section className={'card tod s-' + CLS[tod.sub]}>
        <span className="lab2">Trick of the day · {tod.sub}</span>
        <h3 style={{ margin: '4px 0' }}>{tod.title}</h3>
        <p style={{ margin: 0 }} className="small">{tod.how}</p>
        <div className="row" style={{ marginTop: 10 }}><button className="btn sm" onClick={() => { setSub(tod.sub); setTopic(tod.topic); setQ(''); setOnly('all'); reset() }}>Open it</button></div>
      </section>
      <div className="seg" role="group" aria-label="Subject">
        {SUBJECTS.map((s) => {
          const a = TRICKS.filter((t) => t.sub === s)
          return <button key={s} className={'btn ghost sbtn s-' + CLS[s]} aria-pressed={sub === s} onClick={() => { setSub(s); setTopic('All'); reset() }}>{s} {a.filter((t) => state.tricks[t.id]).length}/{a.length}</button>
        })}
      </div>
      <Bar a={got} b={subAll.length} accent />
      <div className="fgrid">
        <label className="f">Topic<select value={topic} onChange={(e) => { setTopic(e.target.value); reset() }}><option>All</option>{topics.map((t) => <option key={t}>{t}</option>)}</select></label>
        <label className="f">Show<select value={only} onChange={(e) => { setOnly(e.target.value); reset() }}><option value="all">All tricks</option><option value="todo">Not learned yet</option><option value="done">Learned</option></select></label>
        <label className="f" style={{ gridColumn: '1/-1' }}>Search<input type="text" value={q} onChange={(e) => { setQ(e.target.value); reset() }} placeholder="e.g. remainder, clock, successive" /></label>
      </div>
      {pg.items.map((t) => <Card key={t.id} t={t} go={go} />)}
      {!list.length && <div className="empty">No tricks match.</div>}
      <Pager pg={pg} label="Tricks page" />
    </>
  )
}
