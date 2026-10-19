// Links are official home pages or search links. Search links never go stale, which matters
// because exam-prep sites move their PDFs around often.
export const searchLink = (q) => `https://www.google.com/search?q=${encodeURIComponent(q)}`
export const videoLink = (q) => `https://www.youtube.com/results?search_query=${encodeURIComponent(q)}`
const g = searchLink, yt = videoLink

export const officialLinks = (noticeQuery) => [
  { name: 'RRB application portal', url: 'https://www.rrbapply.gov.in', note: 'Apply, admit card, scorecards, notices' },
  { name: 'Indian Railways', url: 'https://indianrailways.gov.in', note: 'Railway news, zones, organisation' },
  { name: 'RRB Chandigarh', url: 'https://www.rrbcdg.gov.in', note: 'Regional RRB site; all RRBs publish the same CEN notices' },
  { name: 'RRB Allahabad (Prayagraj)', url: 'https://www.rrbald.gov.in', note: 'Regional RRB site' },
  { name: 'RRB Mumbai', url: 'https://www.rrbmumbai.gov.in', note: 'Regional RRB site' },
  { name: 'RRB Chennai', url: 'https://www.rrbchennai.gov.in', note: 'Regional RRB site' },
  { name: 'Find the notification PDF', url: g(noticeQuery + ' notification pdf site:gov.in'), note: 'Search restricted to government domains' },
]

export const STUDY_SITES = [
  { subject: 'GA', name: 'NCERT textbooks (Class 6-10)', url: 'https://ncert.nic.in/textbook.php', note: 'Free official PDFs: science, history, geography, civics, economics' },
  { subject: 'GA', name: 'PIB (Press Information Bureau)', url: 'https://pib.gov.in', note: 'Primary source for government schemes and decisions' },
  { subject: 'GA', name: 'India Budget', url: 'https://www.indiabudget.gov.in', note: 'Union Budget and Economic Survey documents' },
  { subject: 'GA', name: 'Constitution of India', url: 'https://legislative.gov.in/constitution-of-india/', note: 'Full text, schedules, amendments' },
  { subject: 'GA', name: 'Know India portal', url: 'https://knowindia.india.gov.in', note: 'States, culture, symbols, history' },
  { subject: 'GA', name: 'ISRO', url: 'https://www.isro.gov.in', note: 'Missions and launch vehicles' },
  { subject: 'GA', name: 'RBI', url: 'https://www.rbi.org.in', note: 'Banking basics, monetary policy' },
  { subject: 'GA', name: 'GKToday', url: 'https://currentaffairs.gktoday.in', note: 'Daily current affairs and static GK' },
  { subject: 'GA', name: 'AffairsCloud', url: 'https://affairscloud.com', note: 'Current affairs by category' },
  { subject: 'All', name: 'Testbook', url: 'https://testbook.com', note: 'Mock tests, previous papers, free and paid' },
  { subject: 'All', name: 'Adda247', url: 'https://www.adda247.com', note: 'Mock tests, free PDFs, current affairs' },
  { subject: 'All', name: 'Oliveboard', url: 'https://www.oliveboard.in', note: 'Mock tests and analytics' },
  { subject: 'All', name: 'Jagran Josh', url: 'https://www.jagranjosh.com', note: 'Free quizzes, current affairs, papers' },
]

// q = search prefix such as "RRB NTPC". PYQ links are searches because papers are published by coaching sites, not by RRB.
export function buildResources({ q, notice, pyqSets, books, videos }) {
  return {
    OFFICIAL: officialLinks(notice),
    STUDY_SITES,
    BOOKS: books,
    VIDEOS: videos.map(([subject, query, note]) => ({ subject, q: query, note })),
    PYQ_SETS: pyqSets.map((s) => ({ ...s, links: s.links.map(([l, kind, query]) => [l, kind === 'v' ? yt(query) : g(query)]) })),
    TOPIC_PYQ: [['Maths', `${q} maths previous year questions chapter wise pdf`], ['Reasoning', `${q} reasoning previous year questions chapter wise pdf`],
      ['General Awareness', `${q} general awareness previous year questions chapter wise pdf`], ['Railway GK', `${q} railway related GK questions pdf`],
      ['General Science', `${q} general science previous year questions pdf`], ['Current affairs', `${q} current affairs previous year questions pdf`]],
    q,
  }
}

