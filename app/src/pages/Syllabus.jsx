import { useState } from 'react'
import { useApp } from '../store.jsx'
import { useExam } from '../exam.jsx'
import { PRIORITY_ORDER } from '../../../RRB_Graduate/syllabus.js'
import { searchLink, videoLink } from '../../../RRB_Graduate/resources.js'
import { Bar, Check, Ext } from '../ui.jsx'
import { Pager, usePaged } from '../pager.jsx'
import { useT } from '../i18n.jsx'

export default function Syllabus() {
  const t = useT()
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
      <h2>{t('Syllabus')}</h2>
      <div className="seg">
        {X.SYLLABUS.map((s, i) => <button key={s.code} className={'btn ghost sbtn s-' + X.colorOf[s.label]} aria-pressed={subject === i} onClick={() => { setSubject(i); pg.setPage(1) }}>{t(s.label)}</button>)}
      </div>
      <section className="card">
        <div className="row" style={{ justifyContent: 'space-between' }}><h3>{t(sec.subject)}</h3><span className="small muted">{t('{qs} Q · {min} min · target {target}', { qs: sec.qs, min: sec.minutes, target: sec.target })}</span></div>
        <p className="small" style={{ margin: '6px 0 10px' }}>{t(sec.note)}</p>
        <div className="row small" style={{ justifyContent: 'space-between' }}><span>{t('Sub-topics covered')}</span><span className="num">{got}/{total}</span></div>
        <Bar a={got} b={total} />
      </section>
      <div className="fgrid">
        <label className="f">{t('Search')}<input type="text" value={q} onChange={(e) => { setQ(e.target.value); pg.setPage(1) }} placeholder={t('e.g. interest, syllogism')} /></label>
        <label className="f">{t('Priority')}<select value={prio} onChange={(e) => { setPrio(e.target.value); pg.setPage(1) }}><option value="All">{t('All')}</option><option value="High">{t('High')}</option><option value="Medium">{t('Medium')}</option><option value="Low">{t('Low')}</option></select></label>
      </div>
      {pg.items.map((g) => (
        <details key={g.name}>
          <summary>
            <span className="grow"><b>{t(g.name)}</b><br /><span className={'pill prio-' + g.priority}>{t(g.priority)}</span> <span className="small muted">{t('~{n} Q', { n: g.weight })}</span></span>
            <span className="small num muted">{done(g)}/{g.subs.length}</span>
          </summary>
          <div className="in">
            {g.subs.map((s, i) => (
              <Check key={i} checked={!!state.syl[key(g.name, i)]} onChange={(e) => update((st) => { if (e.target.checked) st.syl[key(g.name, i)] = 1; else delete st.syl[key(g.name, i)] })}>{t(s)}</Check>
            ))}
            <div className="row small" style={{ marginTop: 8 }}>
              <Ext href={searchLink(`${X.RES.q} ${g.name} previous year questions pdf`)}>{t('Practice questions')}</Ext>
              <Ext href={videoLink(`${g.name} ${X.RES.q}`)}>{t('Video lessons')}</Ext>
            </div>
          </div>
        </details>
      ))}
      {!groups.length && <div className="empty">{t('No topics match.')}</div>}
      <Pager pg={pg} label={t('Syllabus page')} />
    </>
  )
}
