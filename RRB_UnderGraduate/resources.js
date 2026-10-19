import { buildResources } from '../RRB_Graduate/resources.js'

export default buildResources({
  q: 'RRB NTPC undergraduate',
  notice: 'RRB NTPC CEN 03/2024 undergraduate',
  books: [
    { subject: 'Maths', title: 'Rakesh Yadav / Kiran: Advanced Maths', use: 'Tricks plus volume of practice' },
    { subject: 'Maths', title: 'R.S. Aggarwal: Quantitative Aptitude', use: 'Concepts and graded exercises' },
    { subject: 'Reasoning', title: 'R.S. Aggarwal: Verbal and Non-Verbal Reasoning', use: 'Full coverage, many questions' },
    { subject: 'GA', title: 'Lucent General Knowledge', use: 'Static GK backbone' },
    { subject: 'GA', title: 'NCERT Science and Social Science, Classes 6-10', use: 'Base for science, history and geography' },
    { subject: 'GA', title: 'Monthly current affairs magazine or PDF', use: 'Last 6-7 months' },
    { subject: 'PYQ', title: 'Kiran: RRB NTPC 12th level previous year papers', use: 'Topic-wise PYQs with solutions' },
    { subject: 'Typing', title: 'Typing tutor (English and Hindi)', use: 'Needed for clerk-cum-typist posts' },
  ],
  videos: [
    ['Maths', 'RRB NTPC 12th level maths full course', 'Pick one playlist and finish it'],
    ['Maths', 'speed maths calculation tricks squares cubes tables', 'Daily 20 minutes'],
    ['Reasoning', 'RRB NTPC reasoning full course', 'Pattern practice'],
    ['GA', 'RRB NTPC 12th level general awareness static GK', 'Revision-style lectures'],
    ['GA', 'monthly current affairs 2026 RRB NTPC', 'Monthly compilations'],
    ['Typing', 'typing skill test English Hindi RRB NTPC practice', 'For typist posts'],
  ],
  pyqSets: [
    { id: 'ug2024', title: 'CEN 03/2024 Undergraduate: CBT 1', note: 'Most recent undergraduate pattern', links: [
      ['Papers (PDF)', 's', 'RRB NTPC undergraduate CEN 03/2024 CBT 1 question paper pdf'], ['With answer keys', 's', 'RRB NTPC undergraduate CBT 1 2025 answer key pdf shift wise'], ['Video solutions', 'v', 'RRB NTPC undergraduate CBT 1 2025 paper analysis']] },
    { id: 'ug2019', title: 'CEN 01/2019 NTPC: CBT 1 and CBT 2', note: 'Older, shared papers: usable for undergraduate posts too', links: [
      ['CBT 1 papers', 's', 'RRB NTPC CBT 1 2019 previous year question paper pdf all shifts'], ['CBT 2 papers', 's', 'RRB NTPC CBT 2 previous year question paper pdf'], ['Video solutions', 'v', 'RRB NTPC CBT 1 2020 2021 shift paper solution']] },
    { id: 'ug-typing', title: 'Typing skill test practice', note: 'For Accounts Clerk cum Typist and Junior Clerk cum Typist', links: [['Typing test practice', 's', 'RRB NTPC typing skill test practice English Hindi']] },
    { id: 'rrb-sample', title: 'Official RRB mock and sample papers', note: 'Try the real CBT interface', links: [['RRB mock test search', 's', 'RRB NTPC official mock test practice CBT interface rrbapply.gov.in']] },
    { id: 'related', title: 'Related exams (same level)', note: 'Extra practice', links: [['RRB Group D CBT papers', 's', 'RRB Group D previous year question paper pdf'], ['SSC CHSL Tier 1 papers', 's', 'SSC CHSL tier 1 previous year question paper pdf']] },
  ],
})
