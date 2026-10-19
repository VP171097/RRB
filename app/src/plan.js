// Turns an exam's study plan spec into a plan of any length (start date to exam date) and a topic list.
// The spec lives in each exam folder (RRB_*/plan.js). Task order inside a day is stable,
// because ticks are stored as "<day>.<task index>". The day count and the daily hours come from the user's settings:
// the plan is split 5/12 foundation, 1/6 practice, 1/6 previous-year papers and 1/4 mocks, then a final week.
// With 91 days and 7 hours a day this is the original 13-week plan.
export const MIN_DAYS = 14, MAX_DAYS = 366, BASE_HOURS = 7
export const DEFAULT_DAYS = 91
export const planDays = (startIso, endIso) => {
  const a = startIso.split('-'), b = (endIso || '').split('-')
  if (!endIso || b.length !== 3) return DEFAULT_DAYS
  const n = Math.round((Date.UTC(+b[0], +b[1] - 1, +b[2]) - Date.UTC(+a[0], +a[1] - 1, +a[2])) / 864e5) + 1
  return Math.max(MIN_DAYS, Math.min(MAX_DAYS, n))
}
export const COLS = ['Learn', 'Practice', 'Rev 1', 'Rev 2', 'Rev 3']
export const CAUSES = ['Concept gap', 'Calculation slip', 'Silly mistake', 'Did not know', 'Ran out of time']
export const G_MOCK = 'Mock and analysis'
export const G_REV = 'Revision and habits'

const clean = (x) => x.replace(/^\*/, '')
const isTopic = (x) => x.charAt(0) !== '*'

// Task times are "1.5 h", "20 min" or "all day". They scale with the daily hours; full mocks and papers keep their exam time.
const toMin = (t) => { const h = t.match(/^([\d.]+) h$/), m = t.match(/^(\d+) min$/); return h ? Math.round(+h[1] * 60) : m ? +m[1] : null }
const fmtMin = (m) => (m < 60 ? `${m} min` : `${Math.round(m / 15) / 4} h`.replace(/^(\d+)\.0 h$/, '$1 h'))
const FIXED = /^(Full mock|Baseline mock|Previous-year paper|Weekly test)/
const scaleTime = (t, label, f) => {
  const m = toMin(t)
  if (m == null || FIXED.test(label) || f === 1) return t
  return fmtMin(Math.max(10, Math.round((m * f) / 5) * 5))
}
const uniq = (list) => Array.from(new Set(list))

