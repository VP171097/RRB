export const pad = (n) => (n < 10 ? '0' + n : '' + n)
export const iso = (d) => d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate())
export const parse = (s) => { const a = s.split('-'); return new Date(+a[0], +a[1] - 1, +a[2]) }
export const addDays = (d, n) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n)
export const fmt = (d) => d.toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short' })
export const pct = (a, b) => (b ? Math.round((a * 100) / b) : 0)
export const todayIso = () => iso(new Date())
export const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6)
export const mockTotal = (m) => (+m.ga || 0) + (+m.maths || 0) + (+m.reas || 0)
export const round1 = (n) => Math.round(n * 10) / 10
