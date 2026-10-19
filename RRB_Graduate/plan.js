// Study-plan spec for NTPC Graduate. Entries starting with * are practice or revision days, not topics.
const M1 = ["Number System + divisibility","HCF & LCM","Simplification, BODMAS, surds","Fractions & Decimals","Percentage I","Percentage II + calculation tricks",
"Ratio & Proportion","Partnership + Ages","Average","Profit & Loss I","Profit & Loss II (discount, false weights)","*Mixed practice: Percentage, Ratio, Profit",
"Simple Interest","Compound Interest","Time & Work I","Time & Work II (pipes, wages)","Mixture & Alligation","*Mixed practice: Interest, Work, Mixture",
"Time, Speed & Distance I","Time, Speed & Distance II (trains, boats)","Algebra: identities","Algebra: equations","Mensuration 2D","Mensuration 3D",
"Geometry: lines, triangles","Geometry: circles, polygons","Trigonometry: ratios","Trigonometry: identities, heights & distances","Statistics + Data Interpretation","*Maths revision test (30 Q)"]
const R1 = ["Number series","Alphabet series","Analogy","Classification (odd one out)","Coding-Decoding I","Coding-Decoding II",
"Blood Relations","Direction & Distance","Ranking & Order","Mathematical Operations","Calendar & Clock","Alphabet/word arrangement, jumbling",
"Syllogism","Venn Diagrams","Statement-Conclusion","Statement-Course of Action","Data Sufficiency","*Mixed practice: verbal reasoning",
"Puzzle: linear arrangement","Seating: circular","Puzzle: floor/day based","Missing number, matrix","Maps & graph interpretation","*Mixed practice: puzzles",
"*Revision: series, coding, relations","*Revision: direction, ranking, ops","*Revision: syllogism, Venn, statements","*Revision: puzzles, seating","Decision making + Data analysis","*Reasoning revision test (30 Q)"]
const G1 = ["Ancient History","Medieval History","Modern History I (1757-1857)","Modern History II (1857-1947)","Art & Culture: dance, music, painting","Monuments, Literature, Books",
"Indian Geography I: physiography, rivers","Geography II: climate, soil, vegetation","Geography III: agriculture, minerals, industry","World Geography","Polity I: Preamble, Rights, DPSP","Polity II: Parliament, President, Judiciary",
"Polity III: amendments, bodies, Panchayati Raj","Economy I: basics, planning, NITI Aayog","Economy II: banking, RBI, budget, taxes","Economy III: schemes, PSUs, organisations","Physics I: motion, force, energy","Physics II: light, sound, electricity",
"Chemistry I: matter, atoms, acids","Chemistry II: metals, carbon, everyday chemistry","Biology I: human body","Biology II: diseases, nutrition, plants","Computers: basics, abbreviations","Environment & Ecology",
"Railways GK I: history, zones","Railways GK II: trains, projects, budget","Sports & Games","Awards, Books & Authors","Important days, Organisations (UN, IMF...)","Space, Nuclear, Defence"]

export default {
  subjects: [
    { key: 'maths', label: 'Maths', code: 'M', color: 'maths', kind: 'quant', h: '2 h', list1: M1,
      p6: ["Percentage + Profit & Loss + Ratio","SI, CI, Average, Mixture","Time & Work + Speed-Distance","Number System, HCF-LCM, Simplification","Algebra + Mensuration","Geometry + Trigonometry + Statistics"],
      p7: ["Arithmetic mixed set 1","Arithmetic mixed set 2 (harder)","Algebra + Geometry mixed set","Mensuration + Trigonometry + DI set","Speed round: 40 Q in 20 min","Sectional test: Maths (30 Q, 35 min)"] },
    { key: 'reas', label: 'Reasoning', code: 'R', color: 'reas', kind: 'logic', h: '1.5 h', list1: R1,
      p6: ["Series + Coding-Decoding","Analogy, Odd-one-out, Math operations","Blood Relations, Direction, Ranking","Syllogism, Venn, Statements","Puzzles + Seating","Sectional test: Reasoning (30 Q, 30 min)"],
      p7: ["Mixed set 1","Mixed set 2: puzzles and arrangements","Mixed set 3: verbal reasoning","Mixed set 4: series, coding, maps","Weak-topic drills from error log","Sectional test: Reasoning (30 Q, 30 min)"] },
    { key: 'ga', label: 'GA', code: 'G', color: 'ga', kind: 'knowledge', h: '2 h', list1: G1,
      p6: ["History + Art & Culture","Geography + Environment","Polity + Economy","Physics + Chemistry + Biology","Computers, Awards, Sports, Days","Railways GK, PSUs, Transport, Flora & Fauna"],
      p7: ["PYQ set: History + Culture","PYQ set: Geography + Environment","PYQ set: Polity + Economy","PYQ set: Science","PYQ set: Computers, Misc, Railways","Sectional test: GA (40 Q, 15 min)"] },
  ],
}