export default buildResources({
  q: 'RRB NTPC',
  notice: 'RRB NTPC CEN 06/2026 graduate',
  books: [
    { subject: 'Science', title: 'General Science for Indian Railways (Disha Publications, 631 pages, PDF, 80 MB)', use: 'Railway-exam General Science. Opens the shared Google Drive file', url: 'https://drive.google.com/file/d/1_93U5hcz6aVuITssTFGA6KtUm083Fq-M/view?usp=sharing' },
    { subject: 'All', title: 'A Comprehensive Guide for RRB NTPC (Adda247, 556 pages, PDF, 116 MB)', use: 'Full-syllabus guide. Opens the shared Google Drive file', url: 'https://drive.google.com/file/d/14Zjl1UgSrHdEXTeHKFpZaIp8z82F_ZVT/view?usp=sharing' },
    { subject: 'All', title: 'RRB NTPC Stage-1 Practice Workbook (Kiran, 339 pages, PDF, 8 MB)', use: 'Stage-1 practice sets. Opens the shared Google Drive file', url: 'https://drive.google.com/file/d/1k6MLQ9_pRClGHHs2oK7O0YwnW3bIUUHL/view?usp=sharing' },
    { subject: 'Maths', title: 'Rakesh Yadav / Kiran: Advanced Maths', use: 'Tricks plus volume of practice' },
    { subject: 'Maths', title: 'R.S. Aggarwal: Quantitative Aptitude', use: 'Concepts and graded exercises' },
    { subject: 'Maths', title: 'Fast Track Objective Arithmetic (Rajesh Verma)', use: 'Speed and shortcuts' },
    { subject: 'Reasoning', title: 'R.S. Aggarwal: Verbal and Non-Verbal Reasoning', use: 'Full coverage, many questions' },
    { subject: 'Reasoning', title: 'Kiran / Arihant Reasoning', use: 'Exam-pattern practice sets' },
    { subject: 'GA', title: 'Lucent General Knowledge', use: 'Static GK backbone' },
    { subject: 'GA', title: 'NCERT Science and Social Science, Classes 6-10', use: 'Base for the General Science and Geography questions' },
    { subject: 'GA', title: 'Indian Polity (Laxmikanth), short notes', use: 'Constitution and governance' },
    { subject: 'GA', title: 'Monthly current affairs magazine or PDF', use: 'Last 6-7 months' },
    { subject: 'PYQ', title: 'Kiran: RRB NTPC previous year papers (chapter-wise)', use: 'Topic-wise PYQs with solutions' },
  ],
  videos: [
    ['Maths', 'RRB NTPC maths full course', 'Pick one playlist and finish it'],
    ['Maths', 'speed maths calculation tricks squares cubes tables', 'Daily 20 minutes'],
    ['Reasoning', 'RRB NTPC reasoning full course', 'Pattern practice'],
    ['GA', 'RRB NTPC general awareness static GK complete', 'Revision-style lectures'],
    ['GA', 'monthly current affairs 2026 RRB NTPC', 'Monthly compilations'],
    ['GA', 'Indian railways GK complete zones trains projects', 'High-yield for this exam'],
    ['Strategy', 'RRB NTPC CBT 1 strategy 90 marks', 'Attempt and time strategy'],
  ],
  pyqSets: [
    { id: 'ntpc2019-c1', title: 'CEN 01/2019 NTPC: CBT 1 (all shifts)', note: 'Largest bank of shift papers (held Dec 2020 to Jul 2021)', links: [
      ['Papers (PDF)', 's', 'RRB NTPC CBT 1 2019 previous year question paper pdf all shifts'], ['With answer keys', 's', 'RRB NTPC CBT 1 2020 2021 answer key pdf shift wise'], ['Video solutions', 'v', 'RRB NTPC CBT 1 2020 2021 shift paper solution']] },
    { id: 'ntpc2019-c2', title: 'CEN 01/2019 NTPC: CBT 2', note: '120 questions: GA 50, Maths 35, Reasoning 35', links: [
      ['Papers (PDF)', 's', 'RRB NTPC CBT 2 previous year question paper pdf'], ['Video solutions', 'v', 'RRB NTPC CBT 2 question paper solution']] },
    { id: 'ntpc2024-g', title: 'CEN 05/2024 Graduate: CBT 1', note: 'Most recent graduate-level pattern', links: [
      ['Papers (PDF)', 's', 'RRB NTPC graduate CEN 05/2024 CBT 1 question paper pdf'], ['With answer keys', 's', 'RRB NTPC graduate CBT 1 2025 answer key pdf shift wise'], ['Video solutions', 'v', 'RRB NTPC graduate CBT 1 2025 paper analysis']] },
    { id: 'ntpc2024-ug', title: 'CEN 03/2024 Undergraduate: CBT 1', note: 'Same syllabus style, slightly easier', links: [
      ['Papers (PDF)', 's', 'RRB NTPC undergraduate CEN 03/2024 CBT 1 question paper pdf'], ['Video solutions', 'v', 'RRB NTPC undergraduate CBT 1 2025 paper analysis']] },
    { id: 'rrb-sample', title: 'Official RRB mock and sample papers', note: 'Try the real CBT interface', links: [['RRB mock test search', 's', 'RRB NTPC official mock test practice CBT interface rrbapply.gov.in']] },
    { id: 'related', title: 'Related exams (same level)', note: 'Extra practice once you run out of NTPC papers', links: [
      ['RRB Group D CBT papers', 's', 'RRB Group D previous year question paper pdf'], ['RRB ALP / JE CBT 1 papers', 's', 'RRB ALP CBT 1 previous year question paper pdf'], ['SSC CGL Tier 1 papers', 's', 'SSC CGL tier 1 previous year question paper pdf']] },
  ],
})
