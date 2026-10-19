// Links are either official home pages or search links. Search links never go
// stale, which matters because exam-prep sites move their PDFs around often.
const g = (q) => `https://www.google.com/search?q=${encodeURIComponent(q)}`
const yt = (q) => `https://www.youtube.com/results?search_query=${encodeURIComponent(q)}`
export const searchLink = g
export const videoLink = yt

export const OFFICIAL = [
  { name: 'RRB application portal', url: 'https://www.rrbapply.gov.in', note: 'Apply, admit card, scorecards, notices' },
  { name: 'Indian Railways', url: 'https://indianrailways.gov.in', note: 'Railway news, zones, organisation' },
  { name: 'RRB Chandigarh', url: 'https://www.rrbcdg.gov.in', note: 'Regional RRB site; all RRBs publish the same CEN notices' },
  { name: 'RRB Allahabad (Prayagraj)', url: 'https://www.rrbald.gov.in', note: 'Regional RRB site' },
  { name: 'RRB Mumbai', url: 'https://www.rrbmumbai.gov.in', note: 'Regional RRB site' },
  { name: 'RRB Chennai', url: 'https://www.rrbchennai.gov.in', note: 'Regional RRB site' },
  { name: 'Find the notification PDF', url: g('RRB NTPC CEN 06/2026 graduate notification pdf site:gov.in'), note: 'Search restricted to government domains' },
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

export const BOOKS = [
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
]

export const VIDEOS = [
  { subject: 'Maths', q: 'RRB NTPC maths full course', note: 'Pick one playlist and finish it' },
  { subject: 'Maths', q: 'speed maths calculation tricks squares cubes tables', note: 'Daily 20 minutes' },
  { subject: 'Reasoning', q: 'RRB NTPC reasoning full course', note: 'Pattern practice' },
  { subject: 'GA', q: 'RRB NTPC general awareness static GK complete', note: 'Revision-style lectures' },
  { subject: 'GA', q: 'monthly current affairs 2026 RRB NTPC', note: 'Monthly compilations' },
  { subject: 'GA', q: 'Indian railways GK complete zones trains projects', note: 'High-yield for this exam' },
  { subject: 'Strategy', q: 'RRB NTPC CBT 1 strategy 90 marks', note: 'Attempt and time strategy' },
]

// PYQ search links. Papers are published by coaching sites, not by RRB itself,
// so these are searches and you download from whichever source you trust.
export const PYQ_SETS = [
  { id: 'ntpc2019-c1', title: 'CEN 01/2019 NTPC: CBT 1 (all shifts)', note: 'Largest bank of shift papers (held Dec 2020 to Jul 2021)', links: [
    ['Papers (PDF)', g('RRB NTPC CBT 1 2019 previous year question paper pdf all shifts')],
    ['With answer keys', g('RRB NTPC CBT 1 2020 2021 answer key pdf shift wise')],
    ['Video solutions', yt('RRB NTPC CBT 1 2020 2021 shift paper solution')],
  ] },
  { id: 'ntpc2019-c2', title: 'CEN 01/2019 NTPC: CBT 2', note: '120 questions: GA 50, Maths 35, Reasoning 35', links: [
    ['Papers (PDF)', g('RRB NTPC CBT 2 previous year question paper pdf')],
    ['Video solutions', yt('RRB NTPC CBT 2 question paper solution')],
  ] },
  { id: 'ntpc2024-g', title: 'CEN 05/2024 Graduate: CBT 1', note: 'Most recent graduate-level pattern', links: [
    ['Papers (PDF)', g('RRB NTPC graduate CEN 05/2024 CBT 1 question paper pdf')],
    ['With answer keys', g('RRB NTPC graduate CBT 1 2025 answer key pdf shift wise')],
    ['Video solutions', yt('RRB NTPC graduate CBT 1 2025 paper analysis')],
  ] },
  { id: 'ntpc2024-ug', title: 'CEN 03/2024 Undergraduate: CBT 1', note: 'Same syllabus style, slightly easier', links: [
    ['Papers (PDF)', g('RRB NTPC undergraduate CEN 03/2024 CBT 1 question paper pdf')],
    ['Video solutions', yt('RRB NTPC undergraduate CBT 1 2025 paper analysis')],
  ] },
  { id: 'rrb-sample', title: 'Official RRB mock and sample papers', note: 'Try the real CBT interface', links: [
    ['RRB mock test search', g('RRB NTPC official mock test practice CBT interface rrbapply.gov.in')],
  ] },
  { id: 'related', title: 'Related exams (same level)', note: 'Extra practice once you run out of NTPC papers', links: [
    ['RRB Group D CBT papers', g('RRB Group D previous year question paper pdf')],
    ['RRB ALP / JE CBT 1 papers', g('RRB ALP CBT 1 previous year question paper pdf')],
    ['SSC CGL Tier 1 papers', g('SSC CGL tier 1 previous year question paper pdf')],
  ] },
]

export const TOPIC_PYQ = [
  ['Maths', 'RRB NTPC maths previous year questions chapter wise pdf'],
  ['Reasoning', 'RRB NTPC reasoning previous year questions chapter wise pdf'],
  ['General Awareness', 'RRB NTPC general awareness previous year questions chapter wise pdf'],
  ['Railway GK', 'RRB NTPC railway related GK questions pdf'],
  ['General Science', 'RRB NTPC general science previous year questions pdf'],
  ['Current affairs', 'RRB NTPC current affairs previous year questions pdf'],
]
