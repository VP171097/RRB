import { useEffect, useState } from 'react'
import { useApp } from '../store.jsx'
import { useExam } from '../exam.jsx'
import { Bar } from '../ui.jsx'
import { Pager, usePaged } from '../pager.jsx'
import { intent } from '../nav.js'
import { useT } from '../i18n.jsx'

export default function Topics() {
  const t = useT()
  const { state, update } = useApp()
  const X = useExam()
  const [sub, setSub] = useState(X.SUBS.includes(intent.topicSub) ? intent.topicSub : X.SUBS[0])
  useEffect(() => { intent.topicSub = null }, [])
  const list = X.TOPICS.filter((x) => x.sub === sub)
  const pg = usePaged(list, 8)
  const stages = list.reduce((a, x) => a + X.COLS.filter((_, i) => state.topics[x.k]?.[i]).length, 0)
  const cls = 's-' + X.colorOf[sub]
  return (
    <>
      <h2>{t('Topic tracker')}</h2>
      <div className="seg" role="group" aria-label={t('Subject')}>
        {X.SUBS.map((s) => {
          const tp = X.TOPICS.filter((x) => x.sub === s)
          const l = tp.filter((x) => state.topics[x.k]?.[0]).length
          return <button key={s} className={'btn ghost sbtn s-' + X.colorOf[s]} aria-pressed={sub === s} onClick={() => { setSub(s); pg.setPage(1) }}>{t(s)} {l}/{tp.length}</button>
        })}
      </div>
      <div className="row small muted" style={{ justifyContent: 'space-between' }}><span>{t('Rev 1 next day, Rev 2 after a week, Rev 3 after a month.')}</span><span className="num">{stages}/{list.length * 5}</span></div>
      <Bar a={stages} b={list.length * 5} accent />
      <section className={'card ' + cls}>
        {pg.items.map((tp) => (
          <div className={'tp s-' + X.colorOf[tp.sub]} key={tp.k}>
            <div className="row" style={{ justifyContent: 'space-between', flexWrap: 'nowrap' }}><span className="nm">{t(tp.name)}</span><span className="chip">{t('Day {n}', { n: tp.day })}</span></div>
            <div className="cols">
              {X.COLS.map((c, i) => (
                <button key={c} aria-pressed={!!state.topics[tp.k]?.[i]} onClick={() => update((s) => { const o = (s.topics[tp.k] ||= {}); o[i] = !o[i] })}>{t(c)}</button>
              ))}
            </div>
          </div>
        ))}
      </section>
      <Pager pg={pg} label={t('Topics page')} />
    </>
  )
}
