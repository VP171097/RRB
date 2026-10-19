import { useState } from 'react'
import { useApp } from '../store.jsx'
import { useExam } from '../exam.jsx'
import { findLesson, topicLessons } from '../lessons.js'
import { searchLink, videoLink } from '../../../RRB_Graduate/resources.js'
import { intent } from '../nav.js'
import { Ext } from '../ui.jsx'
import { sfx } from '../fx.jsx'

// Shows x^2 as x with a superscript 2.
function Rich({ text }) {
  return text.split(/(\^-?[0-9a-z]+)/).map((part, k) => (part.startsWith('^') ? <sup key={k}>{part.slice(1)}</sup> : part))
}

const SKIP = ['mixed', 'practice', 'revision', 'basics', 'rules', 'numbers', 'number']
function noteFor(X, g, topic) {
  const has = (id) => X.NOTES.some((n) => n.id === id)
  if (g === 'Maths') return 'fx'
  if (g === 'Reasoning') return 'rs'
  if (g === 'Typing') return 'type'
  if (g === 'Science') return has('sci10') ? 'sci10' : 'sci'
  if (/railway/i.test(topic)) return 'rail'
  if (/polity/i.test(topic)) return 'pol'
  if (/physics|chemistry|biology|science/i.test(topic)) return 'sci'
  if (/computer/i.test(topic)) return 'comp'
  return has('sta') ? 'sta' : X.NOTES[0].id
}

// param is the sub-topic key "<day>.<task index>.<sub-topic index>" from the plan.
export default function Lesson({ param, go }) {
  const { state, update } = useApp()
  const X = useExam()
  const [show, setShow] = useState(false)
  const [n, i, j] = (param || '').split('.').map(Number)
  const task = X.DAYS[n - 1]?.tasks[i]
  const sub = task?.subs?.[j]
  if (!task || sub === undefined) {
    return <><h2>Lesson not found</h2><button className="btn" onClick={() => go('days')}>Back to the plan</button></>
  }
  const key = `${n}.${i}.${j}`
  const topic = task.l
  const lesson = findLesson(X.LESSONS, topic, sub)
  const parts = lesson ? [] : topicLessons(X.LESSONS, sub, X.plan.subtopics)
  const done = !!state.subdone[key]
  const words = topic.toLowerCase().split(/[^a-z]+/).filter((w) => w.length > 3 && !SKIP.includes(w))
  const tricks = X.TRICKS.filter((t) => words.some((w) => (t.topic + ' ' + t.title).toLowerCase().includes(w))).slice(0, 3)
  const noteId = noteFor(X, task.g, topic)
  const note = X.NOTES.find((x) => x.id === noteId)
  const prev = j > 0 ? j - 1 : null
  const next = j + 1 < task.subs.length ? j + 1 : null
  const nav = (jj) => { setShow(false); window.location.hash = `#/lesson/${n}.${i}.${jj}`; window.scrollTo(0, 0) }
  const cls = 's-' + (X.colorOf[task.g] || 'rev')

  return (
    <article className={'lesson ' + cls}>
      <div className="lesson-nav">
        <button className="btn ghost sm" onClick={() => go('days')}>‹ Back to plan</button>
        <span className="small muted">Day {n} · {task.g}</span>
      </div>
      <div style={{ margin: '14px 0 12px' }}>
        <span className="lab2" style={{ color: 'var(--sc)' }}>{topic} · sub-topic {j + 1} of {task.subs.length}</span>
        <h1>{sub}</h1>
      </div>
      <section className="card">
        {lesson ? (
          <>
            <div className="body">{lesson.body.map((p, k) => <p key={k}><Rich text={p} /></p>)}</div>
            {lesson.points.length > 0 && (<><h3 style={{ margin: '4px 0 8px' }}>Key points</h3><ul className="keypts">{lesson.points.map((p, k) => <li key={k}><Rich text={p} /></li>)}</ul></>)}
          </>
        ) : parts.length ? (
          <>
            <p style={{ margin: '0 0 8px' }}>Revise each part of this topic. Open a part to read its key points.</p>
            {parts.map(({ title, lesson: l }) => (
              <details key={title}>
                <summary><b>{title}</b></summary>
                <div className="in">
                  {l.body.map((p, k) => <p key={k} style={{ margin: '0 0 8px' }}><Rich text={p} /></p>)}
                  <ul className="keypts">{l.points.map((p, k) => <li key={k}><Rich text={p} /></li>)}</ul>
                  {l.q && <p className="small" style={{ margin: '8px 0 0' }}><b>Try:</b> <Rich text={l.q} /> <span className="muted">Answer: <Rich text={l.a} /></span></p>}
                </div>
              </details>
            ))}
          </>
        ) : <p style={{ margin: 0 }}>A full lesson is not written for this sub-topic yet. Use the links below, and the sheets in Notes.</p>}
      </section>
      {lesson?.q && (
        <section className="card tryit" style={{ marginTop: 12 }}>
          <span className="lab2">Try it</span>
          <p style={{ margin: '4px 0 8px' }}><Rich text={lesson.q} /></p>
          {show ? <p className="sol"><b>Worked: </b><Rich text={lesson.a} /></p> : <button className="btn ghost sm" onClick={() => { setShow(true); sfx('tick') }}>Show solution</button>}
        </section>
      )}
      <div className="row" style={{ margin: '14px 0' }}>
        <button className="btn" aria-pressed={done} onClick={() => { update((s) => { if (s.subdone[key]) delete s.subdone[key]; else s.subdone[key] = 1 }); if (!done) sfx('ok') }}>{done ? 'Marked as done' : 'Mark as done'}</button>
        {next !== null ? <button className="btn ghost" onClick={() => nav(next)}>Next: {task.subs[next]} ›</button> : <button className="btn ghost" onClick={() => go('days')}>Finish topic</button>}
        {prev !== null && <button className="btn ghost" onClick={() => nav(prev)}>‹ Previous</button>}
      </div>

      <details className="related">
        <summary><h3>Go deeper</h3></summary>
        <div className="in">
          {tricks.length > 0 && <div style={{ marginBottom: 8 }}><span className="lab2">Related tricks</span>{tricks.map((t) => <a key={t.id} className="link" href="#/tricks" onClick={() => { intent.trickQuery = t.title }}>{t.title}</a>)}</div>}
          {note && <div style={{ marginBottom: 8 }}><span className="lab2">Notes sheet</span><a className="link" href="#/notes" onClick={() => { intent.noteId = noteId }}>{note.title}</a></div>}
          <div><span className="lab2">Search online</span>
            <Ext href={videoLink(`${sub} ${topic} ${X.RES.q}`)}>Video lessons</Ext>{' '}
            <Ext href={searchLink(`${sub} ${topic} ${X.RES.q} questions pdf`)}>Practice questions</Ext>
          </div>
        </div>
      </details>
    </article>
  )
}
