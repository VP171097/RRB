import { NOTES as G } from '../RRB_Graduate/notes.js'

const SCI10 = {
  id: 'sci10', title: 'Class 10 Science sheet', b: [
    ['h', 'Physics formulas'],
    ['ul', ['Equations of motion: v = u + at; s = ut + ½at²; v² = u² + 2as', 'F = ma; momentum p = mv; weight W = mg', 'Work W = F × s; kinetic energy ½mv²; potential energy mgh; power P = W/t (1 hp = 746 W)', 'Pressure = force ÷ area; density = mass ÷ volume', 'Mirror formula 1/v + 1/u = 1/f; magnification m = −v/u. Lens formula 1/v − 1/u = 1/f; power of a lens P = 1/f (f in metres, unit dioptre)', 'Refractive index n = c/v = sin i / sin r', 'V = IR; resistance R = ρl/A; series R = R₁ + R₂; parallel 1/R = 1/R₁ + 1/R₂', 'Electric power P = VI = I²R; energy = P × t; 1 kWh = 3.6 × 10⁶ J', 'Wave speed v = fλ; human hearing 20 Hz to 20 kHz; an echo needs a reflector at least about 17 m away', 'Gravitation F = Gm₁m₂/r²; g = 9.8 m/s²; escape velocity 11.2 km/s']],
    ['h', 'Chemistry'],
    ['ul', ['Reactivity series, high to low: K, Na, Ca, Mg, Al, Zn, Fe, Pb, H, Cu, Hg, Ag, Au', 'Reaction types: combination, decomposition, displacement, double displacement, redox. Exothermic gives out heat; endothermic takes it in', 'pH: lemon juice about 2, pure water 7, blood about 7.4, milk of magnesia about 10', 'Hydrocarbons: methane CH₄, ethane C₂H₆, propane C₃H₈, butane C₄H₁₀, ethene C₂H₄, ethyne C₂H₂. Ethanol C₂H₅OH; acetic acid CH₃COOH']],
    ['table', [['Atomic number', 'Element'], ['1', 'H, Hydrogen'], ['2', 'He, Helium'], ['3', 'Li, Lithium'], ['4', 'Be, Beryllium'], ['5', 'B, Boron'], ['6', 'C, Carbon'], ['7', 'N, Nitrogen'], ['8', 'O, Oxygen'], ['9', 'F, Fluorine'], ['10', 'Ne, Neon'], ['11', 'Na, Sodium'], ['12', 'Mg, Magnesium'], ['13', 'Al, Aluminium'], ['14', 'Si, Silicon'], ['15', 'P, Phosphorus'], ['16', 'S, Sulphur'], ['17', 'Cl, Chlorine'], ['18', 'Ar, Argon'], ['19', 'K, Potassium'], ['20', 'Ca, Calcium']]],
    ['table', [['Source', 'Acid'], ['Vinegar', 'Acetic acid'], ['Lemon, orange', 'Citric acid'], ['Tamarind', 'Tartaric acid'], ['Curd, sour milk', 'Lactic acid'], ['Ant sting', 'Formic acid'], ['Stomach', 'Hydrochloric acid'], ['Apple', 'Malic acid'], ['Tea', 'Tannic acid']]],
    ['h', 'Biology'],
    ['ul', ['Photosynthesis: 6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂, in chloroplasts, using sunlight and chlorophyll', 'Aerobic respiration: glucose + oxygen → carbon dioxide + water + energy (ATP)', 'Arteries carry blood away from the heart, veins carry it towards the heart. The heart has 4 chambers', 'RBCs carry oxygen (haemoglobin), WBCs fight infection, platelets help clotting', 'Mendel worked on pea plants. In humans XX is female and XY is male; the father decides the sex of the child', 'Mitochondria make energy, ribosomes make protein, chloroplasts do photosynthesis, the nucleus holds the chromosomes']],
    ['table', [['Enzyme or juice', 'Where and what']  , ['Amylase', 'Saliva and pancreas; starch to sugar'], ['Pepsin', 'Stomach; proteins'], ['Trypsin', 'Pancreas; proteins'], ['Lipase', 'Pancreas, small intestine; fats'], ['Bile', 'Made in the liver; breaks fat into droplets']]],
    ['table', [['Plant hormone', 'Role'], ['Auxin', 'Cell elongation, bending towards light'], ['Gibberellin', 'Stem growth'], ['Cytokinin', 'Cell division'], ['Abscisic acid', 'Stress, wilting, seed dormancy'], ['Ethylene', 'Fruit ripening']]],
    ['table', [['Gland', 'Hormone'], ['Pituitary', 'Growth hormone (master gland)'], ['Thyroid', 'Thyroxine'], ['Pancreas', 'Insulin'], ['Adrenal', 'Adrenaline'], ['Testis', 'Testosterone'], ['Ovary', 'Oestrogen']]],
  ],
}
const pick = (id) => G.find((n) => n.id === id)
export const NOTES = [pick('fx'), pick('rs'), SCI10, pick('sci'), pick('rail'), pick('pol'), pick('sta'), pick('comp')].filter(Boolean)
