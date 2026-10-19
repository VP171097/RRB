import { useRef, useState } from 'react'
import { useApp } from '../store.jsx'
import { useExam } from '../exam.jsx'
import { useGlobal } from '../global.jsx'
import { fmt } from '../lib.js'

const PALETTES = [['ocean', 'Ocean', '#0b3d91'], ['sunrise', 'Sunrise', '#c2410c'], ['forest', 'Forest', '#15803d'], ['violet', 'Violet', '#6d28d9'], ['rose', 'Rose', '#be185d']]

export default function Settings() {
  const { state, update, replace, saveError, dateOf } = useApp()
  const { TOTAL, name, id } = useExam()
  const { g, set } = useGlobal()
  const file = useRef(null)
  const [msg, setMsg] = useState('')
  const [confirm, setConfirm] = useState(false)
  const flash = (t) => { setMsg(t); setTimeout(() => setMsg(''), 2500) }

  const exportData = () => {
    const blob = new Blob([JSON.stringify({ ...state, exam: id }, null, 2)], { type: 'application/json' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `mission90-${id}-backup-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    setTimeout(() => URL.revokeObjectURL(a.href), 1000)
  }
  const importData = async (e) => {
    const f = e.target.files?.[0]; if (!f) return
    try {
      const j = JSON.parse(await f.text())
      if (!j || typeof j !== 'object' || !j.done || !j.settings) throw new Error('shape')
      if (j.exam && j.exam !== id) flash('That backup is for another exam')
      else { replace(j); flash('Backup restored') }
    } catch { flash('That file is not a valid backup') }
    e.target.value = ''
  }

  return (
    <>
      <h2>Settings</h2>
      {saveError && <div className="card" style={{ borderColor: 'var(--bad)' }}>Your browser blocked saving. Progress will be lost when you close the tab. Export a backup now.</div>}

      <section className="card">
        <h3>{name}</h3>
        <p className="small muted" style={{ margin: '2px 0 12px' }}>These apply to this exam only.</p>
        <div className="fgrid">
          <label className="f">Plan start (day 1)<input type="date" value={state.start} onChange={(e) => e.target.value && update((s) => { s.start = e.target.value })} /></label>
          <label className="f">Exam date (optional)<input type="date" value={state.settings.examDate} onChange={(e) => update((s) => { s.settings.examDate = e.target.value })} /></label>
          <label className="f">Study hours a day<input type="number" min="1" max="16" step="0.5" value={state.settings.dailyHours} onChange={(e) => update((s) => { s.settings.dailyHours = Math.max(1, +e.target.value || 1) })} /></label>
        </div>
        <p className="small muted" style={{ margin: '10px 0 0' }}>Day {TOTAL} falls on {fmt(dateOf(TOTAL))}. Ticks stay attached to their day number if you change the start date.</p>
      </section>

      <section className="card">
        <h3>Appearance</h3>
        <p className="small muted" style={{ margin: '2px 0 8px' }}>Shared by all three exams.</p>
        <div className="palettes" role="group" aria-label="Palette">
          {PALETTES.map(([k, l, c]) => <button key={k} className="pal" aria-pressed={g.palette === k} onClick={() => set({ palette: k })}><i style={{ background: c }} />{l}</button>)}
        </div>
        <div className="seg" style={{ marginTop: 12 }} role="group" aria-label="Light or dark">
          {['system', 'light', 'dark'].map((t) => <button key={t} className="btn ghost sm" aria-pressed={g.theme === t} onClick={() => set({ theme: t })}>{t[0].toUpperCase() + t.slice(1)}</button>)}
        </div>
        <label className="sub" style={{ marginTop: 10 }}><input type="checkbox" checked={g.sound !== false} onChange={(e) => set({ sound: e.target.checked })} /><span className="box" /><span className="tx">Short sounds for XP, quiz answers and celebrations</span></label>
      </section>

      <section className="card">
        <h3>Your data</h3>
        <p className="small muted" style={{ margin: '2px 0 10px' }}>Progress for {name} is stored in this browser. Export a backup now and then, and import it to move to another device.</p>
        <div className="row">
          <button className="btn" onClick={exportData}>Export backup</button>
          <button className="btn ghost" onClick={() => file.current?.click()}>Import backup</button>
          <input ref={file} type="file" accept="application/json,.json" hidden onChange={importData} />
        </div>
        <div style={{ marginTop: 14, paddingTop: 12, borderTop: '1px solid var(--line)' }}>
          {confirm
            ? <div className="row"><button className="btn" style={{ background: 'var(--bad)' }} onClick={() => { replace({}); setConfirm(false); flash('Progress cleared') }}>Yes, delete {name} progress</button><button className="btn ghost" onClick={() => setConfirm(false)}>Cancel</button></div>
            : <button className="btn ghost" onClick={() => setConfirm(true)}>Reset {name} progress</button>}
        </div>
      </section>
      {msg && <div className="toast" role="status">{msg}</div>}
    </>
  )
}
