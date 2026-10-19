import { useEffect, useState } from 'react'
import { useT } from './i18n.jsx'

const listeners = new Set()
export function notify(msg, kind = 'xp', vars) {
  listeners.forEach((f) => f({ id: Math.random(), msg, kind, vars }))
}

export function Toaster() {
  const tr = useT()
  const [list, setList] = useState([])
  useEffect(() => {
    const f = (t) => {
      setList((l) => [...l.slice(-2), t])
      setTimeout(() => setList((l) => l.filter((x) => x.id !== t.id)), t.kind === 'xp' ? 1700 : 3600)
    }
    listeners.add(f)
    return () => listeners.delete(f)
  }, [])
  return (
    <div className="toasts" aria-live="polite">
      {list.map((t) => <div key={t.id} className={'toast2 ' + t.kind}>{tr(t.msg, t.vars)}</div>)}
    </div>
  )
}

const reduced = () => typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches

export function confetti(n = 150) {
  if (reduced()) return
  const c = document.createElement('canvas')
  c.className = 'confetti'
  document.body.appendChild(c)
  const dpr = window.devicePixelRatio || 1
  c.width = innerWidth * dpr; c.height = innerHeight * dpr
  const ctx = c.getContext('2d'); ctx.scale(dpr, dpr)
  const colors = ['#f2b52e', '#4cc98a', '#6ea8ff', '#ff7b71', '#b794f6', '#2dd4bf']
  const ps = Array.from({ length: n }, () => ({
    x: innerWidth / 2 + (Math.random() - 0.5) * 140, y: innerHeight * 0.4,
    vx: (Math.random() - 0.5) * 13, vy: -Math.random() * 13 - 4, s: 5 + Math.random() * 6,
    r: Math.random() * 6, vr: (Math.random() - 0.5) * 0.4, c: colors[(Math.random() * colors.length) | 0],
  }))
  let t = 0
  const frame = () => {
    ctx.clearRect(0, 0, innerWidth, innerHeight)
    ps.forEach((p) => {
      p.vy += 0.35; p.x += p.vx; p.y += p.vy; p.vx *= 0.99; p.r += p.vr
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.r); ctx.fillStyle = p.c; ctx.fillRect(-p.s / 2, -p.s / 3, p.s, (p.s * 2) / 3); ctx.restore()
    })
    if (++t < 130) requestAnimationFrame(frame); else c.remove()
  }
  frame()
}

let ac = null
let soundOn = true
export const setSound = (v) => { soundOn = v }
export function sfx(kind) {
  if (!soundOn) return
  try {
    ac ||= new (window.AudioContext || window.webkitAudioContext)()
    const seq = { tick: [660], ok: [523, 784], bad: [196], level: [523, 659, 784, 1047], done: [784, 988, 1175] }[kind] || [660]
    seq.forEach((f, i) => {
      const t0 = ac.currentTime + i * 0.09
      const o = ac.createOscillator(), g = ac.createGain()
      o.type = 'sine'; o.frequency.value = f
      g.gain.setValueAtTime(0.0001, t0)
      g.gain.exponentialRampToValueAtTime(0.1, t0 + 0.01)
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.2)
      o.connect(g); g.connect(ac.destination)
      o.start(t0); o.stop(t0 + 0.22)
    })
  } catch { /* audio unavailable */ }
}
