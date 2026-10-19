import { useApp } from '../store.jsx'
import { DAYS, TOTAL } from '../data/plan.js'
import { Bar, TaskList } from '../ui.jsx'
import { fmt, pct, todayIso, round1, mockTotal } from '../lib.js'

export default function Dashboard({ go }) {
  const { state, update, today, dateOf, dayDone, tasks, learned, topicCount, streak, backlog } = useApp()
  const cur = Math.max(1, Math.min(today, TOTAL))
  const day = DAYS[cur - 1]
  const started = today >= 1, over = today > TOTAL
  const stations = []
  const cw = started ? Math.min(13, Math.floor((cur - 1) / 7) + 1) : 0
  for (let w = 1; w <= 13; w++) {
    if (w > 1) stations.push(<span key={'l' + w} className={'ln' + (w <= cw ? ' pass' : '')} />)
    stations.push(<span key={w} className={'st' + (w < cw ? ' pass' : w === cw && !over ? ' now' : '')}><i />W{w}</span>)
  }
  const best = state.mocks.length ? Math.max(...state.mocks.map(mockTotal)) : null
  const last = state.mocks.length ? [...state.mocks].sort((a, b) => (a.date < b.date ? -1 : 1)).at(-1) : null
  const minsToday = Object.values(state.log[todayIso()] || {}).reduce((a, b) => a + b, 0)
  const target = state.settings.dailyHours * 60

  return (
    <>
      <section className="board">
        <div className="lab">{started ? `Phase ${day.ph.n} · ${day.ph.name} · Week ${day.w}` : 'Not started'}</div>
        <div className="big num">{!started ? 'Day 1' : over ? 'Done' : <>Day {today} <small>/ {TOTAL}</small></>}</div>
        <div className="row small" style={{ justifyContent: 'space-between' }}>
          <span>{started && !over ? fmt(dateOf(today)) : over ? 'Plan complete. Keep taking mocks.' : 'Starts ' + fmt(dateOf(1))}</span>
          <span>{started && !over ? `${TOTAL - today} days left in plan` : ''}</span>
        </div>
        <div className="route">{stations}</div>
      </section>

      <section className="stats">
        <div className="stat"><span className="lab">Tasks done</span><b className="num">{pct(tasks.done, tasks.all)}%</b><div style={{ marginTop: 6 }}><Bar a={tasks.done} b={tasks.all} accent /></div></div>
        <div className="stat"><span className="lab">Topics learned</span><b className="num">{learned}/{topicCount}</b><div style={{ marginTop: 6 }}><Bar a={learned} b={topicCount} /></div></div>
        <div className="stat"><span className="lab">Day streak</span><b className="num">{streak}</b></div>
        <div className="stat"><span className="lab">Best mock</span><b className="num">{best === null ? '–' : round1(best)}</b></div>
        <div className="stat"><span className="lab">Studied today</span><b className="num">{round1(minsToday / 60)}h</b><div style={{ marginTop: 6 }}><Bar a={minsToday} b={target} /></div></div>
      </section>

      <section className="card">
        <div className="row" style={{ justifyContent: 'space-between', marginBottom: 6 }}>
          <h2>{started && !over ? 'Today' : 'Day ' + cur}</h2>
          <span className="small muted num">{dayDone(cur)} / {day.tasks.length} done</span>
        </div>
        {!(started && !over) && <p className="small muted" style={{ margin: '0 0 6px' }}>Showing day {cur}. Change the start date in Settings to begin.</p>}
        <TaskList n={cur} />
      </section>

      {backlog > 0 && (
        <section className="card row" style={{ justifyContent: 'space-between' }}>
          <span><b>{backlog}</b> earlier day{backlog > 1 ? 's have' : ' has'} unfinished tasks.</span>
          <button className="btn ghost sm" onClick={() => go('days')}>Review backlog</button>
        </section>
      )}

      {last && (
        <section className="card">
          <h3>Latest mock</h3>
          <p style={{ margin: '6px 0 0' }}><b>{last.name}</b>: <span className="num">{round1(mockTotal(last))} / 100</span> <span className="muted small">(GA {last.ga}, Maths {last.maths}, Reasoning {last.reas})</span></p>
        </section>
      )}

      <section className="card">
        <h3>Jump to</h3>
        <div className="seg" style={{ marginTop: 8 }}>
          {[['syllabus', 'Syllabus'], ['pyq', 'Previous-year papers'], ['resources', 'Resources'], ['library', 'PDF library'], ['notes', 'Formula sheets'], ['exam', 'Exam pattern']].map(([k, l]) =>
            <button key={k} className="btn ghost sm" onClick={() => go(k)}>{l}</button>)}
        </div>
      </section>
    </>
  )
}
