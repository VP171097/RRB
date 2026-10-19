import { useState } from 'react'
import { useExam } from '../exam.jsx'
import { videoLink, searchLink } from '../../../RRB_Graduate/resources.js'
import { Ext } from '../ui.jsx'
import { Pager, usePaged } from '../pager.jsx'

function Item({ href, title, note, tag }) {
  return (
    <div className="res">
      <div className="row" style={{ justifyContent: 'space-between', flexWrap: 'nowrap' }}>
        {href ? <Ext href={href}>{title}</Ext> : <b>{title}</b>}
        {tag && <span className="chip">{tag}</span>}
      </div>
      {note && <span className="small muted">{note}</span>}
    </div>
  )
}

export default function Resources() {
  const { RES } = useExam()
  const [tab, setTab] = useState('official')
  const tabs = {
    official: RES.OFFICIAL.map((r) => ({ href: r.url, title: r.name, note: r.note })),
    sites: RES.STUDY_SITES.map((r) => ({ href: r.url, title: r.name, note: r.note, tag: r.subject })),
    books: RES.BOOKS.map((b) => ({ href: searchLink(b.title + ' pdf OR buy'), title: b.title, note: b.use, tag: b.subject })),
    videos: RES.VIDEOS.map((v) => ({ href: videoLink(v.q), title: v.q, note: v.note, tag: v.subject })),
  }
  const pg = usePaged(tabs[tab], 6)
  const L = [['official', 'Official'], ['sites', 'Study sites'], ['books', 'Books'], ['videos', 'Videos']]
  return (
    <>
      <h2>Links and resources</h2>
      <p className="small muted" style={{ margin: 0 }}>Official and free sources link directly. Papers, books and video courses are searches, which keep working when sites move files.</p>
      <div className="seg" role="group" aria-label="Type">
        {L.map(([k, l]) => <button key={k} className="btn ghost sm" aria-pressed={tab === k} onClick={() => { setTab(k); pg.setPage(1) }}>{l}</button>)}
      </div>
      <section className="card">{pg.items.map((r) => <Item key={r.title} {...r} />)}</section>
      <Pager pg={pg} label="Links page" />
      {tab === 'books' && <p className="small muted" style={{ margin: 0 }}>Choose one book per subject and finish it. Several half-read books help less than one revised three times.</p>}
    </>
  )
}
