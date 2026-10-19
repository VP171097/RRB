// Turns an exam's study plan spec into 91 days of tasks and a topic list.
// The spec lives in each exam folder (RRB_*/plan.js). Task order inside a day is stable,
// because ticks are stored as "<day>.<task index>".
export const TOTAL = 91
export const PHASES = [{ n: 1, name: 'Foundation', from: 1, to: 35 }, { n: 2, name: 'Practice', from: 36, to: 63 }, { n: 3, name: 'Mocks', from: 64, to: 91 }]
export const phaseOf = (n) => (n <= 35 ? PHASES[0] : n <= 63 ? PHASES[1] : PHASES[2])
export const COLS = ['Learn', 'Practice', 'Rev 1', 'Rev 2', 'Rev 3']
export const CAUSES = ['Concept gap', 'Calculation slip', 'Silly mistake', 'Did not know', 'Ran out of time']
export const G_MOCK = 'Mock and analysis'
export const G_REV = 'Revision and habits'

const clean = (x) => x.replace(/^\*/, '')
const isTopic = (x) => x.charAt(0) !== '*'

export function buildPlan(spec) {
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
  let mock = 0

  for (let n = 1; n <= TOTAL; n++) {
    const w = Math.floor((n - 1) / 7) + 1, d = ((n - 1) % 7) + 1
    const t = []
    const add = (g, l, time, sub, extra) => t.push({ g, l, t: time, ...(sub ? { subs: sub.split(';').map((x) => x.trim()) } : {}), ...(extra || {}) })
    let sum = ''
    if (w <= 5) {
      if (d <= 6) {
        const i = (w - 1) * 6 + (d - 1)
        subs.forEach((s) => {
          const raw = s.list1[i]
          // Practice and revision days list the week's topics as their checklist.
          const week = s.list1.slice((w - 1) * 6, w * 6).filter(isTopic).join(';')
          add(s.label, clean(raw), s.h, isTopic(raw) ? spec.subtopics?.[raw] : (week || undefined))
        })
        sum = subs.map((s) => clean(s.list1[i])).join(' · ')
      } else if (w === 1) {
        mock++
        add(G_MOCK, `Baseline mock #${mock} (full 90 min). Score does not matter, record it`, '1.5 h')
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
    } else if (w <= 7) {
      if (d <= 6) {
        subs.forEach((s) => {
          const base = (w === 6 ? s.p6 : s.p7)[d - 1]
          const note = w === 6 && !/^Sectional/.test(base) && s.kind !== 'skill' ? (s.kind === 'knowledge' ? ' (revise, then an MCQ set)' : ' (timed sets, then review)') : ''
          add(s.label, base + note, s.h)
        })
        add(ga.label, "Current affairs: today's news + last week's notes", '30 min')
        sum = subs.map((s) => (w === 6 ? s.p6 : s.p7)[d - 1]).join(' · ')
      } else {
        mock++; sum = 'Mock #' + mock
        add(G_MOCK, `Full mock #${mock} (90 min, timed sections)`, '1.5 h')
        add(G_MOCK, 'Analyse mock; log every error with cause', '2 h')
        add(G_REV, 'Revise error log + weak topics', '1 h')
        add(ga.label, 'Current affairs weekly recap', '30 min')
      }
    } else if (w <= 9) {
      const p = (w - 8) * 6 + d
      if (d <= 6) {
        add(G_MOCK, `Previous-year paper #${p} (one full shift, 90 min)`, '1.5 h')
        add(G_MOCK, 'Analyse paper; log errors', '1.5 h')
        subs.forEach((s) => {
          const topic = rot(s, p - 1)
          add(s.label, drill(s, topic), s.kind === 'quant' ? '1 h' : '45 min', spec.subtopics?.[topic], { topic, drill: true })
        })
        sum = 'PYQ paper #' + p
      } else {
        mock++; sum = 'Mock #' + mock
        add(G_MOCK, `Full mock #${mock} (90 min)`, '1.5 h')
        add(G_MOCK, 'Analyse mock; log every error with cause', '2 h')
        add(G_REV, 'Revise error log + weak topics', '1 h')
        add(ga.label, 'Current affairs weekly recap', '30 min')
      }
    } else if (n <= 84) {
      mock++; sum = 'Mock #' + mock
      add(G_MOCK, `Full mock #${mock} (90 min, exam timing)`, '1.5 h')
      add(G_MOCK, 'Analyse mock: every wrong, skipped and lucky-guess question', '2 h')
      if (d < 7) {
        subs.forEach((s) => {
          const topic = rot(s, n - 64)
          const label = s.kind === 'quant' ? `20 Q drill on ${topic} (swap in your weakest topic from the error log)` : s.kind === 'logic' ? `15 Q drill on ${topic}` : s.kind === 'skill' ? `typing practice: ${topic}` : `recall notes on ${topic}${s === ga ? ', then current affairs' : ''}`
          add(s.label, label, '40 min', spec.subtopics?.[topic], { topic, drill: true })
        })
        add(quant.label, 'Formulas + calculation speed', '20 min')
      } else add(G_REV, 'Light revision only; rest in the evening', '1 h')
    } else if (d <= 4) {
      mock++; sum = 'Mock #' + mock
      add(G_MOCK, `Full mock #${mock} (90 min)`, '1.5 h')
      add(G_MOCK, 'Analyse mock; fix only what you can fix quickly', '1.5 h')
      add(ga.label, 'Recall: notes + current affairs', '1 h')
    } else if (d === 5) {
      sum = 'Final revision'
      add(quant.label, 'Revise formula sheet + calculation tables', '1.5 h')
      add(G_REV, 'Revise error log (all entries)', '1.5 h')
      add(ga.label, 'Revise current affairs notes + GA one-liners', '1.5 h')
    } else if (d === 6) {
      sum = 'Light revision'
      add(ga.label, 'Skim GA tables (zones, schedules, vitamins, days)', '1 h')
      add(subs.find((s) => s.kind === 'logic')?.label || ga.label, 'Light reasoning set to stay warm (20 Q)', '30 min')
      add(G_REV, 'Check admit card, centre location, ID, travel plan', '30 min')
    } else {
      sum = 'Rest day'
      add(G_REV, 'Rest. Sleep early; no new topics, no mock', 'all day')
      add(G_REV, 'Pack ID, admit card, pen if allowed; plan the route', '20 min')
    }
    days.push({ n, w, d, ph: phaseOf(n), tasks: t, sum })
  }

  const topics = []
  subs.forEach((s) => s.list1.forEach((name, i) => {
    if (isTopic(name)) topics.push({ k: s.code + i, sub: s.label, name, day: Math.floor(i / 6) * 7 + (i % 6) + 1 })
  }))
  const groups = [...subs.map((s) => s.label), G_MOCK, G_REV]
  const colorOf = { ...Object.fromEntries(subs.map((s) => [s.label, s.color])), [G_MOCK]: 'mock', [G_REV]: 'rev' }
  return { DAYS: days, TOPICS: topics, SUBS: subs.map((s) => s.label), SUBJECTS: subs, GROUPS: groups, colorOf, TOTAL, PHASES, COLS, CAUSES }
}

export function groupTasks(day, groups) {
  const map = {}
  day.tasks.forEach((t, i) => { (map[t.g] ||= []).push({ i, t: t.t, label: t.l, subs: t.subs }) })
  return groups.filter((g) => map[g]).map((g) => ({ name: g, items: map[g] }))
}
