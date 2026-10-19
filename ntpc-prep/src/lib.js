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

// Group a day's tasks under a subject so the plan reads "Maths > Percentage I".
export const GROUPS = ['Maths', 'Reasoning', 'GA', 'Mock and analysis', 'Revision and habits']
export function subjectOf(label) {
  if (/^Maths:/.test(label)) return 'Maths'
  if (/^Reasoning:/.test(label)) return 'Reasoning'
  if (/^GA:/.test(label)) return 'GA'
  if (/^Rest\b|Recall yesterday|Revise the week|Revise error log|error log \(all|Check admit/i.test(label)) return 'Revision and habits'
  if (/mock|paper|test|Analyse/i.test(label)) return 'Mock and analysis'
  if (/Speed drill|calculation (speed|tables)|formula sheet/i.test(label)) return 'Maths'
  if (/reasoning set/i.test(label)) return 'Reasoning'
  if (/current affairs|GA tables|GA one-liners/i.test(label)) return 'GA'
  return 'Revision and habits'
}
export function groupTasks(tasks) {
  const map = {}
  tasks.forEach((t, i) => {
    const g = subjectOf(t.l)
    ;(map[g] ||= []).push({ i, t: t.t, label: t.l.replace(/^(Maths|Reasoning|GA):\s*/, '') })
  })
  return GROUPS.filter((g) => map[g]).map((g) => ({ name: g, items: map[g] }))
}
