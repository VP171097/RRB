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

// One note: frequency, start offset (s), length (s), wave and loudness.
const N = (f, at, dur = 0.22, type = 'sine', vol = 0.1) => ({ f, at, dur, type, vol })
const arp = (fs, step, dur, type, vol) => fs.map((f, i) => N(f, i * step, dur, type, vol))
const SOUNDS = {
  tick: [N(660, 0)],
  ok: [N(523, 0), N(784, 0.09)],
  bad: [N(196, 0)],
  level: arp([523, 659, 784, 1047], 0.09),
  done: arp([784, 988, 1175], 0.09),
  // A tap on a sub-topic: a bright two-note chime.
  sub: [N(880, 0, 0.18, 'triangle', 0.12), N(1175, 0.08, 0.3, 'triangle', 0.12)],
  // A topic finished: a rising run that lands on a chord.
  topic: [...arp([523, 659, 784, 1047], 0.08, 0.2, 'triangle', 0.12), N(1047, 0.34, 0.6, 'triangle', 0.1), N(1319, 0.34, 0.6, 'triangle', 0.1), N(1568, 0.34, 0.6, 'triangle', 0.09)],
  // A milestone or the timer finishing: a fanfare with a final chord and a burst of applause.
  celebrate: [...arp([523, 659, 784, 1047, 1319], 0.1, 0.22, 'triangle', 0.13), N(1047, 0.55, 0.9, 'triangle', 0.11), N(1319, 0.55, 0.9, 'triangle', 0.1), N(1568, 0.55, 0.9, 'triangle', 0.1), N(2093, 0.55, 0.9, 'sine', 0.05)],
  win: [...arp([392, 523, 659, 784, 1047, 784, 1047, 1319], 0.11, 0.3, 'triangle', 0.14), N(1047, 1.0, 1.4, 'triangle', 0.12), N(1319, 1.0, 1.4, 'triangle', 0.11), N(1568, 1.0, 1.4, 'triangle', 0.11), N(2093, 1.0, 1.4, 'sine', 0.06)],
}
const APPLAUSE = { celebrate: [0.55, 0.7], win: [1.0, 1.2], topic: [0.34, 0.4] }

export function sfx(kind) {
  if (!soundOn) return
  try {
    ac ||= new (window.AudioContext || window.webkitAudioContext)()
    if (ac.state === 'suspended') ac.resume()
    const base = ac.currentTime
    ;(SOUNDS[kind] || SOUNDS.tick).forEach(({ f, at, dur, type, vol }) => {
      const t0 = base + at
      const o = ac.createOscillator(), g = ac.createGain()
      o.type = type; o.frequency.value = f
      g.gain.setValueAtTime(0.0001, t0)
      g.gain.exponentialRampToValueAtTime(vol, t0 + 0.012)
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur)
      o.connect(g); g.connect(ac.destination)
      o.start(t0); o.stop(t0 + dur + 0.02)
    })
    const ap = APPLAUSE[kind]
    if (ap) {
      // Short filtered noise, like a quick round of applause.
      const len = Math.round(ac.sampleRate * ap[1])
      const buf = ac.createBuffer(1, len, ac.sampleRate)
      const d = buf.getChannelData(0)
      for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len)
      const src = ac.createBufferSource(), bp = ac.createBiquadFilter(), g = ac.createGain()
      src.buffer = buf; bp.type = 'bandpass'; bp.frequency.value = 3200; bp.Q.value = 0.7
      g.gain.setValueAtTime(0.0001, base + ap[0]); g.gain.exponentialRampToValueAtTime(0.09, base + ap[0] + 0.05); g.gain.exponentialRampToValueAtTime(0.0001, base + ap[0] + ap[1])
      src.connect(bp); bp.connect(g); g.connect(ac.destination)
      src.start(base + ap[0])
    }
  } catch { /* audio unavailable */ }
}
