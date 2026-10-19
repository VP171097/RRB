import { useRef, useState } from 'react'
import { useApp } from '../store.jsx'
import { useExam } from '../exam.jsx'
import { useGlobal } from '../global.jsx'
import { fmt, addDays, parse, iso } from '../lib.js'
import { MIN_DAYS, MAX_DAYS } from '../plan.js'
import { useT } from '../i18n.jsx'
import { LangPicker, useSetLang } from '../LangPicker.jsx'
import { InstallButton } from '../install.jsx'

const PALETTES = [['ocean', 'Ocean', '#0b3d91'], ['sunrise', 'Sunrise', '#c2410c'], ['forest', 'Forest', '#15803d'], ['violet', 'Violet', '#6d28d9'], ['rose', 'Rose', '#be185d']]

export default function Settings() {
  const { state, update, replace, saveError, dateOf } = useApp()
  const { TOTAL, name, id, SUBJECTS } = useExam()
  const { g, set } = useGlobal()
  const t = useT()
  const setLang = useSetLang()
  const file = useRef(null)
  const [msg, setMsg] = useState('')
  const [confirm, setConfirm] = useState(false)
  const rawDays = (() => { const e = state.settings.examDate; if (!e) return 91; const [a, b] = [state.start.split('-'), e.split('-')]; return Math.round((Date.UTC(+b[0], +b[1] - 1, +b[2]) - Date.UTC(+a[0], +a[1] - 1, +a[2])) / 864e5) + 1 })()
  const studyDays = Math.max(1, (Math.round((TOTAL - (TOTAL >= 21 ? 7 : 3)) * (5 / 12)) * 6) / 7)
  const topicsPerDay = Math.max(...SUBJECTS.map((s) => s.list1.length)) / studyDays
  const flash = (m) => { setMsg(t(m)); setTimeout(() => setMsg(''), 2500) }

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
      <h2>{t('Settings')}</h2>
      {saveError && <div className="card" style={{ borderColor: 'var(--bad)' }}>{t('Your browser blocked saving. Progress will be lost when you close the tab. Export a backup now.')}</div>}

      <section className="card">
        <h3>{t(name)}</h3>
        <p className="small muted" style={{ margin: '2px 0 12px' }}>{t('These apply to this exam only.')}</p>
        <div className="fgrid">
          <label className="f">{t('Plan start (day 1)')}<input type="date" value={state.start} onChange={(e) => e.target.value && update((s) => { s.start = e.target.value })} /></label>
          <label className="f">{t('Exam date (last day of the plan)')}<input type="date" value={state.settings.examDate || iso(addDays(parse(state.start), 90))} min={iso(addDays(parse(state.start), MIN_DAYS - 1))} onChange={(e) => update((s) => { s.settings.examDate = e.target.value })} /></label>
          <label className="f">{t('Study hours a day')}<input type="number" min="1" max="16" step="0.5" value={state.settings.dailyHours} onChange={(e) => update((s) => { s.settings.dailyHours = Math.max(1, Math.min(16, +e.target.value || 1)) })} /></label>
        </div>
        <p className="small" style={{ margin: '10px 0 0' }}><b>{t('Your plan: {n} days ({w} weeks)', { n: TOTAL, w: Math.round((TOTAL / 7) * 10) / 10 })}</b></p>
        <p className="small muted" style={{ margin: '4px 0 0' }}>{t('The plan has {n} days from the start date to the exam date, split into foundation, practice, previous-year papers, mocks and a final week. Task times are sized to {h} hours a day. Day {n} falls on {date}.', { n: TOTAL, h: state.settings.dailyHours, date: fmt(dateOf(TOTAL)) })}</p>
        {rawDays < MIN_DAYS && <p className="small" style={{ margin: '6px 0 0', color: 'var(--bad)' }}>{t('The plan needs at least {n} days. Pick a later exam date.', { n: MIN_DAYS })}</p>}
        {rawDays > MAX_DAYS && <p className="small" style={{ margin: '6px 0 0', color: 'var(--bad)' }}>{t('Plans longer than {n} days are shortened to {n} days.', { n: MAX_DAYS })}</p>}
        {topicsPerDay > 2 && <p className="small" style={{ margin: '6px 0 0', color: 'var(--bad)' }}>{t('Tight plan: about {n} topics per subject each study day. A later exam date gives you more room.', { n: Math.round(topicsPerDay * 10) / 10 })}</p>}
        <p className="small muted" style={{ margin: '6px 0 0' }}>{t('Changing the dates rebuilds the plan. Ticks stay attached to their day and task number, so they may move to different work.')}</p>
      </section>

      <section className="card">
        <h3>{t('Install the app')}</h3>
        <p className="small muted" style={{ margin: '2px 0 8px' }}>{t('Add Mission RRB to your home screen or desktop. It opens like an app and keeps working offline with your last saved data.')}</p>
        <InstallButton className="btn" />
      </section>

      <section className="card">
        <h3>{t('Language')}</h3>
        <p className="small muted" style={{ margin: '2px 0 8px' }}>{t('Everything on the site, including lessons, switches to this language. It is saved on your account if you are signed in.')}</p>
        <LangPicker value={g.lang} onChange={setLang} label={t('Language')} />
      </section>

      <section className="card">
        <h3>{t('Appearance')}</h3>
        <p className="small muted" style={{ margin: '2px 0 8px' }}>{t('Shared by all three exams.')}</p>
        <div className="palettes" role="group" aria-label={t('Palette')}>
          {PALETTES.map(([k, l, c]) => <button key={k} className="pal" aria-pressed={g.palette === k} onClick={() => set({ palette: k })}><i style={{ background: c }} />{t(l)}</button>)}
        </div>
        <div className="seg" style={{ marginTop: 12 }} role="group" aria-label={t('Light or dark')}>
          {['system', 'light', 'dark'].map((k) => <button key={k} className="btn ghost sm" aria-pressed={g.theme === k} onClick={() => set({ theme: k })}>{t(k[0].toUpperCase() + k.slice(1))}</button>)}
        </div>
        <label className="sub" style={{ marginTop: 10 }}><input type="checkbox" checked={g.sound !== false} onChange={(e) => set({ sound: e.target.checked })} /><span className="box" /><span className="tx">{t('Short sounds for XP, quiz answers and celebrations')}</span></label>
      </section>

      <section className="card">
        <h3>{t('Your data')}</h3>
        <p className="small muted" style={{ margin: '2px 0 10px' }}>{t('Progress for {name} is stored in this browser. Export a backup now and then, and import it to move to another device.', { name: t(name) })}</p>
        <div className="row">
          <button className="btn" onClick={exportData}>{t('Export backup')}</button>
          <button className="btn ghost" onClick={() => file.current?.click()}>{t('Import backup')}</button>
          <input ref={file} type="file" accept="application/json,.json" hidden onChange={importData} />
        </div>
        <div style={{ marginTop: 14, paddingTop: 12, borderTop: '1px solid var(--line)' }}>
          {confirm
            ? <div className="row"><button className="btn" style={{ background: 'var(--bad)' }} onClick={() => { replace({}); setConfirm(false); flash('Progress cleared') }}>{t('Yes, delete {name} progress', { name: t(name) })}</button><button className="btn ghost" onClick={() => setConfirm(false)}>{t('Cancel')}</button></div>
            : <button className="btn ghost" onClick={() => setConfirm(true)}>{t('Reset {name} progress', { name: t(name) })}</button>}
        </div>
      </section>
      {msg && <div className="toast" role="status">{msg}</div>}
    </>
  )
}
