import { useEffect, useMemo, useState } from 'react'
import { GlobalProvider, useGlobal } from './global.jsx'
import { ExamCtx } from './exam.jsx'
import { EXAM_LIST, loadExam, loadHiPacks } from './exams.js'
import { I18nProvider, useI18n, localizeExam } from './i18n.jsx'
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
import PaperPdfs from './pages/PaperPdfs.jsx'
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
import Community from './pages/Community.jsx'
import { CloudProvider, useCloud } from './cloud.jsx'
import { SignIn } from './pages/Community.jsx'
import CloudSync from './CloudSync.jsx'
import SyncDot from './SyncDot.jsx'
import { LangSync, LangPicker } from './LangPicker.jsx'

const PAGES = {
  today: Dashboard, mission: Mission, days: Days, topics: Topics, syllabus: Syllabus, tricks: Tricks, notes: Notes, pyq: Pyq, pyqpdf: PaperPdfs, library: Library,
  resources: Resources, exam: Exam, lesson: Lesson, community: Community, quiz: Quiz, speed: Speed, cards: Cards, focus: Focus, mocks: Mocks, errors: Errors, rewards: Rewards, settings: Settings,
}
const readHash = () => {
  const [p, ...rest] = window.location.hash.replace('#/', '').replace('#', '').split('/')
  return PAGES[p] ? { page: p, param: rest.join('/') } : { page: 'today', param: '' }
}

function Shell() {
  const { g } = useGlobal()
  return <I18nProvider lang={g.lang} examId={g.exam} loadPacks={loadHiPacks}><Inner /></I18nProvider>
}

const GUEST_KEY = 'mission90-guest'
const readGuest = () => { try { return localStorage.getItem(GUEST_KEY) === '1' } catch { return false } }

// Before the app opens, ask people to sign in or create an account. "Continue without an account" keeps working offline on this device.
function AuthGate({ cloud, onSkip }) {
  const { t } = useI18n()
  const { g, set } = useGlobal()
  return (
    <>
      <header className="top"><div className="brand"><h1>Mission 90</h1><LangPicker value={g.lang} onChange={(lang) => set({ lang })} label={t('Language')} /></div></header>
      <div className="wrap" style={{ maxWidth: 520 }}>
        <main>
          <p className="small muted" style={{ margin: '4px 0' }}>{t('Sign in or create an account to open Mission 90. Your progress is saved to your account and follows you across devices.')}</p>
          <SignIn cloud={cloud} />
          <div style={{ textAlign: 'center', margin: '8px 0 24px' }}>
            <button className="btn ghost sm" onClick={onSkip}>{t('Continue without an account')}</button>
            <p className="tiny muted" style={{ margin: '6px 0 0' }}>{t('Without an account your progress stays only in this browser.')}</p>
          </div>
        </main>
      </div>
    </>
  )
}

function Inner() {
  const { g, set } = useGlobal()
  const cloud = useCloud()
  const [guest, setGuest] = useState(readGuest)
  useEffect(() => { if (cloud?.user) { try { localStorage.removeItem(GUEST_KEY) } catch { /* ignore */ } setGuest(false) } }, [cloud?.user])
  const { t, packs } = useI18n()
  const X = useMemo(() => localizeExam(loadExam(g.exam), packs), [g.exam, packs])
  const [route, setRoute] = useState(readHash)
  const { page, param } = route
  useEffect(() => {
    const on = () => { setRoute(readHash()); window.scrollTo(0, 0) }
    window.addEventListener('hashchange', on)
    return () => window.removeEventListener('hashchange', on)
  }, [])
  useEffect(() => { document.title = `Mission 90 · ${t(X.name)}` }, [X.name, t])
  const go = (p) => { window.location.hash = '#/' + p; window.scrollTo(0, 0) }
  const grp = groupOf(page === 'lesson' ? 'days' : page)
  const Page = PAGES[page]
  const skip = () => { try { localStorage.setItem(GUEST_KEY, '1') } catch { /* ignore */ } setGuest(true) }
  if (cloud?.enabled && cloud.ready && !cloud.user && !guest) return <AuthGate cloud={cloud} onSkip={skip} />
  if (cloud?.enabled && !cloud.ready) return <div className="empty" style={{ margin: 40 }}>{t('Connecting…')}</div>

  return (
    <ExamCtx.Provider value={X}>
      <Provider key={X.id}>
        <header className="top">
          <div className="brand">
            <h1>Mission 90 <SyncDot go={go} /></h1>
            <label className="examsel"><span className="sr">{t('Exam')}</span>
              <select value={g.exam} onChange={(e) => set({ exam: e.target.value })} aria-label={t('Choose exam')}>
                {EXAM_LIST.map((e) => <option key={e.id} value={e.id}>{t(e.name)}</option>)}
              </select>
            </label>
          </div>
          <nav className="tabs" role="tablist" aria-label={t('Sections')}>
            {NAV.map((n) => <button key={n.id} role="tab" aria-selected={grp.id === n.id} onClick={() => go(n.subs[0][0])}>{t(n.label)}</button>)}
          </nav>
        </header>
        <div className="wrap">
          <nav className="subnav" aria-label={t('{section} pages', { section: t(grp.label) })}>
            {grp.subs.map(([k, l]) => <button key={k} aria-current={(page === 'lesson' ? 'days' : page) === k ? 'page' : undefined} onClick={() => go(k)}>{t(l)}</button>)}
          </nav>
          <main key={page + param}><Page go={go} param={param} /></main>
        </div>
        <Toaster />
        <CloudSync />
        <LangSync />
      </Provider>
    </ExamCtx.Provider>
  )
}

export default function App() { return <GlobalProvider><CloudProvider><Shell /></CloudProvider></GlobalProvider> }
