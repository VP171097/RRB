import { useState } from 'react'
import { useApp } from '../store.jsx'
import { useExam } from '../exam.jsx'
import { Bar, TaskList } from '../ui.jsx'
import { Ring, Heatmap, Train } from '../widgets.jsx'
import { fmt, pct, todayIso, round1, mockTotal, parse } from '../lib.js'
import { intent } from '../nav.js'
import { sfx } from '../fx.jsx'
import { bossHp } from '../game.js'
import { useT } from '../i18n.jsx'
import { planT } from '../planText.js'

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
const hello = (t) => { const h = new Date().getHours(); return t(h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening') }

export default function Dashboard({ go }) {
  const t = useT()
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
    const tp = TOPICS.filter((x) => x.sub === s)
    return { s, l: tp.filter((x) => state.topics[x.k]?.[0]).length, n: tp.length }
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
            <div className="lab">{hello(t)}</div>
            <div className="big num">{!started ? t('Day {n}', { n: 1 }) : over ? t('Plan done') : <>{t('Day {n}', { n: today })} <small>{t('of {total}', { total: TOTAL })}</small></>}</div>
            <div className="small" style={{ opacity: 0.85 }}>{started && !over ? `${t('Phase {n}', { n: day.ph.n })} · ${t(day.ph.name)} · ${fmt(dateOf(today))}` : over ? t('Keep taking mocks.') : t('Starts {date}', { date: fmt(dateOf(1)) })}</div>
          </div>
          <button className="chipbtn" onClick={() => go('rewards')} aria-label={t('Open rewards')}>
            <span className="lab">{t('Rank {n}', { n: rank.idx + 1 })}</span>
            <b>{t(rank.name)}</b>
            <span className="xpbar"><i style={{ width: rank.pct + '%' }} /></span>
            <span className="tiny">{xp.total} XP{rank.next ? ` · ${t('{n} to {rank}', { n: rank.nextAt - xp.total, rank: t(rank.next) })}` : ''}</span>
          </button>
        </div>
        <Train pct={started ? Math.min(100, ((cur - 1) / (TOTAL - 1)) * 100) : 0} />
        <div className="row small" style={{ justifyContent: 'space-between' }}>
          <span>{started && !over ? t('{n} days left in plan', { n: TOTAL - today }) : ''}</span>
          <span>{exam !== null ? (exam >= 0 ? t(exam === 1 ? '{n} day to exam' : '{n} days to exam', { n: exam }) : t('Exam date passed')) : <button className="linkbtn" onClick={() => go('settings')}>{t('Set exam date')}</button>}</span>
        </div>
      </section>

      <button className={'card missionstrip' + (game.won ? ' won' : '')} onClick={() => go('mission')}>
        <div className="grow" style={{ textAlign: 'left' }}>
          <span className="lab2">{game.won ? t('Victory') : `${t('Mission RRB')} · ${t('Station {k} of 13', { k: game.current.k })}`}</span>
          <div className="nu-t">{game.won ? t('You beat the 90 Dragon') : t(game.current.name)}</div>
          {!game.won && <div className="small muted">{t('Boss: {boss} · needs {score}', { boss: t(game.current.boss), score: game.current.target == null ? t('any score') : game.current.target + '+' })}</div>}
          <div className="hp" style={{ marginTop: 8 }}><i style={{ width: (game.won ? 0 : bossHp(game.current)) + '%' }} /></div>
        </div>
        <div style={{ textAlign: 'center' }}><b className="sc num">{game.cleared}</b><div className="tiny muted">{t('of 13 cleared')}</div></div>
      </button>

      <section className="card nextup">
        <Ring value={pct(doneToday, allToday)} size={92} stroke={10} color="var(--ok)" label={t('{done} of {all} tasks done today', { done: doneToday, all: allToday })}>
          <b className="num">{doneToday}/{allToday}</b><span className="tiny muted">{t('today')}</span>
        </Ring>
        <div className="grow">
          {next ? (
            <>
              <div className="lab2">{t('Next up')} · <span className={'dot s-' + X.colorOf[nextSub]} />{t(nextSub)}</div>
              <div className="nu-t">{planT(t, next.l)}</div>
              <div className="row" style={{ marginTop: 10 }}>
                <button className="btn" onClick={() => { sfx('ok'); doNext() }}>{t('Mark done')}</button>
                <button className="btn ghost" onClick={focus}>{t('Focus 25 min')}</button>
              </div>
            </>
          ) : (
            <>
              <div className="lab2">{t('All done')}</div>
              <div className="nu-t">{t('Day {n} is complete. Try a quiz or a Speed Maths sprint.', { n: cur })}</div>
              <div className="row" style={{ marginTop: 10 }}><button className="btn" onClick={() => go('quiz')}>{t('Take a quiz')}</button></div>
            </>
          )}
        </div>
      </section>

      <section className="card">
        <div className="row" style={{ justifyContent: 'space-between', marginBottom: 6 }}>
          <h2>{started && !over ? t('Today') : t('Day {n}', { n: cur })}</h2>
          <span className="small muted">{t('by subject and topic')}</span>
        </div>
        <TaskList n={cur} />
      </section>

      <section className="grid3">
        {subStats.map((x) => (
          <button key={x.s} className="card mini" onClick={() => { intent.topicSub = x.s; go('topics') }}>
            <Ring value={pct(x.l, x.n)} size={64} stroke={8} color={`var(--c-${X.colorOf[x.s]})`} label={t('{sub}: {l} of {n} topics learned', { sub: t(x.s), l: x.l, n: x.n })}><b className="num tiny">{pct(x.l, x.n)}%</b></Ring>
            <b>{t(x.s)}</b>
            <span className="tiny muted">{t('{l}/{n} topics', { l: x.l, n: x.n })}</span>
          </button>
        ))}
      </section>

      <details>
        <summary><h3>{t('Your {n} days', { n: TOTAL })}</h3><span className="small muted">{t('Tap a day to open it')}</span></summary>
        <div className="in">
          <Heatmap selected={peek} onSelect={(n) => setPeek(peek === n ? null : n)} />
          {peek && (
            <div className="peek">
              <div className="row" style={{ justifyContent: 'space-between', marginBottom: 4 }}>
                <b>{t('Day {n}', { n: peek })} <span className="muted small">{fmt(dateOf(peek))}</span></b>
                <button className="btn ghost sm" onClick={() => setPeek(null)}>{t('Close')}</button>
              </div>
              <div className="small muted" style={{ marginBottom: 6 }}>{planT(t, DAYS[peek - 1].sum)}</div>
              <TaskList n={peek} />
            </div>
          )}
        </div>
      </details>

      <section className="stats">
        <div className="stat"><span className="lab">{t('Tasks done')}</span><b className="num">{pct(tasks.done, tasks.all)}%</b><div style={{ marginTop: 6 }}><Bar a={tasks.done} b={tasks.all} accent /></div></div>
        <div className="stat"><span className="lab">{t('Day streak')}</span><b className="num">{streak}</b></div>
        <div className="stat"><span className="lab">{t('Best mock')}</span><b className="num">{best === null ? '–' : round1(best)}</b></div>
      </section>

      {backlog > 0 && (
        <section className="card row" style={{ justifyContent: 'space-between' }}>
          <span><b>{backlog}</b> {t(backlog > 1 ? 'earlier days have unfinished tasks.' : 'earlier day has unfinished tasks.')}</span>
          <button className="btn ghost sm" onClick={() => go('days')}>{t('Review backlog')}</button>
        </section>
      )}
      <p className="small muted tipline">{t(tip)}</p>
    </>
  )
}
