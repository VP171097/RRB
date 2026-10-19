import { useEffect, useState } from 'react'

// Splits a list into pages. The page resets to 1 when the list shrinks past it.
export function usePaged(list, size, start = 1) {
  const pages = Math.max(1, Math.ceil(list.length / size))
  const [page, setPage] = useState(start)
  useEffect(() => { if (page > pages) setPage(pages) }, [pages, page])
  const p = Math.min(page, pages)
  return { items: list.slice((p - 1) * size, p * size), page: p, pages, setPage, from: list.length ? (p - 1) * size + 1 : 0, to: Math.min(list.length, p * size), total: list.length }
}

const windowed = (page, pages) => {
  if (pages <= 7) return Array.from({ length: pages }, (_, i) => i + 1)
  const s = new Set([1, 2, pages - 1, pages, page - 1, page, page + 1])
  const out = []
  let last = 0
  ;[...s].filter((n) => n >= 1 && n <= pages).sort((a, b) => a - b).forEach((n) => { if (n - last > 1) out.push('…'); out.push(n); last = n })
  return out
}

export function Pager({ pg, label = 'Page', unit, info = true }) {
  if (pg.pages <= 1) return null
  const go = (n) => { pg.setPage(n); window.scrollTo({ top: 0, behavior: 'smooth' }) }
  return (
    <nav className="pager" aria-label={label + ' navigation'}>
      <button className="pg" onClick={() => go(pg.page - 1)} disabled={pg.page <= 1} aria-label="Previous page">‹</button>
      {windowed(pg.page, pg.pages).map((n, i) => n === '…'
        ? <span key={'e' + i} className="pg-gap" aria-hidden="true">…</span>
        : <button key={n} className="pg" aria-current={n === pg.page ? 'page' : undefined} aria-label={`${label} ${n}`} onClick={() => go(n)}>{unit ? unit + ' ' + n : n}</button>)}
      <button className="pg" onClick={() => go(pg.page + 1)} disabled={pg.page >= pg.pages} aria-label="Next page">›</button>
      {info && <span className="pg-info tiny muted">{pg.from}–{pg.to} of {pg.total}</span>}
    </nav>
  )
}
