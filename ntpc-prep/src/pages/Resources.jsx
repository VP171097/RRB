import { OFFICIAL, STUDY_SITES, BOOKS, VIDEOS, videoLink, searchLink } from '../data/resources.js'
import { Ext } from '../ui.jsx'

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
  return (
    <>
      <h2>Resources</h2>
      <p className="small muted" style={{ margin: 0 }}>Official and free sources are linked directly. For papers and video courses the links are searches, which keep working when sites move their files. Open links in a new tab.</p>
      <section className="card"><h3>Official</h3>{OFFICIAL.map((r) => <Item key={r.name} href={r.url} title={r.name} note={r.note} />)}</section>
      <section className="card"><h3>Study sites</h3>{STUDY_SITES.map((r) => <Item key={r.name} href={r.url} title={r.name} note={r.note} tag={r.subject} />)}</section>
      <section className="card"><h3>Books</h3>
        {BOOKS.map((b) => <Item key={b.title} href={searchLink(b.title + ' pdf OR buy')} title={b.title} note={b.use} tag={b.subject} />)}
        <p className="small muted" style={{ margin: '8px 0 0' }}>Choose one book per subject and finish it. Several half-read books help less than one revised three times.</p>
      </section>
      <section className="card"><h3>Video courses</h3>{VIDEOS.map((v) => <Item key={v.q} href={videoLink(v.q)} title={v.q} note={v.note} tag={v.subject} />)}</section>
    </>
  )
}
