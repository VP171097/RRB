import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { xpParts, rankInfo, BADGES } from './gamify.js'
import { buildGame } from './game.js'
import { notify, confetti, sfx } from './fx.jsx'
import { useExam } from './exam.jsx'
import { todayIso, parse, addDays } from './lib.js'

const LEGACY_KEY = 'ntpc-prep-v2'

export const blank = () => ({
  t: 0,
  start: todayIso(),
  done: {}, subdone: {}, topics: {}, syl: {}, ca: {}, pyq: {},
  mocks: [], errors: [], log: {}, badges: {}, cards: {}, tricks: {}, quests: {}, cardsDay: {},
  quiz: { xp: 0, played: 0, best: 0, sharp: 0, daily: {} }, speed: { xp: 0, best: {}, daily: {} },
  settings: { dailyHours: 7, examDate: '' },
})

const merge = (p) => {
  const b = blank()
  return { ...b, ...p, settings: { ...b.settings, ...p.settings }, quiz: { ...b.quiz, ...p.quiz }, speed: { ...b.speed, ...p.speed } }
}

function load(id) {
  try {
    const raw = localStorage.getItem('mission90-' + id) || (id === 'graduate' ? localStorage.getItem(LEGACY_KEY) : null)
    if (raw) return merge(JSON.parse(raw))
  } catch { /* storage blocked: start blank */ }
  return blank()
}

const Ctx = createContext(null)
export const useApp = () => useContext(Ctx)

export function Provider({ children }) {
  const X = useExam()
  const { DAYS, TOTAL } = X
  const [state, setState] = useState(() => load(X.id))
  const [saveError, setSaveError] = useState(false)
  const first = useRef(true)

  useEffect(() => {
    if (first.current) { first.current = false; return }
    try { localStorage.setItem('mission90-' + X.id, JSON.stringify(state)); setSaveError(false) } catch { setSaveError(true) }
  }, [state, X.id])

  const update = useCallback((mut) => {
    setState((prev) => {
      const next = structuredClone(prev)
      mut(next)
      next.t = Date.now()
      return next
    })
  }, [])
  const replace = useCallback((next) => setState({ ...merge(next), t: Date.now() }), [])

  const derived = useMemo(() => {
    const start = parse(state.start)
    const dateOf = (n) => addDays(start, n - 1)
    const today = Math.floor((parse(todayIso()) - start) / 864e5) + 1
    const dayDone = (n) => DAYS[n - 1].tasks.reduce((c, _, i) => c + (state.done[n + '.' + i] ? 1 : 0), 0)
    const dayFull = (n) => dayDone(n) === DAYS[n - 1].tasks.length
    let all = 0, done = 0
    DAYS.forEach((d) => { all += d.tasks.length; done += dayDone(d.n) })
    let streak = 0
    let n = Math.min(today, TOTAL)
    if (n >= 1 && !dayFull(n)) n--
    for (; n >= 1 && dayFull(n); n--) streak++
    let backlog = 0
    for (let i = 1; i <= Math.min(today - 1, TOTAL); i++) if (!dayFull(i)) backlog++
    const learned = X.TOPICS.filter((t) => state.topics[t.k]?.[0]).length
    return { dateOf, today, dayDone, dayFull, tasks: { all, done }, streak, backlog, learned, topicCount: X.TOPICS.length }
  }, [state, DAYS, TOTAL, X.TOPICS])

  const game = useMemo(() => buildGame(state, derived, X), [state, derived, X])
  const xpInfo = useMemo(() => xpParts(state, game, X), [state, game, X])
  const rank = useMemo(() => rankInfo(xpInfo.total), [xpInfo])

  // Rewards: XP toasts, rank-ups, badges, station clears and the day-complete celebration.
  const prev = useRef(null)
  const born = useRef(Date.now())
  useEffect(() => {
    const cur = Math.max(1, Math.min(derived.today, TOTAL))
    const snap = { xp: xpInfo.total, rank: rank.idx, full: derived.dayFull(cur), cur, cleared: game.cleared, won: game.won }
    const p = prev.current
    prev.current = snap
    const live = Date.now() - born.current > 1500
    const newly = BADGES.filter((b) => !state.badges[b.id] && b.test({ s: state, X, streak: derived.streak, dayFull: derived.dayFull, game }))
    if (newly.length) {
      const stamp = todayIso()
      update((s) => { newly.forEach((b) => { s.badges[b.id] = stamp }) })
      if (p && live) { newly.forEach((b) => notify('Badge unlocked: ' + b.name, 'badge')); confetti(90); sfx('level') }
    }
    if (!p || !live) return
    if (snap.xp > p.xp) { notify('+' + (snap.xp - p.xp) + ' XP'); sfx('tick') }
    if (snap.rank > p.rank) { notify('Rank up: ' + rank.name, 'badge'); confetti(200); sfx('level') }
    if (snap.cleared > p.cleared) { notify('Station cleared: ' + game.stations.filter((s) => s.cleared).at(-1)?.name, 'badge'); confetti(180); sfx('level') }
    if (snap.won && !p.won) { notify('YOU WIN. The 90 Dragon is down.', 'badge'); confetti(400); sfx('level') }
    if (snap.cur === p.cur && snap.full && !p.full) { notify('Day ' + cur + ' complete. Well run.', 'badge'); confetti(160); sfx('done') }
  }, [state]) // eslint-disable-line react-hooks/exhaustive-deps

  const value = useMemo(() => ({ state, update, replace, saveError, xp: xpInfo, rank, game, ...derived }), [state, update, replace, saveError, xpInfo, rank, game, derived])
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}
