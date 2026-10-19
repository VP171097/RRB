import { useApp } from '../store.jsx'
import { NOTES } from '../data/notes.js'
import { CA_MONTHS, CA_CATS } from '../data/plan.js'
import { Table } from '../ui.jsx'

function Block({ b }) {
  if (b[0] === 'h') return <h3 style={{ margin: '14px 0 4px' }}>{b[1]}</h3>
  if (b[0] === 'ul') return <ul className="l">{b[1].map((x, i) => <li key={i}>{x}</li>)}</ul>
  return <div style={{ margin: '8px 0' }}><Table rows={b[1]} /></div>
}

export default function Notes() {
  const { state, update } = useApp()
  return (
    <>
      <h2>Notes and quick sheets</h2>
      <details>
        <summary><h3>Current affairs tracker</h3></summary>
        <div className="in">
          <p className="small muted" style={{ margin: '0 0 6px' }}>Cover the last six to seven months. Tick a box when your notes for that month and category are done. This sheet does not hold the news itself.</p>
          {CA_MONTHS.map((m) => (
            <div className="cmon" key={m}><b>{m}</b>
              <div className="seg">{CA_CATS.map((c) => {
                const k = m + '|' + c
                return <button key={k} className="btn ghost sm" aria-pressed={!!state.ca[k]} onClick={() => update((s) => { s.ca[k] = !s.ca[k] })}>{c}</button>
              })}</div>
            </div>
          ))}
        </div>
      </details>
      {NOTES.map((n) => (
        <details key={n.id}>
          <summary><h3>{n.title}</h3></summary>
          <div className="in">{n.b.map((b, i) => <Block key={i} b={b} />)}</div>
        </details>
      ))}
    </>
  )
}
