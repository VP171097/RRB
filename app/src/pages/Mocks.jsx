import { useState } from 'react'
import { useApp } from '../store.jsx'
import { Bar, Table } from '../ui.jsx'
import { useExam } from '../exam.jsx'
import { Pager, usePaged } from '../pager.jsx'
import { useT } from '../i18n.jsx'
import { fmt, parse, todayIso, uid, mockTotal, round1 } from '../lib.js'

function Chart({ ms, secs }) {
  const t = useT()
  const W = 320, H = 170, L = 26, R = 10, T = 10, B = 22, pw = W - L - R, ph = H - T - B
  const y = (v) => T + ph - (Math.max(0, Math.min(100, v)) / 100) * ph
  const pts = ms.map((m, i) => [L + (ms.length === 1 ? pw / 2 : (i * pw) / (ms.length - 1)), y(mockTotal(m, secs)), mockTotal(m, secs)])
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" role="img" aria-label={t('Mock score trend')} style={{ display: 'block' }}>
      {[0, 25, 50, 75, 100].map((v) => (
        <g key={v}><line x1={L} x2={W - R} y1={y(v)} y2={y(v)} stroke="var(--line)" /><text x={L - 5} y={y(v) + 4} textAnchor="end">{v}</text></g>
      ))}
      <line x1={L} x2={W - R} y1={y(90)} y2={y(90)} stroke="var(--signal)" strokeWidth="1.5" strokeDasharray="5 4" />
      <text x={W - R} y={y(90) - 4} textAnchor="end" style={{ fill: 'var(--signal)' }}>{t('TARGET 90')}</text>
      <line x1={L} x2={W - R} y1={y(80)} y2={y(80)} stroke="var(--ok)" strokeDasharray="2 4" />
      {!ms.length && <text x={W / 2} y={H / 2} textAnchor="middle">{t('Log a mock to see your trend')}</text>}
      {ms.length > 0 && <polyline fill="none" stroke="var(--accent)" strokeWidth="2.5" points={pts.map((p) => p[0] + ',' + p[1]).join(' ')} />}
      {pts.map((p, i) => (
        <g key={i}>
          <circle cx={p[0]} cy={p[1]} r="4" fill="var(--accent)" stroke="var(--surface)" strokeWidth="2" />
          {(i === pts.length - 1 || pts.length <= 8) && <text x={p[0]} y={p[1] - 8} textAnchor="middle" style={{ fill: 'var(--ink)' }}>{round1(p[2])}</text>}
        </g>
      ))}
      {ms.length > 0 && <><text x={L} y={H - 5}>#1</text><text x={W - R} y={H - 5} textAnchor="end">#{ms.length}</text></>}
    </svg>
  )
}

const empty = (secs) => ({ name: '', date: todayIso(), ...Object.fromEntries(secs.map((s) => [s.key, ''])), at: '', co: '', tl: '', note: '' })

