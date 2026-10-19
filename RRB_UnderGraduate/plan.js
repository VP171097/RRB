// Study-plan spec for NTPC Undergraduate: the Graduate Maths, Reasoning and GA lists plus a daily
// Typing track for the typing skill test (clerk-cum-typist posts). Entries starting with * are
// practice or revision days, not topics.
import graduate from '../RRB_Graduate/plan.js'

const T1 = [
  'Posture, finger placement and home row', 'Top row keys', 'Bottom row keys', 'Number row without looking', 'Shift, capitals and punctuation', '*Accuracy check: 5-minute drill',
  'Common English words', 'English: build to 15 wpm', 'English accuracy drills', 'Hindi Inscript layout: basics', 'Hindi: home row and matras', '*Typing test: 5 minutes',
  'English paragraphs: 20 wpm', 'Hindi paragraphs: 15 wpm', 'Capitalisation and punctuation drills', 'Proofreading while typing', 'Numbers and symbols in text', '*Typing test: 5 minutes',
  'English: 25 wpm target', 'Hindi: 20 wpm target', 'Official letter and notice format', 'Hindi conjuncts and special characters', 'Error-free runs', '*Typing test: 10 minutes',
  'English: 30 wpm target', 'Hindi: 25 wpm target', 'Mixed passages', 'Long passages: stamina', '*Speed and accuracy review', '*Full mock typing test',
]

export default {
  subjects: [
    ...graduate.subjects,
    { key: 'typing', label: 'Typing', code: 'T', color: 'typ', kind: 'skill', h: '30 min', list1: T1,
      p6: ['English passage, 5 min', 'Hindi passage, 5 min', 'Accuracy run: no errors', 'Speed run: push 2 wpm', 'Mixed passage, 10 min', 'Typing test: 10 minutes'],
      p7: ['English passage, 10 min', 'Hindi passage, 10 min', 'Accuracy run: no errors', 'Speed run: push 2 wpm', 'Mixed passage, 10 min', 'Typing test: 10 minutes'] },
  ],
}
