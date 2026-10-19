const M1=["Number System + divisibility","HCF & LCM","Simplification, BODMAS, surds","Fractions & Decimals","Percentage I","Percentage II + calculation tricks",
"Ratio & Proportion","Partnership + Ages","Average","Profit & Loss I","Profit & Loss II (discount, false weights)","*Mixed practice: Percentage, Ratio, Profit",
"Simple Interest","Compound Interest","Time & Work I","Time & Work II (pipes, wages)","Mixture & Alligation","*Mixed practice: Interest, Work, Mixture",
"Time, Speed & Distance I","Time, Speed & Distance II (trains, boats)","Algebra: identities","Algebra: equations","Mensuration 2D","Mensuration 3D",
"Geometry: lines, triangles","Geometry: circles, polygons","Trigonometry: ratios","Trigonometry: identities, heights & distances","Statistics + Data Interpretation","*Maths revision test (30 Q)"];
const R1=["Number series","Alphabet series","Analogy","Classification (odd one out)","Coding-Decoding I","Coding-Decoding II",
"Blood Relations","Direction & Distance","Ranking & Order","Mathematical Operations","Calendar & Clock","Alphabet/word arrangement, jumbling",
"Syllogism","Venn Diagrams","Statement-Conclusion","Statement-Course of Action","Data Sufficiency","*Mixed practice: verbal reasoning",
"Puzzle: linear arrangement","Seating: circular","Puzzle: floor/day based","Missing number, matrix","Maps & graph interpretation","*Mixed practice: puzzles",
"*Revision: series, coding, relations","*Revision: direction, ranking, ops","*Revision: syllogism, Venn, statements","*Revision: puzzles, seating","Decision making + Data analysis","*Reasoning revision test (30 Q)"];
const G1=["Ancient History","Medieval History","Modern History I (1757-1857)","Modern History II (1857-1947)","Art & Culture: dance, music, painting","Monuments, Literature, Books",
"Indian Geography I: physiography, rivers","Geography II: climate, soil, vegetation","Geography III: agriculture, minerals, industry","World Geography","Polity I: Preamble, Rights, DPSP","Polity II: Parliament, President, Judiciary",
"Polity III: amendments, bodies, Panchayati Raj","Economy I: basics, planning, NITI Aayog","Economy II: banking, RBI, budget, taxes","Economy III: schemes, PSUs, organisations","Physics I: motion, force, energy","Physics II: light, sound, electricity",
"Chemistry I: matter, atoms, acids","Chemistry II: metals, carbon, everyday chemistry","Biology I: human body","Biology II: diseases, nutrition, plants","Computers: basics, abbreviations","Environment & Ecology",
"Railways GK I: history, zones","Railways GK II: trains, projects, budget","Sports & Games","Awards, Books & Authors","Important days, Organisations (UN, IMF...)","Space, Nuclear, Defence"];
const M6=["Percentage + Profit & Loss + Ratio","SI, CI, Average, Mixture","Time & Work + Speed-Distance","Number System, HCF-LCM, Simplification","Algebra + Mensuration","Geometry + Trigonometry + Statistics"];
const R6=["Series + Coding-Decoding","Analogy, Odd-one-out, Math operations","Blood Relations, Direction, Ranking","Syllogism, Venn, Statements","Puzzles + Seating","Sectional test: Reasoning (30 Q, 30 min)"];
const G6=["History + Art & Culture","Geography + Environment","Polity + Economy","Physics + Chemistry + Biology","Computers, Awards, Sports, Days","Railways GK, PSUs, Transport, Flora & Fauna"];
const M7=["Arithmetic mixed set 1","Arithmetic mixed set 2 (harder)","Algebra + Geometry mixed set","Mensuration + Trigonometry + DI set","Speed round: 40 Q in 20 min","Sectional test: Maths (30 Q, 35 min)"];
const R7=["Mixed set 1","Mixed set 2: puzzles and arrangements","Mixed set 3: verbal reasoning","Mixed set 4: series, coding, maps","Weak-topic drills from error log","Sectional test: Reasoning (30 Q, 30 min)"];
const G7=["PYQ set: History + Culture","PYQ set: Geography + Environment","PYQ set: Polity + Economy","PYQ set: Science","PYQ set: Computers, Misc, Railways","Sectional test: GA (40 Q, 15 min)"];
const TOTAL=91;
const PHASES=[{n:1,name:"Foundation",from:1,to:35},{n:2,name:"Practice",from:36,to:63},{n:3,name:"Mocks",from:64,to:91}];
function phaseOf(n){return n<=35?PHASES[0]:n<=63?PHASES[1]:PHASES[2];}