export default function Mocks() {
  const t = useT()
  const { state, update } = useApp()
  const { sections: secs, total } = useExam()
  const [f, setF] = useState(() => empty(secs))
  const ms = [...state.mocks].sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0))
  const last = ms.slice(-5)
  const avg = (k) => round1(last.reduce((s, m) => s + (+m[k] || 0), 0) / (last.length || 1))
  const sec = secs.map((s) => [s.label, avg(s.key), s.q, s.target])
  const hist = usePaged([...ms].reverse(), 5)
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value })
  const submit = (e) => {
    e.preventDefault()
    update((s) => { s.mocks.push({ id: uid(), name: f.name.trim(), date: f.date, ...Object.fromEntries(secs.map((x) => [x.key, +f[x.key]])), at: +f.at || 0, co: +f.co || 0, tl: f.tl, note: f.note.trim() }) })
    setF(empty(secs))
  }
  return (
    <>
      <h2>{t('Mock tests')}</h2>
      <section className="card"><h3 style={{ marginBottom: 10 }}>{t('Score trend')}</h3><Chart ms={ms} secs={secs} /></section>
      {ms.length > 0 && (
        <section className="card">
          <h3>{t('Average of last {n} vs target', { n: last.length })}</h3>
          <div style={{ display: 'grid', gap: 10, marginTop: 10 }}>
            {sec.map(([n, v, max, tg]) => (
              <div key={n}>
                <div className="row small" style={{ justifyContent: 'space-between' }}><span>{t(n)}</span><span className="num">{v} / {max} <span className="muted">({t('target {n}', { n: tg })})</span></span></div>
                <Bar a={v} b={max} accent={v < tg} />
              </div>
            ))}
          </div>
        </section>
      )}
      <section className="card">
        <h3 style={{ marginBottom: 10 }}>{t('Log a mock')}</h3>
        <form className="fgrid" onSubmit={submit}>
          <label className="f">{t('Name')}<input type="text" required value={f.name} onChange={set('name')} placeholder={t('Mock 12')} /></label>
          <label className="f">{t('Date')}<input type="date" required value={f.date} onChange={set('date')} /></label>
          {secs.map((s) => <label className="f" key={s.key}>{t('{label} marks /{q}', { label: t(s.label), q: s.q })}<input type="number" step="0.01" min={-Math.ceil(s.q / 3)} max={s.q} required value={f[s.key]} onChange={set(s.key)} /></label>)}
          <label className="f">{t('Attempted')}<input type="number" min="0" max="100" value={f.at} onChange={set('at')} /></label>
          <label className="f">{t('Correct')}<input type="number" min="0" max="100" value={f.co} onChange={set('co')} /></label>
          <label className="f">{t('Time left (min)')}<input type="number" min="0" max="90" value={f.tl} onChange={set('tl')} /></label>
          <label className="f" style={{ gridColumn: '1/-1' }}>{t('Notes')}<input type="text" value={f.note} onChange={set('note')} placeholder={t('What cost you marks?')} /></label>
          <div style={{ gridColumn: '1/-1' }}><button className="btn" type="submit">{t('Save mock')}</button></div>
        </form>
      </section>
      <section className="card">
        <h3>{t('History')}</h3>
        {ms.length ? hist.items.map((m) => {
          const acc = m.at ? Math.round((m.co * 100) / m.at) : null
          return (
            <div className="mock" key={m.id}>
              <div>
                <b>{m.name}</b> <span className="small muted">{fmt(parse(m.date))}</span>
                <div className="small muted num">{secs.map((s) => `${t(s.label)} ${m[s.key] ?? 0}`).join(' · ')}{acc !== null && ` · ${t('{n} attempted', { n: m.at })} · ${t('{n}% accuracy', { n: acc })}`}{m.tl !== '' && m.tl != null && ` · ${t('{n} min left', { n: m.tl })}`}</div>
                {m.note && <div className="small">{m.note}</div>}
                <button className="btn ghost sm" style={{ marginTop: 6 }} onClick={() => update((s) => { s.mocks = s.mocks.filter((x) => x.id !== m.id) })}>{t('Delete')}</button>
              </div>
              <div className="sc num" style={{ textAlign: 'right' }}>{round1(mockTotal(m, secs))}<div className="tiny muted" style={{ fontWeight: 400, fontFamily: 'var(--f-body)' }}>/ 100</div></div>
            </div>
          )
        }) : <div className="empty">{t('No mocks logged yet. Your baseline is due on Day 7.')}</div>}
        <Pager pg={hist} label={t('Mock history')} />
      </section>
      <section className="card">
        <h3 style={{ marginBottom: 8 }}>{t('Milestones')}</h3>
        <Table rows={[['When', 'Mock score'], ['Day 7 baseline', 'Record whatever you get'], ['End of week 6', '55 - 65'], ['End of week 9', '70 - 80'], ['Week 11', '80 - 88'], ['Week 13', '85 - 95']].map((r) => r.map((c) => t(c)))} />
        <p className="small muted" style={{ margin: '10px 0 0' }}>{t('Score = correct − wrong ÷ 3. A 90 needs about 94 right and 6 wrong. Skip a question rather than guess blind.')}</p>
      </section>
    </>
  )
}
