import { useEffect, useState } from 'react'
import { intent } from '../nav.js'
import Quiz from './Quiz.jsx'
import Speed from './Speed.jsx'
import Cards from './Cards.jsx'

const TABS = [['quiz', 'Quiz', Quiz], ['speed', 'Speed Maths', Speed], ['cards', 'Flashcards', Cards]]

export default function Practice() {
  const [t, setT] = useState(intent.practiceTab || 'quiz')
  useEffect(() => { intent.practiceTab = null }, [])
  const Page = TABS.find((x) => x[0] === t)[2]
  return (
    <>
      <h2>Practice</h2>
      <div className="seg" role="tablist" aria-label="Practice mode">
        {TABS.map(([k, l]) => <button key={k} role="tab" className="btn ghost" aria-selected={t === k} aria-pressed={t === k} onClick={() => setT(k)}>{l}</button>)}
      </div>
      <Page key={t} />
    </>
  )
}
