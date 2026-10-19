export const pad = (n) => (n < 10 ? '0' + n : '' + n)
export const iso = (d) => d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate())
export const parse = (s) => { const a = s.split('-'); return new Date(+a[0], +a[1] - 1, +a[2]) }
export const addDays = (d, n) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n)
let LOC
export const setLocale = (l) => { LOC = l }
export const fmt = (d) => d.toLocaleDateString(LOC, { weekday: 'short', day: 'numeric', month: 'short' })
export const dayName = (d, style = 'narrow') => d.toLocaleDateString(LOC, { weekday: style })
export const pct = (a, b) => (b ? Math.round((a * 100) / b) : 0)
export const todayIso = () => iso(new Date())
export const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6)
// Total of a mock across the exam's sections (keys differ: Group D has a Science section).
export const mockTotal = (m, sections) => sections.reduce((a, s) => a + (+m[s.key] || 0), 0)
export const round1 = (n) => Math.round(n * 10) / 10
