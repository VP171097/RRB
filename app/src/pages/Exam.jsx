import { useState } from 'react'
import { useExam } from '../exam.jsx'
import { Table } from '../ui.jsx'

export default function Exam() {
  const X = useExam()
  const [c, setC] = useState(90)
  const [w, setW] = useState(6)
  const score = Math.round((c - w / 3) * 100) / 100
  const att = Number(c) + Number(w)
  const rows = [['Correct', 'Max wrong for 90', 'Attempted', 'Score at that point']]
  for (let k = 91; k <= 100; k++) {
    const mw = Math.min(100 - k, Math.floor(3 * (k - 90)))
    rows.push([k, mw, k + mw, Math.round((k - mw / 3) * 100) / 100])
  }
  const used = X.sections.reduce((a, s) => a + s.minutes, 0)
  const time = [['Section', 'Time', 'Per question'], ...X.sections.map((s) => [s.full, s.minutes + ' min', Math.round((s.minutes * 60) / s.q) + ' s']), ['Review and flagged questions', X.total.minutes - used + ' min', '']]
  return (
    <>
      <h2>Exam pattern: {X.name}</h2>
      {X.pattern.map((b) => (
        <section className="card" key={b.title}>
          <h3>{b.title}</h3>
          {b.note && <p className="small muted" style={{ margin: '4px 0 8px' }}>{b.note}</p>}
          {b.rows && <Table rows={b.rows} />}
          {b.text && <p className="small" style={{ margin: '6px 0 0' }}>{b.text}</p>}
        </section>
      ))}
      <details>
        <summary><h3>Suggested time split ({X.total.q} Q in {X.total.minutes} min)</h3></summary>
        <div className="in">
          <p className="small muted" style={{ margin: '0 0 8px' }}>Bank the quick marks first, keep the longest section for the middle, and leave time to review. Skip anything that needs over 90 seconds and flag it.</p>
          <Table rows={time} />
        </div>
      </details>
      <details>
        <summary><h3>Score calculator</h3></summary>
        <div className="in">
          <p className="small muted" style={{ margin: '0 0 10px' }}>Score = correct − wrong ÷ 3</p>
          <div className="fgrid" style={{ maxWidth: 360 }}>
            <label className="f">Correct<input type="number" min="0" max="100" value={c} onChange={(e) => setC(e.target.value)} /></label>
            <label className="f">Wrong<input type="number" min="0" max="100" value={w} onChange={(e) => setW(e.target.value)} /></label>
          </div>
          <p style={{ margin: '12px 0' }}><span className="sc num">{score}</span> <span className="muted">/ 100</span>
            {att > 100 && <span className="pill bad" style={{ marginLeft: 8 }}>Over 100 attempted</span>}
            <span className="small muted" style={{ marginLeft: 8 }}>{att} attempted</span></p>
          <h3 style={{ marginBottom: 8 }}>What 90 requires</h3>
          <Table rows={rows} />
        </div>
      </details>
      <details>
        <summary><h3>CBT habits</h3></summary>
        <div className="in">
          <ul className="l">
            <li>Practise on the real interface style: question palette, mark for review, section switching.</li>
            <li>Answer only when you can remove at least two options. Otherwise skip: a wrong answer costs 1.33 marks compared with skipping.</li>
            <li>Keep scratch work tidy. Do not change an answer without a concrete reason.</li>
            <li>Reach the centre early. Carry the ID and admit card named in the notification.</li>
          </ul>
        </div>
      </details>
    </>
  )
}
