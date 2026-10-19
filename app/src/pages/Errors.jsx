import { useState } from 'react'
import { useApp } from '../store.jsx'
import { useExam } from '../exam.jsx'
import { Bar } from '../ui.jsx'
import { Pager, usePaged } from '../pager.jsx'
import { useT } from '../i18n.jsx'
import { fmt, parse, todayIso, uid, iso, addDays } from '../lib.js'

const blankForm = (SUBS, CAUSES) => ({ sub: SUBS[0], cause: CAUSES[0], topic: '', note: '' })

export default function Errors() {
  const t = useT()
  const { state, update } = useApp()
  const { SUBS, CAUSES } = useExam()
  const [f, setF] = useState(() => blankForm(SUBS, CAUSES))
  const [filter, setFilter] = useState('open')
  const today = todayIso()
  const due = state.errors.filter((e) => !e.done && e.revisit <= today).length
  const counts = Object.fromEntries(CAUSES.map((c) => [c, state.errors.filter((e) => e.cause === c).length]))
  const mx = Math.max(1, ...Object.values(counts))
  const list = state.errors.filter((e) => filter === 'all' || !e.done).sort((a, b) => (a.revisit < b.revisit ? -1 : 1))
  const pg = usePaged(list, 6)
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value })
  const patch = (id, fn) => update((s) => { const x = s.errors.find((e) => e.id === id); if (x) fn(x) })
  return (
    <>
      <h2>{t('Error log')}</h2>
      <p className="small muted" style={{ margin: 0 }}>{t('Log every wrong, skipped or lucky-guess question from a mock. Revisit it a week later and redo it without notes.')}</p>
      {state.errors.length > 0 && (
        <section className="card"><h3>{t('Where marks leak')}</h3>
          <div style={{ display: 'grid', gap: 8, marginTop: 10 }}>
            {CAUSES.map((c) => <div key={c}><div className="row small" style={{ justifyContent: 'space-between' }}><span>{t(c)}</span><span className="num">{counts[c]}</span></div><Bar a={counts[c]} b={mx} accent /></div>)}
          </div>
        </section>
      )}
      <section className="card">
        <h3 style={{ marginBottom: 10 }}>{t('Add an entry')}</h3>
        <form className="fgrid" onSubmit={(e) => { e.preventDefault(); update((s) => { s.errors.push({ id: uid(), sub: f.sub, cause: f.cause, topic: f.topic.trim(), note: f.note.trim(), revisit: iso(addDays(parse(today), 7)), done: false }) }); setF(blankForm(SUBS, CAUSES)) }}>
          <label className="f">{t('Subject')}<select value={f.sub} onChange={set('sub')}>{SUBS.map((s) => <option key={s} value={s}>{t(s)}</option>)}</select></label>
          <label className="f">{t('Cause')}<select value={f.cause} onChange={set('cause')}>{CAUSES.map((s) => <option key={s} value={s}>{t(s)}</option>)}</select></label>
          <label className="f" style={{ gridColumn: '1/-1' }}>{t('Topic')}<input type="text" required value={f.topic} onChange={set('topic')} placeholder={t('e.g. Compound interest, half-yearly')} /></label>
          <label className="f" style={{ gridColumn: '1/-1' }}>{t('Correct method or fact')}<textarea rows="2" required value={f.note} onChange={set('note')} /></label>
          <div style={{ gridColumn: '1/-1' }}><button className="btn" type="submit">{t('Add to log')}</button></div>
        </form>
      </section>
      <div className="row" style={{ justifyContent: 'space-between' }}>
        <h3>{t('Entries')} ({state.errors.length}) {due > 0 && <span className="pill bad">{t('{n} due', { n: due })}</span>}</h3>
        <div className="seg"><button className="btn ghost sm" aria-pressed={filter === 'open'} onClick={() => setFilter('open')}>{t('Open')}</button><button className="btn ghost sm" aria-pressed={filter === 'all'} onClick={() => setFilter('all')}>{t('All')}</button></div>
      </div>
      <section className="card">
        {list.length ? pg.items.map((e) => {
          const isDue = !e.done && e.revisit <= today
          return (
            <div className="mock" key={e.id} style={{ gridTemplateColumns: '1fr' }}>
              <div>
                <span className="chip">{t(e.sub)}</span> <span className="chip">{t(e.cause)}</span>{' '}
                {e.done ? <span className="pill ok">{t('Mastered')}</span> : isDue ? <span className="pill bad">{t('Revisit now')}</span> : <span className="small muted">{t('Revisit {date}', { date: fmt(parse(e.revisit)) })}</span>}
                <div style={{ marginTop: 4 }}><b>{e.topic}</b></div>
                <div className="small">{e.note}</div>
                <div className="row" style={{ marginTop: 6 }}>
                  <button className="btn ghost sm" onClick={() => patch(e.id, (x) => { x.done = !x.done })}>{t(e.done ? 'Reopen' : 'Redone correctly')}</button>
                  {!e.done && <button className="btn ghost sm" onClick={() => patch(e.id, (x) => { x.revisit = iso(addDays(parse(today), 7)) })}>{t('Push 7 days')}</button>}
                  <button className="btn ghost sm" onClick={() => update((s) => { s.errors = s.errors.filter((x) => x.id !== e.id) })}>{t('Delete')}</button>
                </div>
              </div>
            </div>
          )
        }) : <div className="empty">{t(state.errors.length ? 'Nothing open. Switch to All to see mastered entries.' : 'No entries yet. Your first mock will fill this.')}</div>}
        <Pager pg={pg} label={t('Error page')} />
      </section>
    </>
  )
}
