import { useMemo, useState } from 'react'
import { useApp } from '../store.jsx'
import { TRICKS, TRICK_TOPICS } from '../data/tricks.js'
import { Bar } from '../ui.jsx'
import { intent } from '../nav.js'
import { sfx } from '../fx.jsx'

const CLS = { Maths: 'maths', Reasoning: 'reas' }

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
          {t.drill && <button className="btn ghost sm" onClick={() => { intent.practiceTab = 'speed'; intent.speedMode = t.drill; go('practice') }}>Drill this in Speed Maths</button>}
        </div>
      </div>
    </details>
  )
}

export default function Tricks({ go }) {
  const { state } = useApp()
  const [sub, setSub] = useState('Maths')
  const [topic, setTopic] = useState('All')
  const [q, setQ] = useState('')
  const [only, setOnly] = useState('all')
  const topics = TRICK_TOPICS(sub)
  const list = useMemo(() => {
    const n = q.trim().toLowerCase()
    return TRICKS.filter((t) => t.sub === sub && (topic === 'All' || t.topic === topic) &&
      (only === 'all' || (only === 'todo' ? !state.tricks[t.id] : !!state.tricks[t.id])) &&
      (!n || (t.title + t.how + t.topic + t.q).toLowerCase().includes(n)))
  }, [sub, topic, q, only, state.tricks])
  const subAll = TRICKS.filter((t) => t.sub === sub)
  const got = subAll.filter((t) => state.tricks[t.id]).length
  const day = Math.floor(Date.now() / 864e5)
  const pool = TRICKS.filter((t) => !state.tricks[t.id])
  const tod = (pool.length ? pool : TRICKS)[day % (pool.length || TRICKS.length)]
  const byTopic = topics.map((tp) => [tp, list.filter((t) => t.topic === tp)]).filter(([, l]) => l.length)

  return (
    <>
      <h2>Tricks and shortcuts</h2>
      <p className="small muted" style={{ margin: 0 }}>Grouped by syllabus topic. Read the trick, try the example yourself, then reveal the worked solution. Each trick you learn earns XP.</p>
      <section className={'card tod s-' + CLS[tod.sub]}>
        <span className="lab2">Trick of the day · {tod.sub}</span>
        <h3 style={{ margin: '4px 0' }}>{tod.title}</h3>
        <p style={{ margin: 0 }}>{tod.how}</p>
        <div className="row" style={{ marginTop: 10 }}><button className="btn sm" onClick={() => { setSub(tod.sub); setTopic(tod.topic); setQ('') }}>Open it</button></div>
      </section>
      <div className="seg" role="group" aria-label="Subject">
        {['Maths', 'Reasoning'].map((s) => {
          const a = TRICKS.filter((t) => t.sub === s)
          return <button key={s} className={'btn ghost sbtn s-' + CLS[s]} aria-pressed={sub === s} onClick={() => { setSub(s); setTopic('All') }}>{s} {a.filter((t) => state.tricks[t.id]).length}/{a.length}</button>
        })}
      </div>
      <Bar a={got} b={subAll.length} accent />
      <div className="fgrid">
        <label className="f">Topic<select value={topic} onChange={(e) => setTopic(e.target.value)}><option>All</option>{topics.map((t) => <option key={t}>{t}</option>)}</select></label>
        <label className="f">Show<select value={only} onChange={(e) => setOnly(e.target.value)}><option value="all">All tricks</option><option value="todo">Not learned yet</option><option value="done">Learned</option></select></label>
        <label className="f" style={{ gridColumn: '1/-1' }}>Search<input type="text" value={q} onChange={(e) => setQ(e.target.value)} placeholder="e.g. remainder, clock, successive" /></label>
      </div>
      {byTopic.map(([tp, l]) => (
        <section key={tp} style={{ display: 'grid', gap: 8 }}>
          <h3 className={'tp-h s-' + CLS[sub]}>{tp}</h3>
          {l.map((t) => <Card key={t.id} t={t} go={go} />)}
        </section>
      ))}
      {!byTopic.length && <div className="empty">No tricks match.</div>}
    </>
  )
}
