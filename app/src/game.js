import { iso, addDays, parse, mockTotal } from './lib.js'

// Mission RRB: the plan is split into 13 stations of equal length. Clear a station by finishing 80% of its tasks
// and defeating its boss (log a mock or previous-year paper that beats the boss target).
export const STATIONS = [
  { name: 'Platform One', boss: 'Baseline Beast', target: null, focus: 'Take your baseline mock. Any score counts.' },
  { name: 'Percent Junction', boss: 'Percentage Phantom', target: 40, focus: 'Number system, percentages, ratio and profit.' },
  { name: 'Interest Yard', boss: 'Interest Imp', target: 45, focus: 'Interest, time and work, mixtures.' },
  { name: 'Speed Siding', boss: 'Speed Specter', target: 50, focus: 'Speed and distance, algebra, mensuration.' },
  { name: 'Geometry Gate', boss: 'Geometry Golem', target: 55, focus: 'Geometry, trigonometry, statistics, GA finish.' },
  { name: 'Timer Tunnel', boss: 'Timer Troll', target: 60, focus: 'Timed sets and your first full mock under the clock.' },
  { name: 'Mixed-Set Market', boss: 'Minotaur of Mixed Sets', target: 65, focus: 'Harder mixed sets and previous-year questions.' },
  { name: 'PYQ Pass', boss: 'PYQ Dragon', target: 70, focus: 'Full previous-year papers, one a day.' },
  { name: 'Shift Station', boss: 'Shift Serpent', target: 75, focus: 'More papers. Fix the weak topics you keep missing.' },
  { name: 'Mock Mountain', boss: 'Mock Mammoth', target: 80, focus: 'A mock every day. Analyse each one.' },
  { name: 'Accuracy Bridge', boss: 'Accuracy Ogre', target: 83, focus: 'Raise accuracy. Skip questions you cannot narrow down.' },
  { name: 'Penalty Plains', boss: 'Negative-Marking Hydra', target: 87, focus: 'Cut silly mistakes. Every wrong costs 1.33 marks.' },
  { name: 'Terminus 90', boss: 'The 90 Dragon', target: 90, focus: 'Final week. Score 90 in a mock and rest before exam day.' },
]
export const STAR_TASK_PCT = 80

export function buildGame(state, d, X) {
  const { DAYS, TOPICS, TOTAL } = X
  const attacks = [
    ...state.mocks.map((m) => ({ date: m.date, score: mockTotal(m, X.sections), src: m.name })),
    ...Object.entries(state.pyq).filter(([, p]) => p.done && p.score !== '' && p.score != null && !isNaN(+p.score)).map(([k, p]) => ({ date: p.date || state.start, score: +p.score, src: 'Paper ' + k.slice(1) })),
  ]
  const stations = STATIONS.map((st, i) => {
    const s = { ...st, focus: X.stationFocus?.[i] || st.focus }
    const k = i + 1, first = Math.floor((i * TOTAL) / 13) + 1, last = Math.max(first, Math.floor(((i + 1) * TOTAL) / 13))
    const days = DAYS.slice(first - 1, last)
    const all = days.reduce((a, x) => a + x.tasks.length, 0)
    const done = days.reduce((a, x) => a + d.dayDone(x.n), 0)
    const taskPct = all ? Math.round((done * 100) / all) : 0
    const startIso = iso(d.dateOf(first)), endIso = iso(d.dateOf(last))
    const mine = attacks.filter((a) => a.date >= startIso)
    const best = mine.length ? Math.max(...mine.map((a) => a.score)) : null
    const bossDown = s.target == null ? mine.length > 0 : best !== null && best >= s.target
    const topics = TOPICS.filter((t) => t.day >= first && t.day <= last)
    const learned = topics.filter((t) => state.topics[t.k]?.[0]).length
    const tasksOk = taskPct >= STAR_TASK_PCT
    const cleared = tasksOk && bossDown
    const stars = (tasksOk ? 1 : 0) + (bossDown ? 1 : 0) + (taskPct === 100 && bossDown ? 1 : 0)
    return { k, ...s, first, last, startIso, endIso, all, done, taskPct, best, bossDown, topics: topics.length, learned, tasksOk, cleared, stars }
  })
  stations.forEach((s, i) => { s.unlocked = i === 0 || stations[i - 1].cleared || d.today >= s.first })
  const current = stations.find((s) => s.unlocked && !s.cleared) || stations[stations.length - 1]
  const cleared = stations.filter((s) => s.cleared).length
  const stars = stations.reduce((a, s) => a + s.stars, 0)
  const won = stations[12].cleared
  const bestAll = attacks.length ? Math.max(...attacks.map((a) => a.score)) : null

  // Fuel: each of the last 4 days (before today) with under half its tasks done costs 25%.
  let missed = 0
  for (let n = Math.max(1, d.today - 4); n < d.today && n <= TOTAL; n++) if (d.dayDone(n) / DAYS[n - 1].tasks.length < 0.5) missed++
  const fuel = Math.max(0, 100 - missed * 25)

  const todayIso = iso(new Date())
  const cur = Math.max(1, Math.min(d.today, TOTAL))
  const focusToday = Object.values(state.log[todayIso] || {}).reduce((a, b) => a + (+b || 0), 0)
  const quests = [
    { id: 'day', title: 'Clear the day', desc: 'Finish every task on today\'s list', cur: d.dayDone(cur), goal: DAYS[cur - 1].tasks.length },
    { id: 'sprint', title: 'Sprint 100', desc: 'Score 100 in a Speed Maths sprint', cur: state.speed.daily?.[todayIso] || 0, goal: 100 },
    { id: 'quiz', title: 'Sharp shooter', desc: 'Score 80% or more on a quiz of 10 or more', cur: state.quiz.daily?.[todayIso] || 0, goal: 80 },
    { id: 'focus', title: 'Deep work', desc: 'Log 60 minutes of focus time', cur: focusToday, goal: 60 },
    { id: 'cards', title: 'Card collector', desc: 'Get 10 flashcards right', cur: state.cardsDay?.[todayIso] || 0, goal: 10 },
  ].map((q) => ({ ...q, reward: 25, ready: q.cur >= q.goal, claimed: !!state.quests?.[todayIso]?.includes(q.id) }))

  return { stations, current, cleared, stars, maxStars: STATIONS.length * 3, won, bestAll, fuel, missed, quests, todayIso }
}

export const bossHp = (s) => {
  if (s.bossDown) return 0
  if (s.target == null) return 100
  return Math.max(0, Math.round(100 - ((s.best ?? 0) / s.target) * 100))
}
export { addDays, parse }
