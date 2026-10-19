import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { xpParts, rankInfo, BADGES } from './gamify.js'
import { notify, confetti, sfx, setSound } from './fx.jsx'
import { DAYS, TOTAL, TOPICS } from './data/plan.js'
import { todayIso, parse, iso, addDays } from './lib.js'

const KEY = 'ntpc-prep-v2'

export const blank = () => ({
  t: 0,
  start: todayIso(),
  done: {}, topics: {}, syl: {}, ca: {}, pyq: {},
  mocks: [], errors: [], log: {}, badges: {}, cards: {},
  quiz: { xp: 0, played: 0, best: 0, sharp: 0 }, speed: { xp: 0, best: {} },
  settings: { dailyHours: 7, theme: 'system', palette: 'ocean', sound: true, examDate: '' },
})

function load() {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) {
      const p = JSON.parse(raw), b = blank()
      return { ...b, ...p, settings: { ...b.settings, ...p.settings }, quiz: { ...b.quiz, ...p.quiz }, speed: { ...b.speed, ...p.speed } }
    }
  } catch { /* storage blocked: start blank */ }
  return blank()
}

const Ctx = createContext(null)
export const useApp = () => useContext(Ctx)

export function Provider({ children }) {
  const [state, setState] = useState(load)
  const [saveError, setSaveError] = useState(false)
  const first = useRef(true)

  useEffect(() => {
    if (first.current) { first.current = false; return }
    try { localStorage.setItem(KEY, JSON.stringify(state)); setSaveError(false) } catch { setSaveError(true) }
  }, [state])

  useEffect(() => {
    const root = document.documentElement
    if (state.settings.theme === 'system') root.removeAttribute('data-theme')
    else root.setAttribute('data-theme', state.settings.theme)
    root.setAttribute('data-palette', state.settings.palette || 'ocean')
    setSound(state.settings.sound !== false)
  }, [state.settings.theme, state.settings.palette, state.settings.sound])

  const update = useCallback((mut) => {
    setState((prev) => {
      const next = structuredClone(prev)
      mut(next)
      next.t = Date.now()
      return next
    })
  }, [])

  const replace = useCallback((next) => {
    const b = blank()
    setState({ ...b, ...next, settings: { ...b.settings, ...next.settings }, quiz: { ...b.quiz, ...next.quiz }, speed: { ...b.speed, ...next.speed }, t: Date.now() })
  }, [])

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
    const learned = TOPICS.filter((t) => state.topics[t.k]?.[0]).length
    const rev3 = TOPICS.filter((t) => state.topics[t.k]?.[4]).length
    return { dateOf, today, dayDone, dayFull, tasks: { all, done }, streak, backlog, learned, rev3, topicCount: TOPICS.length }
  }, [state])

  const xpInfo = useMemo(() => xpParts(state), [state])
  const rank = useMemo(() => rankInfo(xpInfo.total), [xpInfo])

  // Rewards: XP toasts, rank-ups, badges and the day-complete celebration.
  const prev = useRef(null)
  const born = useRef(Date.now())
  useEffect(() => {
    const cur = Math.max(1, Math.min(derived.today, TOTAL))
    const snap = { xp: xpInfo.total, rank: rank.idx, full: derived.dayFull(cur), cur }
    const p = prev.current
    prev.current = snap
    const live = Date.now() - born.current > 1500
    const newly = BADGES.filter((b) => !state.badges[b.id] && b.test({ s: state, streak: derived.streak, dayFull: derived.dayFull }))
    if (newly.length) {
      const stamp = todayIso()
      update((s) => { newly.forEach((b) => { s.badges[b.id] = stamp }) })
      if (p && live) newly.forEach((b) => notify('Badge unlocked: ' + b.name, 'badge'))
      if (p && live) { confetti(90); sfx('level') }
    }
    if (!p || !live) return
    if (snap.xp > p.xp) { notify('+' + (snap.xp - p.xp) + ' XP'); sfx('tick') }
    if (snap.rank > p.rank) { notify('Rank up: ' + rank.name, 'badge'); confetti(200); sfx('level') }
    if (snap.cur === p.cur && snap.full && !p.full) { notify('Day ' + cur + ' complete. Well run.', 'badge'); confetti(160); sfx('done') }
  }, [state]) // eslint-disable-line react-hooks/exhaustive-deps

  const value = useMemo(() => ({ state, update, replace, saveError, xp: xpInfo, rank, ...derived }), [state, update, replace, saveError, xpInfo, rank, derived])
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export { iso }
