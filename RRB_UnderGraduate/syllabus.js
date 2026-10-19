import { SYLLABUS as G, PRIORITY_ORDER } from '../RRB_Graduate/syllabus.js'
export { PRIORITY_ORDER }

// The three CBT sections carry the same headings as Graduate. The notification sets the standard at
// Class 12 level for these posts. The Typing block covers the post-specific skill test.
const TYPING = {
  subject: 'Typing Skill Test (post-specific)', label: 'Typing', code: 'T', qs: 0, minutes: 0, target: '30 wpm English / 25 wpm Hindi',
  note: 'Needed for Accounts Clerk cum Typist and Junior Clerk cum Typist. Past notices set 30 wpm in English or 25 wpm in Hindi. Confirm the speed, passage length and marking in the current notification.',
  groups: [
    { name: 'Keyboard fundamentals', priority: 'High', weight: 'n/a', subs: ['Posture and finger placement', 'Home, top, bottom and number rows', 'Shift, punctuation and symbols', 'Typing without looking at the keys'] },
    { name: 'English typing', priority: 'High', weight: 'n/a', subs: ['Common words and paragraphs', 'Reaching 30 wpm at 95% or better accuracy', 'Capitalisation, punctuation, numbers', 'Official letter and notice formats'] },
    { name: 'Hindi typing (Inscript)', priority: 'Medium', weight: 'n/a', subs: ['Inscript layout: vowels left, consonants right', 'Matras and conjuncts', 'Reaching 25 wpm at 95% or better accuracy'] },
    { name: 'Test technique', priority: 'High', weight: 'n/a', subs: ['Gross and net speed, and how errors are counted', 'Handling backspace and corrections as the test allows', 'Stamina on 10-minute passages', 'Proofreading in the last 15 seconds'] },
  ],
}

export const SYLLABUS = [
  ...G.map((s) => ({ ...s, note: s.note + ' For Undergraduate posts the questions sit at Class 12 standard or below.' })),
  TYPING,
]
