import plan from './plan.js'
import { SYLLABUS } from './syllabus.js'
import { NOTES } from './notes.js'
import { TRICKS } from './tricks.js'
import { QUIZ } from './quiz.js'
import resources from './resources.js'
import { GRAD_PATTERN, SECTIONS_NTPC } from '../RRB_Graduate/index.js'

const pattern = [
  { ...GRAD_PATTERN[0], title: '1st stage CBT (undergraduate posts)' },
  GRAD_PATTERN[1],
  GRAD_PATTERN[2],
  { title: 'Selection flow',
    rows: [['Step', 'What happens'], ['1st stage CBT', '100 Q, 90 min. Screening. The normalised score shortlists for the 2nd stage'], ['2nd stage CBT', '120 Q, 90 min. Shortlist is a multiple of the vacancies, in order of 1st stage merit'],
      ['Typing skill test', 'For Accounts Clerk cum Typist and Junior Clerk cum Typist. Past notices set English 30 wpm and Hindi 25 wpm; confirm in the current notice'], ['Document verification and medical', 'Based on merit and post preference']] },
  GRAD_PATTERN[4],
  { title: 'Before you rely on this', text: 'Pattern details above follow recent NTPC notifications. Read the current Undergraduate notification for posts, eligibility (Class 12 pass), age limits and the exact shortlisting ratio.' },
]

export default {
  id: 'undergraduate', folder: 'RRB_UnderGraduate', name: 'NTPC Undergraduate', brand: 'RRB NTPC · Undergraduate', notice: 'Check the current CEN',
  sections: SECTIONS_NTPC, total: { q: 100, minutes: 90 }, pattern, stationFocus: null,
  plan, syllabus: SYLLABUS, notes: NOTES, tricks: TRICKS, quiz: QUIZ, resources,
}
