import { useState } from 'react'
import { useApp } from '../store.jsx'
import { useExam } from '../exam.jsx'
import { Table } from '../ui.jsx'

const CA_MONTHS = ['Jul 2026', 'Aug 2026', 'Sep 2026', 'Oct 2026', 'Nov 2026', 'Dec 2026', 'Jan 2027']
const CA_CATS = ['National', 'International', 'Sports', 'Awards', 'Appointments', 'Schemes + Budget', 'Science, Space, Defence', 'Railways']

function Block({ b }) {
  if (b[0] === 'h') return <h3 style={{ margin: '14px 0 4px' }}>{b[1]}</h3>
  if (b[0] === 'ul') return <ul className="l">{b[1].map((x, i) => <li key={i}>{x}</li>)}</ul>
  return <div style={{ margin: '8px 0' }}><Table rows={b[1]} /></div>
}

// One sheet at a time, picked from the chips, so the page never turns into a wall of text.
export default function Notes() {
  const { state, update } = useApp()
  const { NOTES } = useExam()
  const [id, setId] = useState(NOTES[0].id)
  const sheets = [...NOTES.map((n) => ({ id: n.id, title: n.title })), { id: 'ca', title: 'Current affairs' }]
  const cur = NOTES.find((n) => n.id === id)
  return (
    <>
      <h2>Notes and quick sheets</h2>
      <div className="seg" role="group" aria-label="Sheet">
        {sheets.map((s) => <button key={s.id} className="btn ghost sm" aria-pressed={id === s.id} onClick={() => { setId(s.id); window.scrollTo(0, 0) }}>{s.title}</button>)}
      </div>
      {id === 'ca' ? (
        <section className="card">
          <h3>Current affairs tracker</h3>
          <p className="small muted" style={{ margin: '4px 0 6px' }}>Cover the last six to seven months. Tick a box when your notes for that month and category are done. This sheet does not hold the news itself.</p>
          {CA_MONTHS.map((m) => (
            <div className="cmon" key={m}><b>{m}</b>
              <div className="seg">{CA_CATS.map((c) => {
                const k = m + '|' + c
                return <button key={k} className="btn ghost sm" aria-pressed={!!state.ca[k]} onClick={() => update((s) => { s.ca[k] = !s.ca[k] })}>{c}</button>
              })}</div>
            </div>
          ))}
        </section>
      ) : (
        <section className="card"><h3>{cur.title}</h3>{cur.b.map((b, i) => <Block key={i} b={b} />)}</section>
      )}
    </>
  )
}
