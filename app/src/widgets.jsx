import { useEffect, useState } from 'react'
import { useApp } from './store.jsx'
import { useExam } from './exam.jsx'
import { fmt } from './lib.js'
import { useT } from './i18n.jsx'


// Animated progress ring. The stroke grows from 0 on first paint.
export function Ring({ value, size = 84, stroke = 9, color = 'var(--accent)', children, label }) {
  const [v, setV] = useState(0)
  useEffect(() => { const id = requestAnimationFrame(() => setV(value)); return () => cancelAnimationFrame(id) }, [value])
  const r = (size - stroke) / 2, c = 2 * Math.PI * r
  return (
    <div className="ring" style={{ width: size, height: size }} role="img" aria-label={label}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--surface2)" strokeWidth={stroke} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={c * (1 - Math.min(1, v / 100))} transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ transition: 'stroke-dashoffset .8s cubic-bezier(.2,.8,.2,1)' }} />
      </svg>
      <div className="ring-in">{children}</div>
    </div>
  )
}

// 13 weeks x 7 days. Colour = share of that day's tasks done. Tap a cell to open that day.
export function Heatmap({ selected, onSelect }) {
  const t = useT()
  const { today, dateOf, dayDone } = useApp()
  const { DAYS } = useExam()
  const rows = []
  for (let d = 1; d <= 7; d++) {
    const cells = []
    for (let w = 0; w < 13; w++) {
      const n = w * 7 + d, day = DAYS[n - 1], f = dayDone(n) / day.tasks.length
      const lvl = f === 0 ? 0 : f < 0.5 ? 1 : f < 1 ? 2 : 3
      cells.push(
        <button key={n} className={`hm l${lvl}${n === today ? ' now' : ''}${n === selected ? ' sel' : ''}${n > today ? ' future' : ''}`}
          onClick={() => onSelect(n)} aria-label={t('Day {n}, {date}, {done} of {all} done', { n, date: fmt(dateOf(n)), done: dayDone(n), all: day.tasks.length })} title={`${t('Day {n}', { n })} · ${fmt(dateOf(n))}`} />
      )
    }
    rows.push(<div className="hm-row" key={d}>{cells}</div>)
  }
  return (
    <div>
      <div className="hm-grid">{rows}</div>
      <div className="row tiny muted" style={{ marginTop: 8, gap: 6 }}>
        <span>{t('None')}</span><i className="hm l0" /><i className="hm l1" /><i className="hm l2" /><i className="hm l3" /><span>{t('All done')}</span>
        <span style={{ marginLeft: 'auto' }}>{t('Weeks 1 to 13, left to right')}</span>
      </div>
    </div>
  )
}

export function Train({ pct }) {
  const t = useT()
  const [p, setP] = useState(0)
  useEffect(() => { const id = setTimeout(() => setP(pct), 120); return () => clearTimeout(id) }, [pct])
  return (
    <div className="track" aria-hidden="true">
      <div className="rail" />
      <div className="rail-fill" style={{ width: p + '%' }} />
      <div className="loco" style={{ left: p + '%' }}>
        <svg width="34" height="20" viewBox="0 0 34 20"><rect x="1" y="5" width="20" height="10" rx="2" fill="#fff" /><rect x="21" y="2" width="8" height="13" rx="2" fill="#f2b52e" /><rect x="4" y="7" width="4" height="4" fill="var(--accent)" /><rect x="10" y="7" width="4" height="4" fill="var(--accent)" /><circle cx="8" cy="17" r="2.5" fill="#fff" /><circle cx="17" cy="17" r="2.5" fill="#fff" /><circle cx="26" cy="17" r="2.5" fill="#fff" /><rect x="29" y="9" width="4" height="3" rx="1" fill="#fff" /></svg>
      </div>
      <div className="stops">{Array.from({ length: 13 }, (_, i) => <span key={i}>{t('W{n}', { n: i + 1 })}</span>)}</div>
    </div>
  )
}
