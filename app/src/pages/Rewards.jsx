import { useApp } from '../store.jsx'
import { RANKS, BADGES } from '../gamify.js'
import { Ring } from '../widgets.jsx'
import { fmt, parse } from '../lib.js'
import { Pager, usePaged } from '../pager.jsx'
import { useT } from '../i18n.jsx'

export default function Rewards() {
  const t = useT()
  const { state, xp, rank } = useApp()
  const pg = usePaged(BADGES, 12)
  const got = BADGES.filter((b) => state.badges[b.id]).length
  return (
    <>
      <h2>{t('Rewards')}</h2>
      <section className="board">
        <div className="row" style={{ gap: 16, flexWrap: 'nowrap' }}>
          <Ring value={rank.pct} size={96} stroke={10} color="#f2b52e" label={t('{pct}% to next rank', { pct: rank.pct })}><b className="num" style={{ fontSize: 22 }}>{rank.idx + 1}</b><span className="tiny">{t('rank')}</span></Ring>
          <div>
            <div className="lab">{t('Current rank')}</div>
            <div className="big2">{t(rank.name)}</div>
            <div className="small" style={{ opacity: 0.9 }}>{xp.total} XP{rank.next ? ' · ' + t('{n} XP to {rank}', { n: rank.nextAt - xp.total, rank: t(rank.next) }) : ' · ' + t('top rank reached')}</div>
          </div>
        </div>
      </section>

      <details>
        <summary><h3>{t('Rank ladder')}</h3></summary>
        <div className="in ladder">
          {RANKS.map(([at, name], i) => (
            <div key={name} className={'rung' + (i < rank.idx ? ' past' : i === rank.idx ? ' here' : '')}>
              <i /><span><b>{t(name)}</b></span><span className="tiny muted num">{at} XP</span>
            </div>
          ))}
        </div>
      </details>

      <details>
        <summary><h3>{t('Where your XP comes from')}</h3></summary>
        <div className="in" style={{ display: 'grid', gap: 6 }}>
          {xp.parts.map(([n, v]) => <div className="row small" key={n} style={{ justifyContent: 'space-between' }}><span>{t(n)}</span><b className="num">{v}</b></div>)}
          <p className="small muted" style={{ margin: '6px 0 0' }}>{t('10 XP per daily task, 8 per topic stage, 40 per mock, 30 per previous-year paper, 1 per 2 focus minutes, plus quiz, sprint and flashcard rewards.')}</p>
        </div>
      </details>

      <section className="card">
        <div className="row" style={{ justifyContent: 'space-between' }}><h3>{t('Badges')}</h3><span className="small muted num">{got} / {BADGES.length}</span></div>
        <div className="badges">
          {pg.items.map((b) => {
            const on = state.badges[b.id]
            return (
              <div key={b.id} className={'badge s-' + b.color + (on ? ' on' : '')}>
                <div className="medal" aria-hidden="true"><svg viewBox="0 0 24 24" width="22" height="22"><path d="M12 2l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 16.8 6.1 20l1.2-6.5L2.5 8.9 9.1 8z" fill="currentColor" /></svg></div>
                <b>{t(b.name)}</b>
                <span className="tiny muted">{t(b.desc)}</span>
                {on && <span className="tiny" style={{ color: 'var(--sc)' }}>{fmt(parse(on))}</span>}
              </div>
            )
          })}
        </div>
        <Pager pg={pg} label={t('Badge page')} info={false} />
      </section>
    </>
  )
}
