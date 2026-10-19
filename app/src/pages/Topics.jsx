import { useEffect, useState } from 'react'
import { useApp } from '../store.jsx'
import { useExam } from '../exam.jsx'
import { Bar } from '../ui.jsx'
import { Pager, usePaged } from '../pager.jsx'
import { intent } from '../nav.js'

export default function Topics() {
  const { state, update } = useApp()
  const X = useExam()
  const [sub, setSub] = useState(X.SUBS.includes(intent.topicSub) ? intent.topicSub : X.SUBS[0])
  useEffect(() => { intent.topicSub = null }, [])
  const list = X.TOPICS.filter((t) => t.sub === sub)
  const pg = usePaged(list, 8)
  const stages = list.reduce((a, t) => a + X.COLS.filter((_, i) => state.topics[t.k]?.[i]).length, 0)
  const cls = 's-' + X.colorOf[sub]
  return (
    <>
      <h2>Topic tracker</h2>
      <div className="seg" role="group" aria-label="Subject">
        {X.SUBS.map((s) => {
          const t = X.TOPICS.filter((x) => x.sub === s)
          const l = t.filter((x) => state.topics[x.k]?.[0]).length
          return <button key={s} className={'btn ghost sbtn s-' + X.colorOf[s]} aria-pressed={sub === s} onClick={() => { setSub(s); pg.setPage(1) }}>{s} {l}/{t.length}</button>
        })}
      </div>
      <div className="row small muted" style={{ justifyContent: 'space-between' }}><span>Rev 1 next day, Rev 2 after a week, Rev 3 after a month.</span><span className="num">{stages}/{list.length * 5}</span></div>
      <Bar a={stages} b={list.length * 5} accent />
      <section className={'card ' + cls}>
        {pg.items.map((t) => (
          <div className={'tp s-' + X.colorOf[t.sub]} key={t.k}>
            <div className="row" style={{ justifyContent: 'space-between', flexWrap: 'nowrap' }}><span className="nm">{t.name}</span><span className="chip">Day {t.day}</span></div>
            <div className="cols">
              {X.COLS.map((c, i) => (
                <button key={c} aria-pressed={!!state.topics[t.k]?.[i]} onClick={() => update((s) => { const o = (s.topics[t.k] ||= {}); o[i] = !o[i] })}>{c}</button>
              ))}
            </div>
          </div>
        ))}
      </section>
      <Pager pg={pg} label="Topics page" />
    </>
  )
}
