import plan from './plan.js'
import { SYLLABUS } from './syllabus.js'
import { NOTES } from './notes.js'
import { TRICKS } from './tricks.js'
import { QUIZ } from './quiz.js'
import resources from './resources.js'
import ownLessons from './lessons/index.js'
import graduateLessons from '../RRB_Graduate/lessons/index.js'
import ownDrills from './lessons/drills.js'
import graduateDrills from '../RRB_Graduate/drills.js'

const pattern = [
  { title: 'CBT (Level 1 posts)', note: '90 minutes (120 for PwBD candidates eligible for a scribe). Each question carries 1 mark; 1/3 mark off for each wrong answer. Based on recent Group D notifications: confirm in the current one.',
    rows: [['Section', 'Questions', 'Marks'], ['General Science', '25', '25'], ['Mathematics', '25', '25'], ['General Intelligence and Reasoning', '30', '30'], ['General Awareness and Current Affairs', '20', '20'], ['Total', '100', '100']] },
  { title: 'Qualifying marks', note: 'Minimum percentage in the CBT, as in recent notices.',
    rows: [['Category', 'Minimum qualifying marks'], ['UR', '40%'], ['EWS', '40%'], ['OBC (non-creamy layer)', '30%'], ['SC', '30%'], ['ST', '25%']] },
  { title: 'Physical Efficiency Test (PET)', note: 'Qualifying in nature. Standards in recent notices; check the current one.',
    rows: [['Task', 'Male', 'Female'], ['Lift and carry weight over 100 m, in 2 minutes', '25 kg', '20 kg'], ['Run 1,000 m', '4 min 15 s', '5 min 40 s']] },
  { title: 'Selection flow',
    rows: [['Step', 'What happens'], ['CBT', '100 Q, 90 min. Merit list for the PET'], ['PET', 'Qualifying physical test'], ['Document verification', 'Originals checked'], ['Medical examination', 'Fitness standard for the post']] },
  { title: 'Eligibility', text: 'Recent notices asked for Class 10 pass, ITI or NCVT certificate. Confirm age limits and qualifications in the current notification.' },
]

export default {
  id: 'groupd', folder: 'RRB_GroupD', name: 'Group D', brand: 'RRB Group D · Level 1', notice: 'Check the current CEN',
  sections: [
    { key: 'sci', label: 'Science', full: 'General Science', q: 25, minutes: 20, target: 23, color: 'sci' },
    { key: 'maths', label: 'Maths', full: 'Mathematics', q: 25, minutes: 25, target: 22, color: 'maths' },
    { key: 'reas', label: 'Reasoning', full: 'General Intelligence and Reasoning', q: 30, minutes: 25, target: 27, color: 'reas' },
    { key: 'ga', label: 'GA', full: 'General Awareness and Current Affairs', q: 20, minutes: 10, target: 18, color: 'ga' },
  ],
  total: { q: 100, minutes: 90 }, pattern,
  stationFocus: [
    'Take your baseline mock. Any score counts.', 'Motion, force, number system, percentages.', 'Light, electricity, interest, time and work.', 'Chemistry basics, speed and distance, algebra.',
    'Carbon, periodic table, mensuration, geometry.', 'Biology, trigonometry, and your first timed mock.', 'Timed sets and previous-year questions.', 'Full previous-year papers, one a day.',
    'More papers. Fix recurring weak topics.', 'A mock every day. Analyse each one.', 'Raise accuracy. Skip what you cannot narrow down.', 'Cut silly mistakes. Every wrong costs 1.33 marks.',
    'Final week. Score 90, and keep up your PET practice.',
  ],
  plan, syllabus: SYLLABUS, notes: NOTES, tricks: TRICKS, quiz: QUIZ, resources,
  lessons: ownLessons + '\n' + graduateLessons,
  drills: ownDrills + '\n' + graduateDrills,
}
