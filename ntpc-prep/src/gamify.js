import { TOPICS, DAYS, TOTAL, COLS } from './data/plan.js'

export const RANKS = [
  [0, 'Platform Passenger'], [200, 'Ticket Collector'], [600, 'Train Guard'], [1200, 'Assistant Loco Pilot'],
  [2000, 'Station Master Trainee'], [3000, 'Traffic Assistant'], [4200, 'Commercial Clerk'], [5600, 'Station Master'], [7500, 'Chief Controller'],
]

export function rankInfo(xp) {
  let i = 0
  RANKS.forEach((r, k) => { if (xp >= r[0]) i = k })
  const cur = RANKS[i][0], next = RANKS[i + 1]
  return { idx: i, name: RANKS[i][1], next: next ? next[1] : null, nextAt: next ? next[0] : cur, pct: next ? Math.round(((xp - cur) / (next[0] - cur)) * 100) : 100 }
}

const sum = (o) => Object.values(o || {}).reduce((a, b) => a + (+b || 0), 0)
export const cardsKnown = (s) => Object.values(s.cards || {}).filter((c) => c.box >= 3).length
export const focusMinutes = (s) => Object.values(s.log || {}).reduce((a, d) => a + sum(d), 0)
export const tasksDone = (s) => Object.keys(s.done).length
export const stagesDone = (s) => TOPICS.reduce((a, t) => a + COLS.filter((_, i) => s.topics[t.k]?.[i]).length, 0)

export function xpParts(s) {
  const parts = [
    ['Daily tasks', tasksDone(s) * 10],
    ['Topic stages', stagesDone(s) * 8],
    ['Syllabus sub-topics', Object.keys(s.syl).length * 3],
    ['Mocks logged', s.mocks.length * 40],
    ['Errors mastered', s.errors.filter((e) => e.done).length * 10],
    ['Previous-year papers', Object.values(s.pyq).filter((p) => p.done).length * 30],
    ['Focus time', Math.round(focusMinutes(s) / 2)],
    ['Quizzes', s.quiz?.xp || 0],
    ['Speed Maths', s.speed?.xp || 0],
    ['Flashcards', cardsKnown(s) * 4],
  ]
  return { parts, total: parts.reduce((a, p) => a + p[1], 0) }
}

const learned = (s) => TOPICS.filter((t) => s.topics[t.k]?.[0]).length
const bestMock = (s) => (s.mocks.length ? Math.max(...s.mocks.map((m) => (+m.ga || 0) + (+m.maths || 0) + (+m.reas || 0))) : 0)
const perfectWeeks = (dayFull) => { let c = 0; for (let w = 0; w < 13; w++) { let ok = true; for (let d = 1; d <= 7; d++) if (!dayFull(w * 7 + d)) ok = false; if (ok) c++ } return c }

// c = { s: state, streak, dayFull }
export const BADGES = [
  { id: 'first', name: 'First Signal', desc: 'Complete your first task', color: 'ga', test: (c) => tasksDone(c.s) >= 1 },
  { id: 'day', name: 'Clean Run', desc: 'Finish every task in a day', color: 'ok', test: (c) => DAYS.some((d) => c.dayFull(d.n)) },
  { id: 'st3', name: 'Three on Track', desc: 'Keep a 3-day streak', color: 'maths', test: (c) => c.streak >= 3 },
  { id: 'st7', name: 'Week on the Rails', desc: 'Keep a 7-day streak', color: 'maths', test: (c) => c.streak >= 7 },
  { id: 'st21', name: 'Express Service', desc: 'Keep a 21-day streak', color: 'maths', test: (c) => c.streak >= 21 },
  { id: 'wk', name: 'Perfect Week', desc: 'Finish every task in a full week', color: 'ok', test: (c) => perfectWeeks(c.dayFull) >= 1 },
  { id: 't50', name: 'Fifty Tasks', desc: 'Tick off 50 tasks', color: 'rev', test: (c) => tasksDone(c.s) >= 50 },
  { id: 't250', name: 'Long Haul', desc: 'Tick off 250 tasks', color: 'rev', test: (c) => tasksDone(c.s) >= 250 },
  { id: 'l10', name: 'Ten Topics', desc: 'Learn 10 topics', color: 'reas', test: (c) => learned(c.s) >= 10 },
  { id: 'l40', name: 'Half the Map', desc: 'Learn 40 topics', color: 'reas', test: (c) => learned(c.s) >= 40 },
  { id: 'lall', name: 'Full Syllabus', desc: 'Learn every topic', color: 'reas', test: (c) => learned(c.s) >= TOPICS.length },
  { id: 'm1', name: 'Baseline Set', desc: 'Log your first mock', color: 'mock', test: (c) => c.s.mocks.length >= 1 },
  { id: 'm60', name: 'Sixty Club', desc: 'Score 60+ in a mock', color: 'mock', test: (c) => bestMock(c.s) >= 60 },
  { id: 'm80', name: 'Safe Zone', desc: 'Score 80+ in a mock', color: 'mock', test: (c) => bestMock(c.s) >= 80 },
  { id: 'm90', name: 'Target Hit', desc: 'Score 90+ in a mock', color: 'mock', test: (c) => bestMock(c.s) >= 90 },
  { id: 'e5', name: 'Mistake Fixer', desc: 'Master 5 errors from your log', color: 'ok', test: (c) => c.s.errors.filter((e) => e.done).length >= 5 },
  { id: 'f5', name: 'Deep Work', desc: 'Log 5 hours of study', color: 'ga', test: (c) => focusMinutes(c.s) >= 300 },
  { id: 'f25', name: 'Platform Regular', desc: 'Log 25 hours of study', color: 'ga', test: (c) => focusMinutes(c.s) >= 1500 },
  { id: 'q1', name: 'Quiz Starter', desc: 'Finish a quiz', color: 'reas', test: (c) => (c.s.quiz?.played || 0) >= 1 },
  { id: 'q90', name: 'Sharp Mind', desc: 'Score 90%+ on a quiz of 10 or more', color: 'reas', test: (c) => (c.s.quiz?.sharp || 0) >= 1 },
  { id: 'sp', name: 'Quick Hands', desc: 'Score 300+ in a Speed Maths sprint', color: 'maths', test: (c) => Math.max(0, ...Object.values(c.s.speed?.best || {})) >= 300 },
  { id: 'c50', name: 'Card Shark', desc: 'Know 50 flashcards', color: 'ga', test: (c) => cardsKnown(c.s) >= 50 },
]
export const TOTAL_DAYS = TOTAL
