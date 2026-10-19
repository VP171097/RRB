import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { DEFAULT_EXAM, EXAM_LIST } from './exams.js'
import { setSound } from './fx.jsx'

const KEY = 'mission90-global'
const base = () => ({ exam: DEFAULT_EXAM, theme: 'system', palette: 'ocean', sound: true, lang: 'en' })

function load() {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) return { ...base(), ...JSON.parse(raw) }
    // First run after the multi-exam update: carry over look-and-feel from the old single-exam save.
    const old = JSON.parse(localStorage.getItem('ntpc-prep-v2') || 'null')
    if (old?.settings) return { ...base(), theme: old.settings.theme || 'system', palette: old.settings.palette || 'ocean', sound: old.settings.sound !== false }
  } catch { /* storage blocked */ }
  return base()
}

const Ctx = createContext(null)
export const useGlobal = () => useContext(Ctx)

export function GlobalProvider({ children }) {
  const [g, setGState] = useState(load)
  const set = (patch) => setGState((p) => {
    const next = { ...p, ...patch }
    if (!EXAM_LIST.some((e) => e.id === next.exam)) next.exam = DEFAULT_EXAM
    try { localStorage.setItem(KEY, JSON.stringify(next)) } catch { /* ignore */ }
    return next
  })
  useEffect(() => {
    const root = document.documentElement
    if (g.theme === 'system') root.removeAttribute('data-theme'); else root.setAttribute('data-theme', g.theme)
    root.setAttribute('data-palette', g.palette)
    setSound(g.sound !== false)
  }, [g.theme, g.palette, g.sound])
  const value = useMemo(() => ({ g, set }), [g]) // eslint-disable-line react-hooks/exhaustive-deps
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}
