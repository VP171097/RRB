import { useEffect, useState } from 'react'
import { Provider } from './store.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Days from './pages/Days.jsx'
import Topics from './pages/Topics.jsx'
import Syllabus from './pages/Syllabus.jsx'
import Exam from './pages/Exam.jsx'
import Resources from './pages/Resources.jsx'
import Pyq from './pages/Pyq.jsx'
import Library from './pages/Library.jsx'
import Mocks from './pages/Mocks.jsx'
import Errors from './pages/Errors.jsx'
import Notes from './pages/Notes.jsx'
import Log from './pages/Log.jsx'
import Settings from './pages/Settings.jsx'

const PAGES = [
  ['today', 'Today', Dashboard], ['days', 'Days', Days], ['topics', 'Topics', Topics], ['syllabus', 'Syllabus', Syllabus],
  ['exam', 'Exam', Exam], ['pyq', 'PYQs', Pyq], ['library', 'Library', Library], ['resources', 'Resources', Resources],
  ['mocks', 'Mocks', Mocks], ['errors', 'Errors', Errors], ['notes', 'Notes', Notes], ['log', 'Study log', Log], ['settings', 'Settings', Settings],
]
const ids = PAGES.map((p) => p[0])
const readHash = () => { const h = window.location.hash.replace('#/', '').replace('#', ''); return ids.includes(h) ? h : 'today' }

function Shell() {
  const [page, setPage] = useState(readHash)
  useEffect(() => {
    const on = () => setPage(readHash())
    window.addEventListener('hashchange', on)
    return () => window.removeEventListener('hashchange', on)
  }, [])
  const go = (p) => { window.location.hash = '#/' + p; window.scrollTo(0, 0) }
  const Page = PAGES.find((p) => p[0] === page)[2]
  return (
    <>
      <header className="top">
        <div className="brand"><h1>NTPC Prep</h1><span>RRB CEN 06/2026 · Graduate</span></div>
        <nav className="tabs" role="tablist" aria-label="Sections">
          {PAGES.map(([k, l]) => <button key={k} role="tab" aria-selected={page === k} onClick={() => go(k)}>{l}</button>)}
        </nav>
      </header>
      <div className="wrap"><main><Page go={go} /></main></div>
    </>
  )
}

export default function App() { return <Provider><Shell /></Provider> }
