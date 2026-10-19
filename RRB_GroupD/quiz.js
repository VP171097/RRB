import { QUIZ as G } from '../RRB_Graduate/quiz.js'

const q = (s, text, o, a, e) => ({ cat: 'Science', s: 'Science', q: text, o, a, e })

// The NTPC science questions are tagged to Science here, since Group D has its own Science section.
const base = G.map((x) => (x.cat === 'Science' ? { ...x, s: 'Science' } : x))

export const QUIZ = [
  ...base,
  q('Science', 'The SI unit of work is:', ['Joule', 'Newton', 'Watt', 'Pascal'], 0, 'Work = force x distance.'),
  q('Science', 'Which mirror is used as a rear-view mirror in vehicles?', ['Convex', 'Concave', 'Plane', 'Cylindrical'], 0, 'It gives a wider field of view.'),
  q('Science', 'Sound travels fastest in:', ['Solids', 'Liquids', 'Gases', 'Vacuum'], 0, 'It cannot travel in a vacuum at all.'),
  q('Science', 'The SI unit of electrical resistance is:', ['Ohm', 'Ampere', 'Volt', 'Watt'], 0, 'R = V / I.'),
  q('Science', 'An ammeter is connected in a circuit:', ['In series', 'In parallel', 'Across the battery only', 'Across the resistor only'], 0, 'It has very low resistance.'),
  q('Science', 'Which colour of light bends the least in a prism?', ['Red', 'Violet', 'Blue', 'Green'], 0, 'Violet bends the most.'),
  q('Science', 'The kilowatt-hour is a unit of:', ['Energy', 'Power', 'Force', 'Current'], 0, '1 kWh = 3.6 million joules.'),
  q('Science', 'At the highest point of a ball thrown vertically upward, its velocity is:', ['Zero', 'Maximum', '9.8 m/s', 'Equal to the initial velocity'], 0, 'Gravity is still acting, so acceleration is not zero.'),
  q('Science', 'The gas released when zinc reacts with dilute hydrochloric acid is:', ['Hydrogen', 'Oxygen', 'Carbon dioxide', 'Chlorine'], 0, 'It burns with a pop sound.'),
  q('Science', 'Rusting of iron is an example of:', ['Oxidation', 'Reduction only', 'Neutralisation', 'Evaporation'], 0, 'Iron reacts with oxygen and moisture.'),
  q('Science', 'Which of these metals is the most reactive?', ['Potassium', 'Sodium', 'Zinc', 'Copper'], 0, 'Top of the reactivity series.'),
  q('Science', 'Lime water turns milky when which gas is passed through it?', ['Carbon dioxide', 'Oxygen', 'Hydrogen', 'Nitrogen'], 0, 'Calcium carbonate forms.'),
  q('Science', 'The atomic number of carbon is:', ['6', '12', '8', '4'], 0, '12 is its mass number.'),
  q('Science', 'The acid present in vinegar is:', ['Acetic acid', 'Citric acid', 'Lactic acid', 'Formic acid'], 0, 'Lemon has citric acid.'),
  q('Science', 'The chemical symbol of potassium is:', ['K', 'P', 'Po', 'Pt'], 0, 'From the Latin kalium.'),
  q('Science', 'Bleaching powder is mainly used to:', ['Disinfect drinking water', 'Neutralise acidity in soil', 'Make glass', 'Make plaster'], 0, 'It releases chlorine.'),
  q('Science', 'The basic structural and functional unit of life is the:', ['Cell', 'Tissue', 'Organ', 'Atom'], 0, 'Discovered by Robert Hooke.'),
  q('Science', 'Blood is carried away from the heart by:', ['Arteries', 'Veins', 'Capillaries only', 'Lymph'], 0, 'Veins return blood to the heart.'),
  q('Science', 'Balance and posture are controlled by the:', ['Cerebellum', 'Cerebrum', 'Medulla', 'Pituitary'], 0, 'Part of the hindbrain.'),
  q('Science', 'Lack of insulin causes:', ['Diabetes', 'Goitre', 'Anaemia', 'Rickets'], 0, 'Insulin is made by the pancreas.'),
  q('Science', 'The plant hormone responsible for fruit ripening is:', ['Ethylene', 'Auxin', 'Cytokinin', 'Gibberellin'], 0, 'It is a gas.'),
  q('Science', 'Each human gamete (sperm or egg) contains how many chromosomes?', ['23', '46', '22', '44'], 0, 'Fertilisation restores 46.'),
  q('Science', 'Digestion of starch begins in the:', ['Mouth', 'Stomach', 'Small intestine', 'Liver'], 0, 'Salivary amylase.'),
  q('Science', 'Photosynthesis takes place in the:', ['Chloroplasts', 'Mitochondria', 'Ribosomes', 'Nucleus'], 0, 'They contain chlorophyll.'),
  q('Science', 'Proteins are made in the cell by the:', ['Ribosomes', 'Lysosomes', 'Vacuoles', 'Golgi body'], 0, 'Found on the rough ER.'),
  q('Science', 'Which of these diseases is caused by a virus?', ['Measles', 'Typhoid', 'Cholera', 'Tuberculosis'], 0, 'The others are bacterial.'),
  q('Science', 'The hormone adrenaline is secreted by the:', ['Adrenal glands', 'Thyroid', 'Pituitary', 'Pancreas'], 0, 'Prepares the body for fight or flight.'),
]
export const QUIZ_CATS = ['All', ...Array.from(new Set(QUIZ.map((x) => x.cat)))]
