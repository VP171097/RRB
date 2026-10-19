import { useState } from 'react'
import { useApp } from '../store.jsx'
import { bossHp } from '../game.js'
import { Bar } from '../ui.jsx'
import { Ring } from '../widgets.jsx'
import { sfx, notify, confetti } from '../fx.jsx'
import { fmt, parse, round1, todayIso } from '../lib.js'

const W = 340, H = 1000
const pt = (i) => [170 + 100 * Math.sin(i * 1.3), 56 + i * 74]

function Star({ x, y, on }) {
  return <path transform={`translate(${x},${y})`} d="M0,-6 L1.8,-1.8 6.4,-1.5 2.9,1.4 4,5.8 0,3.4 -4,5.8 -2.9,1.4 -6.4,-1.5 -1.8,-1.8Z" fill={on ? 'var(--signal)' : 'var(--line)'} />
}

function Map({ game, sel, onSel }) {
  const pts = game.stations.map((_, i) => pt(i))
  const leg = (i) => `M${pts[i][0]},${pts[i][1]} C${pts[i][0]},${pts[i][1] + 37} ${pts[i + 1][0]},${pts[i + 1][1] - 37} ${pts[i + 1][0]},${pts[i + 1][1]}`
  const cur = game.current.k - 1
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" role="group" aria-label="Mission map" style={{ display: 'block', maxWidth: 420, margin: '0 auto' }}>
      {pts.slice(0, -1).map((_, i) => <path key={'b' + i} d={leg(i)} fill="none" stroke="var(--line)" strokeWidth="10" strokeLinecap="round" />)}
      {pts.slice(0, -1).map((_, i) => <path key={'s' + i} d={leg(i)} fill="none" stroke="var(--surface)" strokeWidth="3" strokeDasharray="3 7" />)}
      {pts.slice(0, -1).map((_, i) => game.stations[i].cleared && <path key={'c' + i} d={leg(i)} fill="none" stroke="var(--ok)" strokeWidth="10" strokeLinecap="round" opacity=".9" />)}
      {game.stations.map((s, i) => {
        const [x, y] = pts[i], right = x < 170
        const state = s.cleared ? 'done' : i === cur ? 'now' : s.unlocked ? 'open' : 'lock'
        const fill = state === 'done' ? 'var(--ok)' : state === 'now' ? 'var(--signal)' : 'var(--surface)'
        const stroke = state === 'lock' ? 'var(--line)' : state === 'open' ? 'var(--accent)' : fill
        const r = i === 12 ? 24 : 19
        return (
          <g key={i} className={'node ' + state + (sel === i ? ' sel' : '')} role="button" tabIndex={0} aria-label={`Station ${s.k}, ${s.name}, ${state === 'done' ? 'cleared' : state === 'lock' ? 'locked' : 'open'}`}
            onClick={() => onSel(i)} onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), onSel(i))} style={{ cursor: 'pointer' }}>
            {sel === i && <circle cx={x} cy={y} r={r + 7} fill="none" stroke="var(--ink)" strokeWidth="2" strokeDasharray="4 3" />}
            <circle cx={x} cy={y} r={r} fill={fill} stroke={stroke} strokeWidth="4" />
            {state === 'lock'
              ? <g transform={`translate(${x - 6},${y - 7})`}><rect x="0" y="6" width="12" height="9" rx="2" fill="var(--muted)" /><path d="M2.5,6 V4 a3.5,3.5 0 0 1 7,0 V6" fill="none" stroke="var(--muted)" strokeWidth="2" /></g>
              : <text x={x} y={y + 5} textAnchor="middle" style={{ fill: state === 'open' ? 'var(--ink)' : state === 'now' ? '#1a1200' : '#fff', font: '700 16px var(--f-display)' }}>{s.k}</text>}
            {i === 12 && <path transform={`translate(${x},${y - r - 6})`} d="M0,0 V-16 L14,-11 L0,-6" fill="var(--bad)" stroke="var(--bad)" strokeWidth="2" strokeLinejoin="round" />}
            {!s.cleared && s.unlocked && <rect x={x + r - 4} y={y - r - 2} width="10" height="10" transform={`rotate(45 ${x + r + 1} ${y - r + 3})`} fill="var(--bad)" />}
            <Star x={x - 12} y={y + r + 12} on={s.stars >= 1} /><Star x={x} y={y + r + 12} on={s.stars >= 2} /><Star x={x + 12} y={y + r + 12} on={s.stars >= 3} />
            <text x={right ? x + r + 14 : x - r - 14} y={y - 2} textAnchor={right ? 'start' : 'end'} style={{ fill: state === 'lock' ? 'var(--muted)' : 'var(--ink)', font: '600 14px var(--f-display)', letterSpacing: '.04em' }}>{s.name.toUpperCase()}</text>
            <text x={right ? x + r + 14 : x - r - 14} y={y + 14} textAnchor={right ? 'start' : 'end'}>{state === 'lock' ? 'Locked' : s.cleared ? 'Cleared' : `${s.taskPct}% tasks`}</text>
            {i === cur && !game.won && (
              <g transform={`translate(${x - 17},${y - r - 30})`}><g className="bob">
                <svg width="34" height="20" viewBox="0 0 34 20"><rect x="1" y="5" width="20" height="10" rx="2" fill="var(--accent)" /><rect x="21" y="2" width="8" height="13" rx="2" fill="var(--signal)" /><rect x="4" y="7" width="4" height="4" fill="#fff" /><rect x="10" y="7" width="4" height="4" fill="#fff" /><circle cx="8" cy="17" r="2.5" fill="var(--ink)" /><circle cx="17" cy="17" r="2.5" fill="var(--ink)" /><circle cx="26" cy="17" r="2.5" fill="var(--ink)" /></svg></g>
              </g>
            )}
          </g>
        )
      })}
    </svg>
  )
}

