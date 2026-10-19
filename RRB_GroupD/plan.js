// Study-plan spec for RRB Group D (Level 1). Four sections: Science, Maths, Reasoning, GA.
// Entries starting with * are practice or revision days, not topics.
const S1 = [
  'Motion', 'Force and laws of motion', 'Gravitation', 'Work, energy and power', 'Sound', 'Light: reflection',
  'Light: refraction and lenses', 'Human eye and colours of light', 'Electricity: current and circuits', 'Electricity: heating and power', 'Magnetic effects of current', '*Physics revision + 25 MCQs',
  'Matter and its states', 'Atoms and molecules', 'Structure of the atom', 'Chemical reactions and equations', 'Acids, bases and salts', 'Metals and non-metals',
  'Carbon and its compounds', 'Periodic classification', 'Everyday chemistry: soaps, fuels, plastics', '*Chemistry revision + 25 MCQs', 'Cell and tissues', 'Life processes: nutrition',
  'Life processes: respiration and transport', 'Excretion and control and coordination', 'Reproduction', 'Heredity and evolution', 'Diseases and health', 'Environment and natural resources',
]
const M1 = [
  'Number system', 'BODMAS and simplification', 'Decimals and fractions', 'LCM and HCF', 'Square roots and cube roots', 'Ratio and proportion',
  'Percentage I', 'Percentage II', 'Average', 'Profit and loss I', 'Profit and loss II', '*Mixed practice: percentage, ratio, profit',
  'Simple interest', 'Compound interest', 'Time and work', 'Pipes and cisterns', 'Ages', '*Mixed practice: interest, work, ages',
  'Time and distance I', 'Time and distance II: trains and boats', 'Algebra: identities', 'Algebra: equations', 'Mensuration 2D', 'Mensuration 3D',
  'Geometry: lines and triangles', 'Geometry: circles', 'Trigonometry basics', 'Calendar and clock', 'Elementary statistics', '*Maths revision test (25 Q)',
]
const R1 = [
  'Analogies', 'Number series', 'Alphabet series', 'Classification', 'Coding-decoding I', 'Coding-decoding II',
  'Relationships', 'Directions', 'Mathematical operations', 'Similarities and differences', 'Jumbling', '*Mixed practice: verbal reasoning',
  'Syllogism', 'Venn diagrams', 'Conclusions and decision making', 'Statement, arguments and assumptions', 'Data sufficiency', 'Data interpretation',
  'Analytical reasoning: ranking', 'Analytical reasoning: seating', 'Analytical reasoning: puzzles', 'Calendar-based reasoning', 'Missing numbers and matrices', '*Mixed practice: puzzles',
  '*Revision: series and coding', '*Revision: relations and directions', '*Revision: syllogism and Venn', '*Revision: analytical reasoning', 'Non-verbal basics', '*Reasoning revision test (30 Q)',
]
const G1 = [
  'Indian history: ancient', 'Indian history: medieval', 'Indian history: modern', 'Freedom struggle', 'Art and culture', 'Important monuments',
  'Indian geography', 'World geography', 'Indian polity I', 'Indian polity II', 'Economy basics', 'Banking and budget',
  'Science and technology', 'Space and defence', 'Computer basics', 'Environment', 'Sports and games', 'Awards and honours',
  'Famous personalities', 'Important days and organisations', 'Railways GK I: history, zones', 'Railways GK II: trains, projects', 'Government schemes', 'Static GK: firsts and records',
  'Current affairs: national', 'Current affairs: international', 'Current affairs: sports and awards', 'Current affairs: appointments and reports', '*Static GK revision', '*GA revision test (20 Q)',
]

export default {
  subjects: [
    { key: 'sci', label: 'Science', code: 'S', color: 'sci', kind: 'knowledge', h: '1.5 h', list1: S1,
      p6: ['Physics: mixed MCQs', 'Chemistry: mixed MCQs', 'Biology: mixed MCQs', 'Motion, force and energy sets', 'Electricity, light and magnetism sets', 'Sectional test: Science (25 Q, 20 min)'],
      p7: ['Physics mixed set (harder)', 'Chemistry mixed set (harder)', 'Biology mixed set (harder)', 'Diagram and formula recall', 'Everyday science and units', 'Sectional test: Science (25 Q, 20 min)'] },
    { key: 'maths', label: 'Maths', code: 'M', color: 'maths', kind: 'quant', h: '1.5 h', list1: M1,
      p6: ['Percentage + profit and loss + ratio', 'Interest, average, mixture', 'Time and work + speed and distance', 'Number system, HCF-LCM, simplification', 'Algebra + mensuration', 'Geometry + trigonometry + statistics'],
      p7: ['Arithmetic mixed set 1', 'Arithmetic mixed set 2 (harder)', 'Algebra and geometry mixed set', 'Mensuration and trigonometry set', 'Speed round: 40 Q in 20 min', 'Sectional test: Maths (25 Q, 25 min)'] },
    { key: 'reas', label: 'Reasoning', code: 'R', color: 'reas', kind: 'logic', h: '1.5 h', list1: R1,
      p6: ['Series + coding-decoding', 'Analogy, classification, math operations', 'Relationships, directions, ranking', 'Syllogism, Venn, conclusions', 'Puzzles + seating', 'Sectional test: Reasoning (30 Q, 25 min)'],
      p7: ['Mixed set 1', 'Mixed set 2: puzzles and arrangements', 'Mixed set 3: verbal reasoning', 'Mixed set 4: series, coding, directions', 'Weak-topic drills from error log', 'Sectional test: Reasoning (30 Q, 25 min)'] },
    { key: 'ga', label: 'GA', code: 'G', color: 'ga', kind: 'knowledge', h: '1 h', list1: G1,
      p6: ['History + art and culture', 'Geography + environment', 'Polity + economy', 'Science and technology + computers', 'Sports, awards, days', 'Railways GK + static GK'],
      p7: ['PYQ set: History + culture', 'PYQ set: Geography + environment', 'PYQ set: Polity + economy', 'PYQ set: Science and technology', 'PYQ set: Railways, sports, awards', 'Sectional test: GA (20 Q, 10 min)'] },
  ],
}
