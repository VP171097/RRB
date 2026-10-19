import { SYLLABUS as G, PRIORITY_ORDER } from '../RRB_Graduate/syllabus.js'

// Same section headings as Graduate. The notification sets the standard at Class 12 level for these posts.
export const SYLLABUS = G.map((s) => ({ ...s, note: s.note + ' For Undergraduate posts the questions sit at Class 12 standard or below.' }))
export { PRIORITY_ORDER }