export default function Mission({ go }) {
  const { state, update, game, rank, xp } = useApp()
  const [sel, setSel] = useState(null)
  const idx = sel ?? game.current.k - 1
  const s = game.stations[idx]
  const hp = bossHp(s)
  const claim = (q) => {
    const k = todayIso()
    update((st) => { (st.quests[k] ||= []).push(q.id) })
    sfx('ok'); notify(`Quest complete: ${q.title} (+25 XP)`, 'badge')
    if (game.quests.filter((x) => x.claimed || x.id === q.id).length === game.quests.length) { notify('All quests done. +50 XP bonus', 'badge'); confetti(120) }
  }
  const fuelLabel = game.fuel >= 100 ? 'Full tank' : game.fuel >= 75 ? 'Running well' : game.fuel >= 50 ? 'Getting low' : 'Almost empty'
  const claimed = game.quests.filter((q) => q.claimed).length

  return (
    <>
      <h2>Mission 90</h2>
      {game.won && (
        <section className="card victory">
          <div className="lab2">Victory</div>
          <h2 style={{ fontSize: 34, margin: '4px 0' }}>You beat the 90 Dragon</h2>
          <p style={{ margin: 0 }}>Every station cleared and a score of 90 or more on the board. The real final boss is exam day. Keep your routine, keep taking mocks, and sleep well.</p>
        </section>
      )}
      <section className="board">
        <div className="row" style={{ gap: 16, flexWrap: 'nowrap', justifyContent: 'space-between' }}>
          <div>
            <div className="lab">Your goal</div>
            <div className="big2">Score 90+ and clear all 13 stations</div>
            <div className="small" style={{ opacity: 0.9, marginTop: 4 }}>Best score so far: <b>{game.bestAll === null ? 'none yet' : round1(game.bestAll)}</b> / 100</div>
          </div>
          <Ring value={Math.round((game.cleared / 13) * 100)} size={84} stroke={9} color="#f2b52e" label={`${game.cleared} of 13 stations cleared`}><b className="num" style={{ fontSize: 20 }}>{game.cleared}/13</b></Ring>
        </div>
        <div className="row small" style={{ justifyContent: 'space-between' }}>
          <span>Stars {game.stars}/{game.maxStars}</span><span>Rank: {rank.name}</span><span>{xp.total} XP</span>
        </div>
      </section>

      <section className="card">
        <div className="row" style={{ justifyContent: 'space-between' }}><h3>Engine fuel</h3><span className="small muted">{fuelLabel}</span></div>
        <div className={'fuel f' + Math.ceil(game.fuel / 25)} role="img" aria-label={`Fuel ${game.fuel} percent`}><i style={{ width: game.fuel + '%' }} /></div>
        <p className="small muted" style={{ margin: '8px 0 0' }}>{game.missed ? `${game.missed} recent day${game.missed > 1 ? 's' : ''} under half done. Finish the open tasks to refuel.` : 'Keep each day at least half done and the tank stays full.'} You can never run out of the game, only slow down.</p>
      </section>

      <section className="card">
        <h3>The route</h3>
        <p className="small muted" style={{ margin: '4px 0 10px' }}>Tap a station. A red diamond means a boss is waiting. Stars: 80% of the week's tasks, the boss defeated, and every task done.</p>
        <Map game={game} sel={idx} onSel={setSel} />
      </section>

      <section className={'card station' + (s.cleared ? ' cleared' : '')}>
        <div className="row" style={{ justifyContent: 'space-between' }}>
          <div><span className="lab2">Station {s.k} of 13 · Week {s.k}</span><h2 style={{ marginTop: 2 }}>{s.name}</h2></div>
          <span className={'pill ' + (s.cleared ? 'ok' : s.unlocked ? 'prio-Medium' : 'prio-Low')}>{s.cleared ? 'Cleared' : s.unlocked ? 'Open' : 'Locked'}</span>
        </div>
        <p className="small" style={{ margin: '6px 0 12px' }}>{s.focus}</p>
        <div className="obj">
          <div className="row small" style={{ justifyContent: 'space-between' }}><span>Objective 1: finish 80% of this week's tasks</span><b className={s.tasksOk ? 'ok' : ''}>{s.taskPct}%</b></div>
          <Bar a={s.taskPct} b={100} accent={!s.tasksOk} />
          {s.topics > 0 && <div className="tiny muted" style={{ marginTop: 4 }}>{s.learned} of {s.topics} topics learned this week</div>}
        </div>
        <div className="boss">
          <div className="row" style={{ justifyContent: 'space-between' }}>
            <div><span className="lab2">Boss</span><div className="boss-n">{s.boss}</div></div>
            <div style={{ textAlign: 'right' }}><span className="lab2">To defeat it</span><div className="boss-n num">{s.target == null ? 'Any score' : s.target + '+'}</div></div>
          </div>
          <div className="hp" role="img" aria-label={`Boss health ${hp} percent`}><i style={{ width: hp + '%' }} /></div>
          <div className="row small" style={{ justifyContent: 'space-between' }}>
            <span>{s.bossDown ? 'Boss defeated' : `Boss health ${hp}%`}</span>
            <span>Your best this week: <b>{s.best === null ? 'none' : round1(s.best)}</b></span>
          </div>
        </div>
        <p className="tiny muted" style={{ margin: '10px 0' }}>Attacks are mocks and previous-year papers logged with a date from {fmt(parse(s.startIso))} onward. Reward for clearing: 120 XP, plus 30 for three stars.</p>
        <div className="row">
          <button className="btn" onClick={() => go('mocks')}>Log a mock</button>
          <button className="btn ghost" onClick={() => go('pyq')}>Log a paper</button>
          <button className="btn ghost" onClick={() => go('days')}>This week's tasks</button>
        </div>
      </section>

      <section className="card">
        <div className="row" style={{ justifyContent: 'space-between' }}><h3>Daily quests</h3><span className="small muted num">{claimed}/{game.quests.length} claimed</span></div>
        <p className="small muted" style={{ margin: '4px 0 6px' }}>Fresh every day. 25 XP each, and 50 bonus XP for all five.</p>
        {game.quests.map((q) => (
          <div className="quest" key={q.id}>
            <div className="grow">
              <b>{q.title}</b> <span className="small muted">{q.desc}</span>
              <Bar a={Math.min(q.cur, q.goal)} b={q.goal} accent={!q.ready} />
            </div>
            {q.claimed ? <span className="pill ok">Claimed</span> : q.ready ? <button className="btn sm" onClick={() => claim(q)}>Claim +25</button> : <span className="small num muted">{Math.min(q.cur, q.goal)}/{q.goal}</span>}
          </div>
        ))}
      </section>

      <section className="card">
        <h3>How to win</h3>
        <ol className="l">
          <li>Each week of the plan is a station. Finish 80% of its tasks.</li>
          <li>Defeat the station boss by logging a mock or paper that beats its target. Targets climb from any score to 90.</li>
          <li>Stations unlock in order, or when their week begins, so you never get stuck.</li>
          <li>Win by clearing Terminus 90: score 90 or more on a mock.</li>
          <li>Quests, quizzes, sprints, tricks and flashcards earn XP and ranks along the way.</li>
        </ol>
      </section>
    </>
  )
}
