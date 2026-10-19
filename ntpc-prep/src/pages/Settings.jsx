import { useRef, useState } from 'react'
import { useApp } from '../store.jsx'
import { fmt } from '../lib.js'
import { TOTAL } from '../data/plan.js'

export default function Settings() {
  const { state, update, replace, saveError, dateOf } = useApp()
  const file = useRef(null)
  const [msg, setMsg] = useState('')
  const [confirm, setConfirm] = useState(false)
  const flash = (t) => { setMsg(t); setTimeout(() => setMsg(''), 2500) }

  const exportData = () => {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `ntpc-prep-backup-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    setTimeout(() => URL.revokeObjectURL(a.href), 1000)
  }
  const importData = async (e) => {
    const f = e.target.files?.[0]; if (!f) return
    try {
      const j = JSON.parse(await f.text())
      if (!j || typeof j !== 'object' || !j.done || !j.settings) throw new Error('shape')
      replace(j); flash('Backup restored')
    } catch { flash('That file is not a valid backup') }
    e.target.value = ''
  }

  return (
    <>
      <h2>Settings</h2>
      {saveError && <div className="card" style={{ borderColor: 'var(--bad)' }}>Your browser blocked saving. Progress will be lost when you close the tab. Export a backup now.</div>}
      <section className="card">
        <h3>Plan start date</h3>
        <p className="small muted" style={{ margin: '4px 0 10px' }}>Day 1 of the {TOTAL}-day plan. Ticks stay attached to their day number when you change this.</p>
        <div className="row"><input type="date" style={{ maxWidth: 200 }} value={state.start} aria-label="Start date" onChange={(e) => e.target.value && update((s) => { s.start = e.target.value })} /><span className="small muted">Day {TOTAL} falls on {fmt(dateOf(TOTAL))}</span></div>
      </section>
      <section className="card">
        <h3>Daily study target</h3>
        <div className="row" style={{ marginTop: 8 }}><input type="number" min="1" max="16" step="0.5" style={{ maxWidth: 100 }} aria-label="Hours per day" value={state.settings.dailyHours} onChange={(e) => update((s) => { s.settings.dailyHours = Math.max(1, +e.target.value || 1) })} /><span className="small muted">hours a day</span></div>
      </section>
      <section className="card">
        <h3>Theme</h3>
        <div className="seg" style={{ marginTop: 8 }}>
          {['system', 'light', 'dark'].map((t) => <button key={t} className="btn ghost sm" aria-pressed={state.settings.theme === t} onClick={() => update((s) => { s.settings.theme = t })}>{t[0].toUpperCase() + t.slice(1)}</button>)}
        </div>
      </section>
      <section className="card">
        <h3>Backup</h3>
        <p className="small muted" style={{ margin: '4px 0 10px' }}>Progress is stored in this browser on this device. Export a file now and then, and import it to move to another device or browser.</p>
        <div className="row">
          <button className="btn" onClick={exportData}>Export backup</button>
          <button className="btn ghost" onClick={() => file.current?.click()}>Import backup</button>
          <input ref={file} type="file" accept="application/json,.json" hidden onChange={importData} />
        </div>
      </section>
      <section className="card">
        <h3>Reset</h3>
        <p className="small muted" style={{ margin: '4px 0 10px' }}>Deletes all progress on this device.</p>
        {confirm
          ? <div className="row"><button className="btn" style={{ background: 'var(--bad)' }} onClick={() => { replace({}); setConfirm(false); flash('Progress cleared') }}>Yes, delete everything</button><button className="btn ghost" onClick={() => setConfirm(false)}>Cancel</button></div>
          : <button className="btn ghost" onClick={() => setConfirm(true)}>Reset progress</button>}
      </section>
      {msg && <div className="toast" role="status">{msg}</div>}
    </>
  )
}
