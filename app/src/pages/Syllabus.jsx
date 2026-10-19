import { useState } from 'react'
import { useApp } from '../store.jsx'
import { useExam } from '../exam.jsx'
import { PRIORITY_ORDER } from '../../../RRB_Graduate/syllabus.js'
import { searchLink, videoLink } from '../../../RRB_Graduate/resources.js'
import { Bar, Check, Ext } from '../ui.jsx'
import { Pager, usePaged } from '../pager.jsx'

export default function Syllabus() {
  const { state, update } = useApp()
  const X = useExam()
  const [subject, setSubject] = useState(0)
  const [prio, setPrio] = useState('All')
  const [q, setQ] = useState('')
  const sec = X.SYLLABUS[subject]
  const key = (g, i) => `${sec.code}|${g}|${i}`
  const done = (g) => g.subs.filter((_, i) => state.syl[key(g.name, i)]).length
  const total = sec.groups.reduce((a, g) => a + g.subs.length, 0)
  const got = sec.groups.reduce((a, g) => a + done(g), 0)
  const needle = q.trim().toLowerCase()
  const groups = sec.groups
    .filter((g) => (prio === 'All' || g.priority === prio) && (!needle || g.name.toLowerCase().includes(needle) || g.subs.some((s) => s.toLowerCase().includes(needle))))
    .sort((a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority])
  const pg = usePaged(groups, 6)

  return (
    <>
      <h2>Syllabus</h2>
      <div className="seg">
        {X.SYLLABUS.map((s, i) => <button key={s.code} className={'btn ghost sbtn s-' + X.colorOf[s.label]} aria-pressed={subject === i} onClick={() => { setSubject(i); pg.setPage(1) }}>{s.label}</button>)}
      </div>
      <section className="card">
        <div className="row" style={{ justifyContent: 'space-between' }}><h3>{sec.subject}</h3><span className="small muted">{sec.qs} Q · {sec.minutes} min · target {sec.target}</span></div>
        <p className="small" style={{ margin: '6px 0 10px' }}>{sec.note}</p>
        <div className="row small" style={{ justifyContent: 'space-between' }}><span>Sub-topics covered</span><span className="num">{got}/{total}</span></div>
        <Bar a={got} b={total} />
      </section>
      <div className="fgrid">
        <label className="f">Search<input type="text" value={q} onChange={(e) => { setQ(e.target.value); pg.setPage(1) }} placeholder="e.g. interest, syllogism" /></label>
        <label className="f">Priority<select value={prio} onChange={(e) => { setPrio(e.target.value); pg.setPage(1) }}><option>All</option><option>High</option><option>Medium</option><option>Low</option></select></label>
      </div>
      {pg.items.map((g) => (
        <details key={g.name}>
          <summary>
            <span className="grow"><b>{g.name}</b><br /><span className={'pill prio-' + g.priority}>{g.priority}</span> <span className="small muted">~{g.weight} Q</span></span>
            <span className="small num muted">{done(g)}/{g.subs.length}</span>
          </summary>
          <div className="in">
            {g.subs.map((s, i) => (
              <Check key={i} checked={!!state.syl[key(g.name, i)]} onChange={(e) => update((st) => { if (e.target.checked) st.syl[key(g.name, i)] = 1; else delete st.syl[key(g.name, i)] })}>{s}</Check>
            ))}
            <div className="row small" style={{ marginTop: 8 }}>
              <Ext href={searchLink(`${X.RES.q} ${g.name} previous year questions pdf`)}>Practice questions</Ext>
              <Ext href={videoLink(`${g.name} ${X.RES.q}`)}>Video lessons</Ext>
            </div>
          </div>
        </details>
      ))}
      {!groups.length && <div className="empty">No topics match.</div>}
      <Pager pg={pg} label="Syllabus page" />
    </>
  )
}
