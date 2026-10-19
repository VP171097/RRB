// Translates the study-plan strings built by plan.js (task labels, day summaries) at render time.
// plan.js keeps returning English; the dynamic ones ("Full mock #3 (90 min)") are matched against
// templates that also exist as keys in the Hindi dictionary, e.g. t('Full mock #{n} (90 min)', { n }).
const TEMPLATES = [
  'Baseline mock #{n} (full 90 min). Score does not matter, record it',
  'Weekly test: 100 mixed questions from weeks 1-{n} (timed)',
  'weak-topic drill, 25 Q on {topic} (swap in your weakest topic from the error log)',
  'weak-topic drill, 20 Q on {topic} (or your weakest)',
  '{topic} (timed, note speed and accuracy)',
  'revise notes on {topic}, then 15 MCQs',
  '{topic} (revise, then an MCQ set)',
  '{topic} (timed sets, then review)',
  'Previous-year paper #{n} (one full shift, 90 min)',
  'Full mock #{n} (90 min, timed sections)',
  'Full mock #{n} (90 min, exam timing)',
  'Full mock #{n} (90 min)',
  '20 Q drill on {topic} (swap in your weakest topic from the error log)',
  '15 Q drill on {topic}',
  'typing practice: {topic}',
  'recall notes on {topic}, then current affairs',
  'recall notes on {topic}',
  'Mock #{n}',
  'PYQ paper #{n}',
].map((tpl) => {
  const names = []
  const src = tpl.replace(/[.*+?^$()|[\]\\]/g, '\\$&').replace(/\{(\w+)\}/g, (_, k) => { names.push(k); return k === 'n' ? '(\\d+)' : '(.+?)' })
  return { tpl, names, re: new RegExp('^' + src + '$') }
})

export function planT(t, s) {
  if (typeof s !== 'string' || !s) return s
  const exact = t.exact?.(s)
  if (exact != null) return exact
  for (const { tpl, names, re } of TEMPLATES) {
    const m = s.match(re)
    if (m) {
      const v = {}
      names.forEach((k, i) => { v[k] = k === 'n' ? m[i + 1] : planT(t, m[i + 1]) })
      return t(tpl, v)
    }
  }
  if (s.includes(' · ')) return s.split(' · ').map((p) => planT(t, p)).join(' · ')
  return t(s)
}
