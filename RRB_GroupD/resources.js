import { buildResources } from '../RRB_Graduate/resources.js'

export default buildResources({
  q: 'RRB Group D',
  notice: 'RRB Group D CEN 08/2024 Level 1',
  books: [
    { subject: 'Science', title: 'General Science for Indian Railways (Disha Publications, 631 pages, PDF, 80 MB)', use: 'Railway-exam General Science. Opens the shared Google Drive file', url: 'https://drive.google.com/file/d/1_93U5hcz6aVuITssTFGA6KtUm083Fq-M/view?usp=sharing' },
    { subject: 'Science', title: 'NCERT Science, Classes 9 and 10', use: 'The base for every Science question' },
    { subject: 'Science', title: 'Lucent General Science', use: 'Quick revision of Physics, Chemistry, Biology' },
    { subject: 'Maths', title: 'Kiran / Rakesh Yadav: Group D Maths', use: 'Arithmetic at Class 10 level' },
    { subject: 'Maths', title: 'R.S. Aggarwal: Quantitative Aptitude', use: 'Concepts and exercises' },
    { subject: 'Reasoning', title: 'R.S. Aggarwal: Verbal and Non-Verbal Reasoning', use: 'Pattern practice' },
    { subject: 'GA', title: 'Lucent General Knowledge', use: 'Static GK' },
    { subject: 'GA', title: 'Monthly current affairs magazine or PDF', use: 'Last 6 months' },
    { subject: 'PYQ', title: 'Kiran / Arihant: RRB Group D previous year papers', use: 'Shift-wise papers with solutions' },
  ],
  videos: [
    ['Science', 'RRB Group D general science full course class 10', 'Physics, Chemistry, Biology'],
    ['Maths', 'RRB Group D maths full course', 'Pick one playlist and finish it'],
    ['Maths', 'speed maths calculation tricks squares cubes tables', 'Daily 20 minutes'],
    ['Reasoning', 'RRB Group D reasoning full course', 'Pattern practice'],
    ['GA', 'RRB Group D general awareness current affairs', 'Revision-style lectures'],
    ['PET', 'RRB Group D PET physical efficiency test preparation', 'Lifting 25 kg and 1,000 m run'],
  ],
  pyqSets: [
    { id: 'gd2024', title: 'CEN 08/2024 Group D (Level 1): CBT', note: 'Most recent Group D pattern', links: [
      ['Papers (PDF)', 's', 'RRB Group D CEN 08/2024 CBT question paper pdf shift wise'], ['With answer keys', 's', 'RRB Group D 2025 answer key pdf shift wise'], ['Video solutions', 'v', 'RRB Group D 2025 paper analysis']] },
    { id: 'gd2018', title: 'CEN 02/2018 Group D: CBT (all shifts)', note: 'Large bank of shift papers (held 2018-19)', links: [
      ['Papers (PDF)', 's', 'RRB Group D CEN 02/2018 question paper pdf all shifts'], ['Video solutions', 'v', 'RRB Group D 2018 2019 shift paper solution']] },
    { id: 'gd-pet', title: 'Physical Efficiency Test (PET)', note: 'Practice the lift and the 1,000 m run', links: [['PET guidance', 's', 'RRB Group D PET standards lifting 25 kg 1000 m run'], ['Training videos', 'v', 'RRB Group D PET training plan']] },
    { id: 'rrb-sample', title: 'Official RRB mock and sample papers', note: 'Try the real CBT interface', links: [['RRB mock test search', 's', 'RRB Group D official mock test practice CBT interface rrbapply.gov.in']] },
    { id: 'related', title: 'Related exams (same level)', note: 'Extra practice', links: [['RRB ALP CBT 1 papers', 's', 'RRB ALP CBT 1 previous year question paper pdf'], ['SSC MTS papers', 's', 'SSC MTS previous year question paper pdf']] },
  ],
})
