import { useState } from 'react'
import { useApp } from '../store.jsx'
import { useExam } from '../exam.jsx'
import { Bar, TaskList } from '../ui.jsx'
import { Pager, usePaged } from '../pager.jsx'
import { fmt } from '../lib.js'
import { useT } from '../i18n.jsx'
import { planT } from '../planText.js'

// One week per page. Weeks open on the current week.
export default function Days() {
  const t = useT()
  const { DAYS, TOTAL } = useExam()
  const { today, dateOf, dayDone, dayFull } = useApp()
  const [filter, setFilter] = useState('all')
  const curW = Math.floor((Math.max(1, Math.min(today, TOTAL)) - 1) / 7) + 1
  const weeks = Array.from({ length: Math.ceil(TOTAL / 7) }, (_, i) => i + 1)
  const pg = usePaged(weeks, 1, curW)
  const w = pg.items[0]
  const ds = DAYS.slice((w - 1) * 7, w * 7)
  const a = ds.reduce((s, d) => s + dayDone(d.n), 0)
  const b = ds.reduce((s, d) => s + d.tasks.length, 0)
  const shown = ds.filter((d) => filter === 'all' || !dayFull(d.n))

  return (
    <>
      <div className="row" style={{ justifyContent: 'space-between' }}>
        <h2>{t('Week {n}', { n: w })} <span className="chip p1">{t(ds[0].ph.name)}</span></h2>
        <div className="seg">
          <button className="btn ghost sm" aria-pressed={filter === 'all'} onClick={() => setFilter('all')}>{t('All days')}</button>
          <button className="btn ghost sm" aria-pressed={filter === 'pending'} onClick={() => setFilter('pending')}>{t('Unfinished')}</button>
        </div>
      </div>
      <div className="row small" style={{ justifyContent: 'space-between' }}><span className="muted">{t('{a} to {b}', { a: fmt(dateOf(ds[0].n)), b: fmt(dateOf(ds.at(-1).n)) })}</span><span className="num muted">{t('{a}/{b} tasks', { a, b })}</span></div>
      <Bar a={a} b={b} accent />
      {shown.map((d) => {
        const dn = dayDone(d.n), full = dn === d.tasks.length
        return (
          <details key={d.n} open={d.n === today}>
            <summary>
              <span className="grow"><b>{t('Day {n}', { n: d.n })}</b> <span className="muted small">{fmt(dateOf(d.n))}</span>{d.n === today && <> <span className="chip now">{t('Today')}</span></>}<br /><span className="small muted">{planT(t, d.sum)}</span></span>
              <span className="small num" style={full ? { color: 'var(--ok)', fontWeight: 600 } : { color: 'var(--muted)' }}>{dn}/{d.tasks.length}</span>
            </summary>
            <div className="in"><TaskList n={d.n} /></div>
          </details>
        )
      })}
      {!shown.length && <div className="empty">{t('Every day this week is finished.')}</div>}
      <Pager pg={pg} label={t('Week')} unit={t('W')} info={false} />
    </>
  )
}
