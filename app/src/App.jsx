import { useEffect, useMemo, useState } from 'react'
import { GlobalProvider, useGlobal } from './global.jsx'
import { ExamCtx } from './exam.jsx'
import { EXAM_LIST, loadExam } from './exams.js'
import { Provider } from './store.jsx'
import { NAV, groupOf } from './nav.js'
import { Toaster } from './fx.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Mission from './pages/Mission.jsx'
import Days from './pages/Days.jsx'
import Topics from './pages/Topics.jsx'
import Syllabus from './pages/Syllabus.jsx'
import Tricks from './pages/Tricks.jsx'
import Notes from './pages/Notes.jsx'
import Pyq from './pages/Pyq.jsx'
import Library from './pages/Library.jsx'
import Resources from './pages/Resources.jsx'
import Exam from './pages/Exam.jsx'
import Quiz from './pages/Quiz.jsx'
import Speed from './pages/Speed.jsx'
import Cards from './pages/Cards.jsx'
import Focus from './pages/Focus.jsx'
import Mocks from './pages/Mocks.jsx'
import Errors from './pages/Errors.jsx'
import Rewards from './pages/Rewards.jsx'
import Settings from './pages/Settings.jsx'
import Lesson from './pages/Lesson.jsx'

const PAGES = {
  today: Dashboard, mission: Mission, days: Days, topics: Topics, syllabus: Syllabus, tricks: Tricks, notes: Notes, pyq: Pyq, library: Library,
  resources: Resources, exam: Exam, lesson: Lesson, quiz: Quiz, speed: Speed, cards: Cards, focus: Focus, mocks: Mocks, errors: Errors, rewards: Rewards, settings: Settings,
}
const readHash = () => {
  const [p, ...rest] = window.location.hash.replace('#/', '').replace('#', '').split('/')
  return PAGES[p] ? { page: p, param: rest.join('/') } : { page: 'today', param: '' }
}

function Shell() {
  const { g, set } = useGlobal()
  const X = useMemo(() => loadExam(g.exam), [g.exam])
  const [route, setRoute] = useState(readHash)
  const { page, param } = route
  useEffect(() => {
    const on = () => { setRoute(readHash()); window.scrollTo(0, 0) }
    window.addEventListener('hashchange', on)
    return () => window.removeEventListener('hashchange', on)
  }, [])
  useEffect(() => { document.title = `Mission 90 · ${X.name}` }, [X.name])
  const go = (p) => { window.location.hash = '#/' + p; window.scrollTo(0, 0) }
  const grp = groupOf(page === 'lesson' ? 'days' : page)
  const Page = PAGES[page]

  return (
    <ExamCtx.Provider value={X}>
      <Provider key={X.id}>
        <header className="top">
          <div className="brand">
            <h1>Mission 90</h1>
            <label className="examsel"><span className="sr">Exam</span>
              <select value={g.exam} onChange={(e) => set({ exam: e.target.value })} aria-label="Choose exam">
                {EXAM_LIST.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}
              </select>
            </label>
          </div>
          <nav className="tabs" role="tablist" aria-label="Sections">
            {NAV.map((n) => <button key={n.id} role="tab" aria-selected={grp.id === n.id} onClick={() => go(n.subs[0][0])}>{n.label}</button>)}
          </nav>
        </header>
        <div className="wrap">
          <nav className="subnav" aria-label={grp.label + ' pages'}>
            {grp.subs.map(([k, l]) => <button key={k} aria-current={(page === 'lesson' ? 'days' : page) === k ? 'page' : undefined} onClick={() => go(k)}>{l}</button>)}
          </nav>
          <main key={page + param}><Page go={go} param={param} /></main>
        </div>
        <Toaster />
      </Provider>
    </ExamCtx.Provider>
  )
}

export default function App() { return <GlobalProvider><Shell /></GlobalProvider> }
