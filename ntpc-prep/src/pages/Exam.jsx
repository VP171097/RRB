import { useState } from 'react'
import { Table } from '../ui.jsx'

const s1 = [['Section', 'Questions', 'Marks'], ['General Awareness', '40', '40'], ['Mathematics', '30', '30'], ['General Intelligence and Reasoning', '30', '30'], ['Total', '100', '100']]
const s2 = [['Section', 'Questions', 'Marks'], ['General Awareness', '50', '50'], ['Mathematics', '35', '35'], ['General Intelligence and Reasoning', '35', '35'], ['Total', '120', '120']]
const quals = [['Category', 'Minimum qualifying marks'], ['UR', '40%'], ['EWS', '40%'], ['OBC (non-creamy layer)', '30%'], ['SC', '30%'], ['ST', '25%']]
const flow = [['Step', 'What happens'],
  ['1st stage CBT', '100 Q, 90 min. Screening. Normalised score shortlists for the 2nd stage'],
  ['2nd stage CBT', '120 Q, 90 min. Shortlist is 15 times the community-wise vacancies, as per merit in the 1st stage. Railways may change this limit'],
  ['Post-specific tests', 'Some posts need a typing skill test or aptitude test. Check which applies to your post in the notification'],
  ['Document verification and medical', 'Based on 2nd stage normalised marks and post preference']]
const time = [['Section', 'Time', 'Per question'], ['General Awareness', '15 min', '~22 s'], ['Reasoning', '30 min', '~60 s'], ['Maths', '35 min', '~70 s'], ['Review and flagged questions', '10 min', '']]

export default function Exam() {
  const [c, setC] = useState(90)
  const [w, setW] = useState(6)
  const score = Math.round((c - w / 3) * 100) / 100
  const att = Number(c) + Number(w)
  const rows = [['Correct', 'Max wrong for 90', 'Attempted', 'Score at that point']]
  for (let k = 91; k <= 100; k++) {
    const mw = Math.min(100 - k, Math.floor(3 * (k - 90)))
    rows.push([k, mw, k + mw, Math.round((k - mw / 3) * 100) / 100])
  }
  return (
    <>
      <h2>Exam pattern and strategy</h2>
      <section className="card">
        <h3>1st stage CBT (CEN 06/2026, graduate posts)</h3>
        <p className="small muted" style={{ margin: '4px 0 8px' }}>90 minutes (120 for PwBD candidates eligible for a scribe). Each question carries 1 mark. Section-wise split is indicative, so a paper can vary slightly. Objective, multiple choice.</p>
        <Table rows={s1} />
        <p className="small" style={{ margin: '10px 0 0' }}><b>Negative marking:</b> 1/3 mark off for each wrong answer. Unattempted questions score 0.</p>
      </section>
      <section className="card">
        <h3>2nd stage CBT</h3>
        <p className="small muted" style={{ margin: '4px 0 8px' }}>Same subjects, same marking, same 1/3 penalty. 90 minutes.</p>
        <Table rows={s2} />
      </section>
      <section className="card"><h3>Qualifying marks</h3><p className="small muted" style={{ margin: '4px 0 8px' }}>Relaxable by 2 marks for PwBD candidates if PwBD vacancies would otherwise go unfilled. Also applies to ex-servicemen and PwBD candidates as per their community.</p><Table rows={quals} /></section>
      <section className="card"><h3>Selection flow</h3><div style={{ marginTop: 8 }}><Table rows={flow} /></div></section>
      <section className="card">
        <h3>Normalisation</h3>
        <p className="small" style={{ margin: '6px 0 0' }}>When a CBT runs in several shifts, marks are normalised across shifts before shortlisting. The 1st stage normalised score decides who reaches the 2nd stage. Candidates shortlisted under OBC, SC, ST, EWS, PwBD or ExSM reservation stay in those categories for later stages.</p>
      </section>
      <section className="card">
        <h3>Suggested time split (100 Q in 90 min)</h3>
        <p className="small muted" style={{ margin: '4px 0 8px' }}>Start with GA and Reasoning, bank the quick marks, then Maths. Skip anything that needs over 90 seconds and flag it.</p>
        <Table rows={time} />
      </section>
      <section className="card">
        <h3>Score calculator</h3>
        <p className="small muted" style={{ margin: '4px 0 10px' }}>Score = correct − wrong ÷ 3</p>
        <div className="fgrid" style={{ maxWidth: 360 }}>
          <label className="f">Correct<input type="number" min="0" max="100" value={c} onChange={(e) => setC(e.target.value)} /></label>
          <label className="f">Wrong<input type="number" min="0" max="100" value={w} onChange={(e) => setW(e.target.value)} /></label>
        </div>
        <p style={{ margin: '12px 0 0' }}><span className="sc num">{score}</span> <span className="muted">/ 100</span>
          {att > 100 && <span className="pill bad" style={{ marginLeft: 8 }}>Over 100 attempted</span>}
          <span className="small muted" style={{ marginLeft: 8 }}>{att} attempted</span></p>
        <h3 style={{ marginTop: 16, marginBottom: 8 }}>What 90 requires</h3>
        <Table rows={rows} />
        <p className="small muted" style={{ margin: '8px 0 0' }}>Max wrong is capped by the 100 questions, so from 91 correct you can afford only a handful of misses.</p>
      </section>
      <section className="card">
        <h3>CBT habits</h3>
        <ul className="l">
          <li>Practise on the real interface style: question palette, mark for review, section switching.</li>
          <li>Answer only when you can remove at least two options. Otherwise skip: a wrong answer costs 1.33 marks compared with skipping.</li>
          <li>Keep scratch work tidy. Do not change an answer without a concrete reason.</li>
          <li>Reach the centre early. Carry the ID and admit card named in the notification.</li>
        </ul>
      </section>
    </>
  )
}
