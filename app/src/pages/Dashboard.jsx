import { useState } from 'react'
import { useApp } from '../store.jsx'
import { useExam } from '../exam.jsx'
import { Bar, TaskList } from '../ui.jsx'
import { Ring, Heatmap, Train } from '../widgets.jsx'
import { fmt, pct, todayIso, round1, mockTotal, parse } from '../lib.js'
import { intent } from '../nav.js'
import { sfx } from '../fx.jsx'
import { bossHp } from '../game.js'

const TIPS = [
  'Skip any question that eats more than 90 seconds. Flag it and move on.',
  'A wrong answer costs 1.33 marks compared with skipping. Guess only after removing two options.',
  'Recall before you re-read. Close the notes and write what you remember first.',
  'Do the quick marks first: GA and Reasoning, then Maths.',
  'Revise the error log once a week. It is your personal question bank.',
  'Learn the squares to 30 and cubes to 15 until they are automatic.',
  'Current affairs: five one-liners a day beat a weekend binge.',
  'Take mocks at the same time of day as the real exam.',
  'Sleep is part of the plan. Seven hours beats a late-night extra chapter.',
  'After every mock, spend twice as long on analysis as you spent on the test.',
  'Short, daily practice on Reasoning beats long sessions twice a week.',
  'Read the question stem twice. Many Reasoning errors come from a missed word.',
]
const hello = () => { const h = new Date().getHours(); return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening' }

export default function Dashboard({ go }) {
  const { state, update, today, dateOf, dayDone, tasks, streak, backlog, rank, xp, game } = useApp()
  const X = useExam()
  const { DAYS, TOTAL, TOPICS, SUBS } = X
  const [peek, setPeek] = useState(null)
  const cur = Math.max(1, Math.min(today, TOTAL))
  const day = DAYS[cur - 1]
  const started = today >= 1, over = today > TOTAL
  const doneToday = dayDone(cur), allToday = day.tasks.length
  const nextIdx = day.tasks.findIndex((_, i) => !state.done[cur + '.' + i])
  const next = nextIdx >= 0 ? day.tasks[nextIdx] : null
  const nextSub = next ? next.g : null
  const exam = state.settings.examDate ? Math.ceil((parse(state.settings.examDate) - parse(todayIso())) / 864e5) : null
  const best = state.mocks.length ? Math.max(...state.mocks.map((m) => mockTotal(m, X.sections))) : null
  const tip = TIPS[(cur + new Date().getDate()) % TIPS.length]
  const subStats = SUBS.map((s) => {
    const t = TOPICS.filter((x) => x.sub === s)
    return { s, l: t.filter((x) => state.topics[x.k]?.[0]).length, n: t.length }
  })
  
  const doNext = () => update((s) => { s.done[cur + '.' + nextIdx] = 1 })
  const focus = () => {
    intent.focus = { sub: SUBS.includes(nextSub) ? nextSub : 'Revision', min: 25 }
    go('focus')
  }

  return (
    <>
      <section className="board hero">
        <div className="row" style={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div className="lab">{hello()}</div>
            <div className="big num">{!started ? 'Day 1' : over ? 'Plan done' : <>Day {today} <small>of {TOTAL}</small></>}</div>
            <div className="small" style={{ opacity: 0.85 }}>{started && !over ? `Phase ${day.ph.n} · ${day.ph.name} · ${fmt(dateOf(today))}` : over ? 'Keep taking mocks.' : 'Starts ' + fmt(dateOf(1))}</div>
          </div>
          <button className="chipbtn" onClick={() => go('rewards')} aria-label="Open rewards">
            <span className="lab">Rank {rank.idx + 1}</span>
            <b>{rank.name}</b>
            <span className="xpbar"><i style={{ width: rank.pct + '%' }} /></span>
            <span className="tiny">{xp.total} XP{rank.next ? ` · ${rank.nextAt - xp.total} to ${rank.next}` : ''}</span>
          </button>
        </div>
        <Train pct={started ? Math.min(100, ((cur - 1) / (TOTAL - 1)) * 100) : 0} />
        <div className="row small" style={{ justifyContent: 'space-between' }}>
          <span>{started && !over ? `${TOTAL - today} days left in plan` : ''}</span>
          <span>{exam !== null ? (exam >= 0 ? `${exam} day${exam === 1 ? '' : 's'} to exam` : 'Exam date passed') : <button className="linkbtn" onClick={() => go('settings')}>Set exam date</button>}</span>
        </div>
      </section>

      <button className={'card missionstrip' + (game.won ? ' won' : '')} onClick={() => go('mission')}>
        <div className="grow" style={{ textAlign: 'left' }}>
          <span className="lab2">{game.won ? 'Victory' : `Mission 90 · Station ${game.current.k} of 13`}</span>
          <div className="nu-t">{game.won ? 'You beat the 90 Dragon' : game.current.name}</div>
          {!game.won && <div className="small muted">Boss: {game.current.boss} · needs {game.current.target == null ? 'any score' : game.current.target + '+'}</div>}
          <div className="hp" style={{ marginTop: 8 }}><i style={{ width: (game.won ? 0 : bossHp(game.current)) + '%' }} /></div>
        </div>
        <div style={{ textAlign: 'center' }}><b className="sc num">{game.cleared}</b><div className="tiny muted">of 13 cleared</div></div>
      </button>

      <section className="card nextup">
        <Ring value={pct(doneToday, allToday)} size={92} stroke={10} color="var(--ok)" label={`${doneToday} of ${allToday} tasks done today`}>
          <b className="num">{doneToday}/{allToday}</b><span className="tiny muted">today</span>
        </Ring>
        <div className="grow">
          {next ? (
            <>
              <div className="lab2">Next up · <span className={'dot s-' + X.colorOf[nextSub]} />{nextSub}</div>
              <div className="nu-t">{next.l}</div>
              <div className="row" style={{ marginTop: 10 }}>
                <button className="btn" onClick={() => { sfx('ok'); doNext() }}>Mark done</button>
                <button className="btn ghost" onClick={focus}>Focus 25 min</button>
              </div>
            </>
          ) : (
            <>
              <div className="lab2">All done</div>
              <div className="nu-t">Day {cur} is complete. Try a quiz or a Speed Maths sprint.</div>
              <div className="row" style={{ marginTop: 10 }}><button className="btn" onClick={() => go('quiz')}>Take a quiz</button></div>
            </>
          )}
        </div>
      </section>

      <section className="card">
        <div className="row" style={{ justifyContent: 'space-between', marginBottom: 6 }}>
          <h2>{started && !over ? 'Today' : 'Day ' + cur}</h2>
          <span className="small muted">by subject and topic</span>
        </div>
        <TaskList n={cur} />
      </section>

      <section className="grid3">
        {subStats.map((x) => (
          <button key={x.s} className="card mini" onClick={() => { intent.topicSub = x.s; go('topics') }}>
            <Ring value={pct(x.l, x.n)} size={64} stroke={8} color={`var(--c-${X.colorOf[x.s]})`} label={`${x.s}: ${x.l} of ${x.n} topics learned`}><b className="num tiny">{pct(x.l, x.n)}%</b></Ring>
            <b>{x.s}</b>
            <span className="tiny muted">{x.l}/{x.n} topics</span>
          </button>
        ))}
      </section>

      <details>
        <summary><h3>Your {TOTAL} days</h3><span className="small muted">Tap a day to open it</span></summary>
        <div className="in">
          <Heatmap selected={peek} onSelect={(n) => setPeek(peek === n ? null : n)} />
          {peek && (
            <div className="peek">
              <div className="row" style={{ justifyContent: 'space-between', marginBottom: 4 }}>
                <b>Day {peek} <span className="muted small">{fmt(dateOf(peek))}</span></b>
                <button className="btn ghost sm" onClick={() => setPeek(null)}>Close</button>
              </div>
              <div className="small muted" style={{ marginBottom: 6 }}>{DAYS[peek - 1].sum}</div>
              <TaskList n={peek} />
            </div>
          )}
        </div>
      </details>

      <section className="stats">
        <div className="stat"><span className="lab">Tasks done</span><b className="num">{pct(tasks.done, tasks.all)}%</b><div style={{ marginTop: 6 }}><Bar a={tasks.done} b={tasks.all} accent /></div></div>
        <div className="stat"><span className="lab">Day streak</span><b className="num">{streak}</b></div>
        <div className="stat"><span className="lab">Best mock</span><b className="num">{best === null ? '–' : round1(best)}</b></div>
      </section>

      {backlog > 0 && (
        <section className="card row" style={{ justifyContent: 'space-between' }}>
          <span><b>{backlog}</b> earlier day{backlog > 1 ? 's have' : ' has'} unfinished tasks.</span>
          <button className="btn ghost sm" onClick={() => go('days')}>Review backlog</button>
        </section>
      )}
      <p className="small muted tipline">{tip}</p>
    </>
  )
}