function buildDays(){
  var days=[],mock=0,n,w,d,i,t;
  for(n=1;n<=TOTAL;n++){
    w=Math.floor((n-1)/7)+1; d=(n-1)%7+1; t=[]; var sum="";
    if(w<=5){
      if(d<=6){
        i=(w-1)*6+(d-1);
        t.push({l:"Maths: "+M1[i].replace("*",""),t:"2 h"});
        t.push({l:"Reasoning: "+R1[i].replace("*",""),t:"1.5 h"});
        t.push({l:"GA: "+G1[i].replace("*",""),t:"2 h"});
        sum=[M1[i],R1[i],G1[i]].map(function(x){return x.replace("*","")}).join(" · ");
      } else if(w===1){
        mock++; t.push({l:"Baseline mock #"+mock+" (full 90 min). Score does not matter, record it",t:"1.5 h"});
        t.push({l:"Analyse every wrong and skipped question; start the error log",t:"2 h"});
        t.push({l:"Revise the week: formulas + GA notes",t:"1 h"}); sum="Baseline mock + review";
      } else {
        t.push({l:"Weekly test: 100 mixed questions from weeks 1-"+w+" (timed)",t:"1.5 h"});
        t.push({l:"Analyse test, update error log",t:"1.5 h"});
        t.push({l:"Revise the week's formulas + GA notes",t:"1 h"}); sum="Weekly test + review";
      }
      if(n<=10) t.push({l:"Speed drill: tables to 30, squares to 30, cubes to 15",t:"20 min"});
      if(d<=6) t.push({l:"Recall yesterday's topics from memory, then check notes",t:"20 min"});
      t.push({l:"Current affairs: today's news, write 5 one-liners",t:"30 min"});
    } else if(w<=7){
      if(d<=6){
        const M=(w===6?M6:M7)[d-1],R=(w===6?R6:R7)[d-1],G=(w===6?G6:G7)[d-1];
        t.push({l:"Maths: "+(w===6?"timed sets (25 Q) + review: ":"")+M,t:"2 h"});
        t.push({l:"Reasoning: "+(w===6&&d<6?"timed sets (25 Q) + review: ":"")+R,t:"1.5 h"});
        t.push({l:"GA: "+(w===6?"revise + MCQ set: ":"")+G,t:"2 h"});
        t.push({l:"Current affairs: today's news + last week's notes",t:"30 min"}); sum=[M,R,G].join(" · ");
      } else { mock++; sum="Mock #"+mock;
        t.push({l:"Full mock #"+mock+" (90 min, timed sections)",t:"1.5 h"});
        t.push({l:"Analyse mock; log every error with cause",t:"2 h"});
        t.push({l:"Revise error log + weak topics",t:"1 h"});
        t.push({l:"Current affairs weekly recap",t:"30 min"}); }
    } else if(w<=9){
      const p=(w-8)*6+d;
      if(d<=6){
        t.push({l:"Previous-year paper #"+p+" (one full RRB NTPC shift, 90 min)",t:"1.5 h"});
        t.push({l:"Analyse paper; log errors",t:"1.5 h"});
        t.push({l:"Weak topics: Maths drill",t:"1 h"});
        t.push({l:"Weak topics: Reasoning drill",t:"45 min"});
        t.push({l:"GA: revise notes + current affairs",t:"1 h"}); sum="PYQ paper #"+p;
      } else { mock++; sum="Mock #"+mock;
        t.push({l:"Full mock #"+mock+" (90 min)",t:"1.5 h"});
        t.push({l:"Analyse mock; log every error with cause",t:"2 h"});
        t.push({l:"Revise error log + weak topics",t:"1 h"});
        t.push({l:"Current affairs weekly recap",t:"30 min"}); }
    } else if(n<=84){
      mock++; sum="Mock #"+mock;
      t.push({l:"Full mock #"+mock+" (90 min, exam timing)",t:"1.5 h"});
      t.push({l:"Analyse mock: every wrong, skipped and lucky-guess question",t:"2 h"});
      if(d<7){
        t.push({l:"Weak-area drill from error log",t:"1.5 h"});
        t.push({l:"GA recall: notes + current affairs",t:"1 h"});
        t.push({l:"Formulas + calculation speed",t:"20 min"});
      } else t.push({l:"Light revision only; rest in the evening",t:"1 h"});
    } else {
      if(d<=4){ mock++; sum="Mock #"+mock;
        t.push({l:"Full mock #"+mock+" (90 min)",t:"1.5 h"});
        t.push({l:"Analyse mock; fix only what you can fix quickly",t:"1.5 h"});
        t.push({l:"GA recall: notes + current affairs",t:"1 h"});
      } else if(d===5){ sum="Final revision";
        t.push({l:"Revise formula sheet + calculation tables",t:"1.5 h"});
        t.push({l:"Revise error log (all entries)",t:"1.5 h"});
        t.push({l:"Revise current affairs notes + GA one-liners",t:"1.5 h"});
      } else if(d===6){ sum="Light revision";
        t.push({l:"Skim GA tables (zones, schedules, vitamins, days)",t:"1 h"});
        t.push({l:"Light reasoning set to stay warm (20 Q)",t:"30 min"});
        t.push({l:"Check admit card, centre location, ID, travel plan",t:"30 min"});
      } else { sum="Rest day";
        t.push({l:"Rest. Sleep early; no new topics, no mock",t:"all day"});
        t.push({l:"Pack ID, admit card, pen if allowed; plan the route",t:"20 min"});
      }
    }
    days.push({n:n,w:w,d:d,ph:phaseOf(n),tasks:t,sum:sum});
  }
  return days;
}
const DAYS=buildDays();

function buildTopics(){
  const out=[];
  [["Maths",M1],["Reasoning",R1],["GA",G1]].forEach(function(s){
    s[1].forEach(function(name,i){
      if(name.charAt(0)==="*") return;
      out.push({k:s[0].charAt(0)+i,sub:s[0],name:name,day:Math.floor(i/6)*7+(i%6)+1});
    });
  });
  return out;
}
const TOPICS=buildTopics();
const SUBS=["Maths","Reasoning","GA"];
const COLS=["Learn","Practice","Rev 1","Rev 2","Rev 3"];
const CA_MONTHS=["Jul 2026","Aug 2026","Sep 2026","Oct 2026","Nov 2026","Dec 2026","Jan 2027"];
const CA_CATS=["National","International","Sports","Awards","Appointments","Schemes + Budget","Science, Space, Defence","Railways"];
const CAUSES=["Concept gap","Calculation slip","Silly mistake","Did not know","Ran out of time"];


export {M1,R1,G1,TOTAL,PHASES,phaseOf,DAYS,TOPICS,SUBS,COLS,CA_MONTHS,CA_CATS,CAUSES};
