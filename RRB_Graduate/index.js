import plan from './plan.js'
import { SYLLABUS } from './syllabus.js'
import { NOTES } from './notes.js'
import { TRICKS } from './tricks.js'
import { QUIZ } from './quiz.js'
import resources from './resources.js'
import lessons from './lessons/index.js'
import drills from './drills.js'

export const GRAD_PATTERN = [
  { title: '1st stage CBT (graduate posts)', note: '90 minutes (120 for PwBD candidates eligible for a scribe). Each question carries 1 mark. The section split is indicative, so a paper can vary slightly. Objective, multiple choice. 1/3 mark off for each wrong answer; unattempted questions score 0.',
    rows: [['Section', 'Questions', 'Marks'], ['General Awareness', '40', '40'], ['Mathematics', '30', '30'], ['General Intelligence and Reasoning', '30', '30'], ['Total', '100', '100']] },
  { title: '2nd stage CBT', note: 'Same subjects, same marking, same 1/3 penalty. 90 minutes.',
    rows: [['Section', 'Questions', 'Marks'], ['General Awareness', '50', '50'], ['Mathematics', '35', '35'], ['General Intelligence and Reasoning', '35', '35'], ['Total', '120', '120']] },
  { title: 'Qualifying marks', note: 'Relaxable by 2 marks for PwBD candidates if PwBD vacancies would otherwise go unfilled. Also applies to ex-servicemen and PwBD candidates as per their community.',
    rows: [['Category', 'Minimum qualifying marks'], ['UR', '40%'], ['EWS', '40%'], ['OBC (non-creamy layer)', '30%'], ['SC', '30%'], ['ST', '25%']] },
  { title: 'Selection flow',
    rows: [['Step', 'What happens'], ['1st stage CBT', '100 Q, 90 min. Screening. The normalised score shortlists for the 2nd stage'], ['2nd stage CBT', '120 Q, 90 min. Shortlist is 15 times the community-wise vacancies, in order of 1st stage merit. Railways may change this limit'], ['Post-specific tests', 'Some posts need a typing skill test or aptitude test. Check which applies to your post'], ['Document verification and medical', 'Based on 2nd stage normalised marks and post preference']] },
  { title: 'Normalisation', text: 'When a CBT runs in several shifts, marks are normalised across shifts before shortlisting. The 1st stage normalised score decides who reaches the 2nd stage. Candidates shortlisted under OBC, SC, ST, EWS, PwBD or ExSM reservation stay in those categories for later stages.' },
]

export const SECTIONS_NTPC = [
  { key: 'ga', label: 'GA', full: 'General Awareness', q: 40, minutes: 15, target: 36, color: 'ga' },
  { key: 'maths', label: 'Maths', full: 'Mathematics', q: 30, minutes: 35, target: 27, color: 'maths' },
  { key: 'reas', label: 'Reasoning', full: 'General Intelligence and Reasoning', q: 30, minutes: 30, target: 28, color: 'reas' },
]

export default {
  id: 'graduate', folder: 'RRB_Graduate', name: 'NTPC Graduate', brand: 'RRB NTPC · Graduate', notice: 'CEN 06/2026',
  sections: SECTIONS_NTPC, total: { q: 100, minutes: 90 },
  pattern: GRAD_PATTERN, stationFocus: null,
  plan, syllabus: SYLLABUS, notes: NOTES, tricks: TRICKS, quiz: QUIZ, resources, lessons, drills,
}