export function buildPlan(spec, opts = {}) {
  const TOTAL = Math.max(MIN_DAYS, Math.min(MAX_DAYS, Math.round(opts.total || DEFAULT_DAYS)))
  const hours = Math.max(1, Math.min(16, +opts.hours || BASE_HOURS))
  const f = hours / BASE_HOURS
  const finalLen = TOTAL >= 21 ? 7 : 3
  const R = TOTAL - finalLen
  const F = Math.round((R * 5) / 12), P = Math.round(R / 6), Y = Math.round(R / 6)
  const pEnd = F + P, yEnd = F + P + Y, mEnd = R
  const PHASES = [{ n: 1, name: 'Foundation', from: 1, to: F }, { n: 2, name: 'Practice', from: F + 1, to: yEnd }, { n: 3, name: 'Mocks', from: yEnd + 1, to: TOTAL }]
  const phaseOf = (n) => (n <= F ? PHASES[0] : n <= yEnd ? PHASES[1] : PHASES[2])
  const studyDays = F - Math.floor(F / 7)
  const dayOfStudy = (i) => i + Math.floor(i / 6) + 1
  const topicDay = {}
  const subs = spec.subjects
  const quant = subs.find((s) => s.kind === 'quant') || subs[0]
  const ga = subs.find((s) => s.key === 'ga') || subs[subs.length - 1]
  const pools = Object.fromEntries(subs.map((s) => [s.key, s.list1.filter(isTopic)]))
  const rot = (s, k) => pools[s.key][((k % pools[s.key].length) + pools[s.key].length) % pools[s.key].length]
  const drill = (s, topic) => (s.kind === 'quant'
    ? `weak-topic drill, 25 Q on ${topic} (swap in your weakest topic from the error log)`
    : s.kind === 'logic' ? `weak-topic drill, 20 Q on ${topic} (or your weakest)`
      : s.kind === 'skill' ? `${topic} (timed, note speed and accuracy)`
        : `revise notes on ${topic}, then 15 MCQs`)
  const days = []
  let mockCount = 0

  let studyIdx = 0, paper = 0
  for (let n = 1; n <= TOTAL; n++) {
    const w = Math.floor((n - 1) / 7) + 1, d = ((n - 1) % 7) + 1
    const t = []
    const add = (g, l, time, sub, extra) => t.push({ g, l, t: time, ...(sub ? { subs: sub.split(';').map((x) => x.trim()) } : {}), ...(extra || {}) })
    let sum = ''
    if (n <= F) {
      if (d <= 6) {
        const i = studyIdx++
        const parts = []
        subs.forEach((s) => {
          const L = s.list1.length
          const a = Math.floor((i * L) / studyDays), b = Math.max(a + 1, Math.floor(((i + 1) * L) / studyDays))
          const items = s.list1.slice(a, b)
          const tops = items.filter(isTopic)
          items.forEach((x, k) => { if (isTopic(x) && !((s.code + (a + k)) in topicDay)) topicDay[s.code + (a + k)] = n })
          let label, sub
          if (tops.length) {
            label = tops.map(clean).join(' + ')
            sub = uniq(tops.flatMap((x) => (spec.subtopics?.[x] || '').split(';').map((y) => y.trim()).filter(Boolean))).join(';') || undefined
          } else {
            // Practice and revision days list the week's topics as their checklist.
            const bs = Math.floor(a / 6) * 6
            label = clean(items[0])
            sub = s.list1.slice(bs, bs + 6).filter(isTopic).join(';') || undefined
          }
          parts.push(label)
          add(s.label, label, s.h, sub)
        })
        sum = parts.join(' · ')
      } else if (n === 7) {
        add(G_MOCK, `Baseline mock #${++mockCount} (full 90 min). Score does not matter, record it`, '1.5 h')
        add(G_MOCK, 'Analyse every wrong and skipped question; start the error log', '2 h')
        add(G_REV, "Revise the week: formulas + GA notes", '1 h')
        sum = 'Baseline mock + review'
      } else {
        add(G_MOCK, `Weekly test: 100 mixed questions from weeks 1-${w} (timed)`, '1.5 h')
        add(G_MOCK, 'Analyse test, update error log', '1.5 h')
        add(G_REV, "Revise the week's formulas + GA notes", '1 h')
        sum = 'Weekly test + review'
      }
      if (n <= 10) add(quant.label, 'Speed drill: tables to 30, squares to 30, cubes to 15', '20 min')
      if (d <= 6) add(G_REV, "Recall yesterday's topics from memory, then check notes", '20 min')
      add(ga.label, "Current affairs: today's news, write 5 one-liners", '30 min')
    } else if (n <= pEnd) {
      if (d <= 6) {
        const first = n <= F + Math.ceil(P / 2)
        subs.forEach((s) => {
          const base = (first ? s.p6 : s.p7)[d - 1]
          const note = first && !/^Sectional/.test(base) && s.kind !== 'skill' ? (s.kind === 'knowledge' ? ' (revise, then an MCQ set)' : ' (timed sets, then review)') : ''
          add(s.label, base + note, s.h)
        })
        add(ga.label, "Current affairs: today's news + last week's notes", '30 min')
        sum = subs.map((s) => (first ? s.p6 : s.p7)[d - 1]).join(' · ')
      } else {
        sum = 'Mock #' + (++mockCount)
        add(G_MOCK, `Full mock #${mockCount} (90 min, timed sections)`, '1.5 h')
        add(G_MOCK, 'Analyse mock; log every error with cause', '2 h')
        add(G_REV, 'Revise error log + weak topics', '1 h')
        add(ga.label, 'Current affairs weekly recap', '30 min')
      }
    } else if (n <= yEnd) {
      if (d <= 6) {
        const p = ++paper
        add(G_MOCK, `Previous-year paper #${p} (one full shift, 90 min)`, '1.5 h')
        add(G_MOCK, 'Analyse paper; log errors', '1.5 h')
        subs.forEach((s) => {
          const topic = rot(s, p - 1)
          add(s.label, drill(s, topic), s.kind === 'quant' ? '1 h' : '45 min', spec.subtopics?.[topic], { topic, drill: true })
        })
        sum = 'PYQ paper #' + p
      } else {
        sum = 'Mock #' + (++mockCount)
        add(G_MOCK, `Full mock #${mockCount} (90 min)`, '1.5 h')
        add(G_MOCK, 'Analyse mock; log every error with cause', '2 h')
        add(G_REV, 'Revise error log + weak topics', '1 h')
        add(ga.label, 'Current affairs weekly recap', '30 min')
      }
    } else if (n <= mEnd) {
      sum = 'Mock #' + (++mockCount)
      add(G_MOCK, `Full mock #${mockCount} (90 min, exam timing)`, '1.5 h')
      add(G_MOCK, 'Analyse mock: every wrong, skipped and lucky-guess question', '2 h')
      if (d < 7) {
        subs.forEach((s) => {
          const topic = rot(s, n - yEnd - 1)
          const label = s.kind === 'quant' ? `20 Q drill on ${topic} (swap in your weakest topic from the error log)` : s.kind === 'logic' ? `15 Q drill on ${topic}` : s.kind === 'skill' ? `typing practice: ${topic}` : `recall notes on ${topic}${s === ga ? ', then current affairs' : ''}`
          add(s.label, label, '40 min', spec.subtopics?.[topic], { topic, drill: true })
        })
        add(quant.label, 'Formulas + calculation speed', '20 min')
      } else add(G_REV, 'Light revision only; rest in the evening', '1 h')
    } else {
      const fd = n - mEnd, last = finalLen
      if (last === 7 ? fd <= 4 : false) {
        sum = 'Mock #' + (++mockCount)
        add(G_MOCK, `Full mock #${mockCount} (90 min)`, '1.5 h')
        add(G_MOCK, 'Analyse mock; fix only what you can fix quickly', '1.5 h')
        add(ga.label, 'Recall: notes + current affairs', '1 h')
      } else if (fd === last - 2) {
        sum = 'Final revision'
        add(quant.label, 'Revise formula sheet + calculation tables', '1.5 h')
        add(G_REV, 'Revise error log (all entries)', '1.5 h')
        add(ga.label, 'Revise current affairs notes + GA one-liners', '1.5 h')
      } else if (fd === last - 1) {
        sum = 'Light revision'
        add(ga.label, 'Skim GA tables (zones, schedules, vitamins, days)', '1 h')
        add(subs.find((s) => s.kind === 'logic')?.label || ga.label, 'Light reasoning set to stay warm (20 Q)', '30 min')
        add(G_REV, 'Check admit card, centre location, ID, travel plan', '30 min')
      } else {
        sum = 'Rest day'
        add(G_REV, 'Rest. Sleep early; no new topics, no mock', 'all day')
        add(G_REV, 'Pack ID, admit card, pen if allowed; plan the route', '20 min')
      }
    }
    t.forEach((x) => { x.t = scaleTime(x.t, x.l, f) })
    days.push({ n, w, d, ph: phaseOf(n), tasks: t, sum })
  }

  const topics = []
  subs.forEach((s) => s.list1.forEach((name, i) => {
    if (isTopic(name)) topics.push({ k: s.code + i, sub: s.label, name, day: topicDay[s.code + i] || 1 })
  }))
  const groups = [...subs.map((s) => s.label), G_MOCK, G_REV]
  const colorOf = { ...Object.fromEntries(subs.map((s) => [s.label, s.color])), [G_MOCK]: 'mock', [G_REV]: 'rev' }
  return { DAYS: days, TOPICS: topics, SUBS: subs.map((s) => s.label), SUBJECTS: subs, GROUPS: groups, colorOf, TOTAL, PHASES, COLS, CAUSES, HOURS: hours }
}

export function groupTasks(day, groups) {
  const map = {}
  day.tasks.forEach((t, i) => { (map[t.g] ||= []).push({ i, t: t.t, label: t.l, subs: t.subs }) })
  return groups.filter((g) => map[g]).map((g) => ({ name: g, items: map[g] }))
}
