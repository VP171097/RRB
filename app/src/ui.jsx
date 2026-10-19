import { useApp } from './store.jsx'
import { useExam } from './exam.jsx'
import { pct } from './lib.js'
import { groupTasks } from './plan.js'
import { toggleSub } from './subs.js'

export function Bar({ a, b, accent }) {
  return <div className={'bar' + (accent ? ' accent' : '')}><i style={{ width: pct(a, b) + '%' }} /></div>
}

export function TaskList({ n }) {
  const { state, update } = useApp()
  const X = useExam()
  const groups = groupTasks(X.DAYS[n - 1], X.GROUPS)
  return groups.map((g) => {
    const done = g.items.filter((x) => state.done[n + '.' + x.i]).length
    return (
      <section className={'grp s-' + X.colorOf[g.name]} key={g.name}>
        <div className="grp-h">
          <h3>{g.name}</h3>
          <span className={'small num ' + (done === g.items.length ? 'ok' : 'muted')}>{done}/{g.items.length}</span>
        </div>
        {g.items.map((x) => {
          const k = n + '.' + x.i
          const sd = x.subs ? x.subs.filter((_, j) => state.subdone[k + '.' + j]).length : 0
          return (
            <div key={k}>
              <label className="task">
                <input type="checkbox" checked={!!state.done[k]}
                  onChange={(e) => update((s) => { if (e.target.checked) s.done[k] = 1; else delete s.done[k] })} />
                <span className="box" />
                <span className="tx">{x.label}{x.subs && <span className="tiny muted subcount"> · {sd}/{x.subs.length}</span>}</span>
                <span className="tm">{x.t}</span>
              </label>
              {x.subs && (
                <ul className="subtasks" aria-label={'Sub-topics of ' + x.label}>
                  {x.subs.map((st, j) => {
                    const sk = k + '.' + j
                    return (
                      <li key={sk} className="subt">
                        <label className="subchk" aria-label={'Mark ' + st + ' as done'}>
                          <input type="checkbox" checked={!!state.subdone[sk]} onChange={(e) => update((s) => toggleSub(s, X, n, x.i, j, e.target.checked))} />
                          <span className="sbox" />
                        </label>
                        <a className="sublink" href={'#/lesson/' + sk}>{st}</a>
                      </li>
                    )
                  })}
                </ul>
              )}
            </div>
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
