import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { DAYS, TOTAL, TOPICS } from './data/plan.js'
import { todayIso, parse, iso, addDays } from './lib.js'

const KEY = 'ntpc-prep-v2'

export const blank = () => ({
  t: 0,
  start: todayIso(),
  done: {}, topics: {}, syl: {}, ca: {}, pyq: {},
  mocks: [], errors: [], log: {},
  settings: { dailyHours: 7, theme: 'system' },
})

function load() {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) return { ...blank(), ...JSON.parse(raw) }
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
  }, [state.settings.theme])

  const update = useCallback((mut) => {
    setState((prev) => {
      const next = structuredClone(prev)
      mut(next)
      next.t = Date.now()
      return next
    })
  }, [])

  const replace = useCallback((next) => setState({ ...blank(), ...next, t: Date.now() }), [])

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

  const value = useMemo(() => ({ state, update, replace, saveError, ...derived }), [state, update, replace, saveError, derived])
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export { iso }
