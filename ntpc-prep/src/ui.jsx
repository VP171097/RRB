import { useApp } from './store.jsx'
import { DAYS } from './data/plan.js'
import { pct, groupTasks } from './lib.js'
import { SUB_CLASS } from './widgets.jsx'

export function Bar({ a, b, accent }) {
  return <div className={'bar' + (accent ? ' accent' : '')}><i style={{ width: pct(a, b) + '%' }} /></div>
}

export function TaskList({ n }) {
  const { state, update } = useApp()
  const groups = groupTasks(DAYS[n - 1].tasks)
  return groups.map((g) => {
    const done = g.items.filter((x) => state.done[n + '.' + x.i]).length
    return (
      <section className={'grp s-' + SUB_CLASS[g.name]} key={g.name}>
        <div className="grp-h">
          <h3>{g.name}</h3>
          <span className={'small num ' + (done === g.items.length ? 'ok' : 'muted')}>{done}/{g.items.length}</span>
        </div>
        {g.items.map((x) => {
          const k = n + '.' + x.i
          return (
            <label className="task" key={k}>
              <input type="checkbox" checked={!!state.done[k]}
                onChange={(e) => update((s) => { if (e.target.checked) s.done[k] = 1; else delete s.done[k] })} />
              <span className="box" />
              <span className="tx">{x.label}</span>
              <span className="tm">{x.t}</span>
            </label>
          )
        })}
      </section>
    )
  })
}

export function Check({ checked, onChange, children }) {
  return (
    <label className="sub">
      <input type="checkbox" checked={checked} onChange={onChange} />
      <span className="box" />
      <span className="tx">{children}</span>
    </label>
  )
}

export function Table({ rows }) {
  return (
    <div className="tbl">
      <table>
        <thead><tr>{rows[0].map((c, i) => <th key={i}>{c}</th>)}</tr></thead>
        <tbody>{rows.slice(1).map((r, i) => <tr key={i}>{r.map((c, j) => <td key={j}>{c}</td>)}</tr>)}</tbody>
      </table>
    </div>
  )
}

export function Ext({ href, children, className = 'link' }) {
  return <a className={className} href={href} target="_blank" rel="noopener noreferrer">{children}</a>
}
