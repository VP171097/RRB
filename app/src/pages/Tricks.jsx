import { useMemo, useState } from 'react'
import { useApp } from '../store.jsx'
import { useExam } from '../exam.jsx'
import { Bar } from '../ui.jsx'
import { Pager, usePaged } from '../pager.jsx'
import { intent } from '../nav.js'
import { sfx } from '../fx.jsx'
import { useT } from '../i18n.jsx'

const CLS = { Maths: 'maths', Reasoning: 'reas', Typing: 'typ' }

function Card({ t: tk, go }) {
  const t = useT()
  const { state, update } = useApp()
  const [show, setShow] = useState(false)
  const on = !!state.tricks[tk.id]
  return (
    <details className={'trick s-' + CLS[tk.sub]}>
      <summary>
        <span className="grow"><b>{t(tk.title)}</b><br /><span className="tiny muted">{t(tk.topic)}</span></span>
        {on && <span className="pill ok">{t('Learned')}</span>}
      </summary>
      <div className="in">
        <p style={{ margin: '0 0 10px' }}>{tk.how}</p>
        <div className="tryit">
          <span className="lab2">{t('Try it')}</span>
          <p style={{ margin: '4px 0 8px' }}>{tk.q}</p>
          {show ? <p className="sol"><b>{t('Worked:')} </b>{tk.a}</p> : <button className="btn ghost sm" onClick={() => { setShow(true); sfx('tick') }}>{t('Show solution')}</button>}
        </div>
        <div className="row" style={{ marginTop: 10 }}>
          <button className="btn sm" aria-pressed={on} onClick={() => { update((s) => { s.tricks[tk.id] = !s.tricks[tk.id] }); if (!on) sfx('ok') }}>{on ? t('Learned') : t('Mark as learned')}</button>
          {tk.drill && <button className="btn ghost sm" onClick={() => { intent.speedMode = tk.drill; go('speed') }}>{t('Drill in Speed Maths')}</button>}
        </div>
      </div>
    </details>
  )
}

export default function Tricks({ go }) {
  const t = useT()
  const { state } = useApp()
  const { TRICKS } = useExam()
  const SUBJECTS = useMemo(() => Array.from(new Set(TRICKS.map((x) => x.sub))), [TRICKS])
  const [sub, setSub] = useState('Maths')
  const [topic, setTopic] = useState('All')
  const [q, setQ] = useState(() => { const x = intent.trickQuery || ''; intent.trickQuery = null; return x })
  const [only, setOnly] = useState('all')
  const topics = useMemo(() => Array.from(new Set(TRICKS.filter((x) => x.sub === sub).map((x) => x.topic))), [TRICKS, sub])
  const list = useMemo(() => {
    const n = q.trim().toLowerCase()
    return TRICKS.filter((x) => x.sub === sub && (topic === 'All' || x.topic === topic) &&
      (only === 'all' || (only === 'todo' ? !state.tricks[x.id] : !!state.tricks[x.id])) && (!n || (x.title + x.how + x.topic + x.q).toLowerCase().includes(n)))
  }, [TRICKS, sub, topic, q, only, state.tricks])
  const pg = usePaged(list, 8)
  const subAll = TRICKS.filter((x) => x.sub === sub)
  const got = subAll.filter((x) => state.tricks[x.id]).length
  const pool = TRICKS.filter((x) => !state.tricks[x.id])
  const tod = (pool.length ? pool : TRICKS)[Math.floor(Date.now() / 864e5) % (pool.length || TRICKS.length)]
  const reset = () => pg.setPage(1)

  return (
    <>
      <h2>{t('Tricks and shortcuts')}</h2>
      <section className={'card tod s-' + CLS[tod.sub]}>
        <span className="lab2">{t('Trick of the day')} · {t(tod.sub)}</span>
        <h3 style={{ margin: '4px 0' }}>{t(tod.title)}</h3>
        <p style={{ margin: 0 }} className="small">{tod.how}</p>
        <div className="row" style={{ marginTop: 10 }}><button className="btn sm" onClick={() => { setSub(tod.sub); setTopic(tod.topic); setQ(''); setOnly('all'); reset() }}>{t('Open it')}</button></div>
      </section>
      <div className="seg" role="group" aria-label={t('Subject')}>
        {SUBJECTS.map((s) => {
          const a = TRICKS.filter((x) => x.sub === s)
          return <button key={s} className={'btn ghost sbtn s-' + CLS[s]} aria-pressed={sub === s} onClick={() => { setSub(s); setTopic('All'); reset() }}>{t(s)} {a.filter((x) => state.tricks[x.id]).length}/{a.length}</button>
        })}
      </div>
      <Bar a={got} b={subAll.length} accent />
      <div className="fgrid">
        <label className="f">{t('Topic')}<select value={topic} onChange={(e) => { setTopic(e.target.value); reset() }}><option value="All">{t('All')}</option>{topics.map((x) => <option key={x} value={x}>{t(x)}</option>)}</select></label>
        <label className="f">{t('Show')}<select value={only} onChange={(e) => { setOnly(e.target.value); reset() }}><option value="all">{t('All tricks')}</option><option value="todo">{t('Not learned yet')}</option><option value="done">{t('Learned')}</option></select></label>
        <label className="f" style={{ gridColumn: '1/-1' }}>{t('Search')}<input type="text" value={q} onChange={(e) => { setQ(e.target.value); reset() }} placeholder={t('e.g. remainder, clock, successive')} /></label>
      </div>
      {pg.items.map((x) => <Card key={x.id} t={x} go={go} />)}
      {!list.length && <div className="empty">{t('No tricks match.')}</div>}
      <Pager pg={pg} label={t('Tricks page')} />
    </>
  )
}
