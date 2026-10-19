// Parses the lesson text files (## Topic :: Sub-topic, paragraphs, "- point", "Q:" and "A:") and finds a lesson
// for a topic and sub-topic. If the exact topic is missing, a lesson with the same sub-topic name is used.
export const norm = (s) => s.toLowerCase().replace(/\([^)]*\)/g, '').replace(/[^a-z0-9 ]+/g, ' ').replace(/\s+/g, ' ').trim()

export function parseLessons(text) {
  const byKey = new Map(), bySub = new Map()
  text.split(/^## /m).slice(1).forEach((block) => {
    const lines = block.split('\n')
    const [topic, sub] = lines[0].split('::').map((x) => x.trim())
    const body = [], points = []
    let q = '', a = '', alias = ''
    lines.slice(1).forEach((l) => {
      const t = l.trim()
      if (!t) return
      if (t.startsWith('=> ')) alias = t.slice(3).trim()
      else if (t.startsWith('- ')) points.push(t.slice(2))
      else if (t.startsWith('Q:')) q = t.slice(2).trim()
      else if (t.startsWith('A:')) a = t.slice(2).trim()
      else body.push(t)
    })
    const lesson = { topic, sub, body, points, q, a, alias }
    byKey.set(norm(topic) + '::' + norm(sub), lesson)
    if (!bySub.has(norm(sub))) bySub.set(norm(sub), lesson)
  })
  return { byKey, bySub }
}

// An alias line ("=> Other topic :: Other sub-topic") points one sub-topic at another's lesson.
export function findLesson(db, topic, sub) {
  let l = db.byKey.get(norm(topic) + '::' + norm(sub)) || db.bySub.get(norm(sub)) || null
  for (let i = 0; l && l.alias && i < 3; i++) {
    const [t, s] = l.alias.split('::').map((x) => x.trim())
    l = db.byKey.get(norm(t) + '::' + norm(s)) || null
  }
  return l && !l.alias ? l : null
}

// Revision days list whole topics as their sub-topics; this returns the lesson for every sub-topic of that topic.
export function topicLessons(db, topicName, subtopics) {
  const subs = (subtopics?.[topicName] || '').split(';').map((x) => x.trim()).filter(Boolean)
  return subs.map((title) => ({ title, lesson: findLesson(db, topicName, title) })).filter((x) => x.lesson)
}

// Extra drill questions per topic. Lines: "## Topic", "Q: question | A: answer"; "## Topic => Other topic" reuses another topic's set.
export function parseDrills(text) {
  const map = new Map(), alias = new Map()
  text.split(/^## /m).slice(1).forEach((block) => {
    const lines = block.split('\n')
    const head = lines[0].trim()
    if (head.includes('=>')) { const [a, b] = head.split('=>'); alias.set(norm(a), norm(b)); return }
    const qs = []
    lines.slice(1).forEach((l) => {
      const m = l.trim().match(/^Q:\s*(.+?)\s*\|\s*A:\s*(.+)$/)
      if (m) qs.push({ q: m[1], a: m[2] })
    })
    map.set(norm(head), qs)
  })
  return { map, alias }
}

export function drillsFor(db, topic) {
  const k = norm(topic)
  return db.map.get(k) || db.map.get(db.alias.get(k)) || []
}
