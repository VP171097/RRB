import { useApp } from '../store.jsx'
import { RANKS, BADGES } from '../gamify.js'
import { Ring } from '../widgets.jsx'
import { fmt, parse } from '../lib.js'

export default function Rewards() {
  const { state, xp, rank } = useApp()
  const got = BADGES.filter((b) => state.badges[b.id]).length
  return (
    <>
      <h2>Rewards</h2>
      <section className="board">
        <div className="row" style={{ gap: 16, flexWrap: 'nowrap' }}>
          <Ring value={rank.pct} size={96} stroke={10} color="#f2b52e" label={`${rank.pct}% to next rank`}><b className="num" style={{ fontSize: 22 }}>{rank.idx + 1}</b><span className="tiny">rank</span></Ring>
          <div>
            <div className="lab">Current rank</div>
            <div className="big2">{rank.name}</div>
            <div className="small" style={{ opacity: 0.9 }}>{xp.total} XP{rank.next ? ` · ${rank.nextAt - xp.total} XP to ${rank.next}` : ' · top rank reached'}</div>
          </div>
        </div>
      </section>

      <section className="card">
        <h3>Rank ladder</h3>
        <div className="ladder">
          {RANKS.map(([at, name], i) => (
            <div key={name} className={'rung' + (i < rank.idx ? ' past' : i === rank.idx ? ' here' : '')}>
              <i /><span><b>{name}</b></span><span className="tiny muted num">{at} XP</span>
            </div>
          ))}
        </div>
      </section>

      <section className="card">
        <h3>Where your XP comes from</h3>
        <div style={{ display: 'grid', gap: 6, marginTop: 8 }}>
          {xp.parts.map(([n, v]) => <div className="row small" key={n} style={{ justifyContent: 'space-between' }}><span>{n}</span><b className="num">{v}</b></div>)}
        </div>
        <p className="small muted" style={{ margin: '10px 0 0' }}>10 XP per daily task, 8 per topic stage, 40 per mock, 30 per previous-year paper, 1 per 2 focus minutes, plus quiz, sprint and flashcard rewards.</p>
      </section>

      <section className="card">
        <div className="row" style={{ justifyContent: 'space-between' }}><h3>Badges</h3><span className="small muted num">{got} / {BADGES.length}</span></div>
        <div className="badges">
          {BADGES.map((b) => {
            const on = state.badges[b.id]
            return (
              <div key={b.id} className={'badge s-' + b.color + (on ? ' on' : '')}>
                <div className="medal" aria-hidden="true"><svg viewBox="0 0 24 24" width="22" height="22"><path d="M12 2l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 16.8 6.1 20l1.2-6.5L2.5 8.9 9.1 8z" fill="currentColor" /></svg></div>
                <b>{b.name}</b>
                <span className="tiny muted">{b.desc}</span>
                {on && <span className="tiny" style={{ color: 'var(--sc)' }}>{fmt(parse(on))}</span>}
              </div>
            )
          })}
        </div>
      </section>
    </>
  )
}
