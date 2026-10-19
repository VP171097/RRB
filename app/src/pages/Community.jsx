import { useCallback, useEffect, useState } from 'react'
import { useCloud, nicknameOf, googleEnabled, parseId, accountLabel } from '../cloud.jsx'
import { useExam } from '../exam.jsx'
import { useApp } from '../store.jsx'
import { Pager, usePaged } from '../pager.jsx'
import { Table } from '../ui.jsx'
import { notify } from '../fx.jsx'
import { fmt, round1 } from '../lib.js'

function SetupCard() {
  return (
    <section className="card">
      <h3>Groups are switched off</h3>
      <p className="small" style={{ margin: '6px 0 0' }}>Sign-in, cloud saving and study groups use a free Supabase project. Until it is connected, everything still works and saves in this browser.</p>
      <ol className="l small">
        <li>Create a Supabase project, then run <code>supabase/schema.sql</code> in its SQL Editor.</li>
        <li>Put the project URL and the public anon key in <code>app/src/cloud-config.js</code>.</li>
        <li>Commit and push. The step-by-step guide is in <code>supabase/SETUP.md</code>.</li>
      </ol>
    </section>
  )
}

const MIN_PW = 8

function SignIn({ cloud }) {
  const [mode, setMode] = useState('in')            // in | up | link | reset
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [busy, setBusy] = useState(false)
  const [note, setNote] = useState('')
  const [show, setShow] = useState(false)
  const switchTo = (m) => { setMode(m); setNote(''); cloud.setError('') }
  const submit = async (e) => {
    e.preventDefault(); setBusy(true); setNote(''); cloud.setError('')
    const id = parseId(email)
    try {
      if (id.error) cloud.setError(id.error)
      else if ((mode === 'link' || mode === 'reset') && id.phone) cloud.setError('Sign-in links and password resets work with an email address. Enter your email here.')
      else if (mode === 'in') await cloud.signInPassword(id, password)
      else if (mode === 'up') {
        if (password.length < MIN_PW) { cloud.setError(`Choose a password of at least ${MIN_PW} characters.`) }
        else { const r = await cloud.signUp(id, password, name); if (r.needsConfirm) setNote(id.phone ? 'Account created, but this site still asks for confirmation. Ask the site owner to turn off "Confirm email", or sign up with your email.' : 'Account created. Check your email and open the confirmation link in this browser, then sign in.') }
      } else if (mode === 'link') { await cloud.signInEmail(id.email); setNote('Check your email for a sign-in link. Open it in this same browser.') }
      else { await cloud.resetPassword(id.email); setNote('If that email has an account, a reset link is on its way. Open it in this same browser.') }
    } catch { /* the message is shown below */ }
    setBusy(false)
  }
  const titles = { in: 'Sign in', up: 'Create an account', link: 'Email me a sign-in link', reset: 'Reset your password' }
  return (
    <section className="card">
      <h3>{titles[mode]}</h3>
      <p className="small muted" style={{ margin: '4px 0 10px' }}>Your progress saves to your account and follows you across devices. Groups only see your XP, streak, task percentage and best mock score.</p>
      {(mode === 'in' || mode === 'up') && (
        <div className="seg" role="tablist" style={{ marginBottom: 10 }}>
          <button className="btn ghost sm" role="tab" aria-pressed={mode === 'in'} onClick={() => switchTo('in')}>Sign in</button>
          <button className="btn ghost sm" role="tab" aria-pressed={mode === 'up'} onClick={() => switchTo('up')}>Create account</button>
        </div>
      )}
      <form className="fgrid" onSubmit={submit}>
        {mode === 'up' && <label className="f" style={{ gridColumn: '1/-1' }}>Name on leaderboards<input type="text" maxLength={24} value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Asha" autoComplete="nickname" /></label>}
        <label className="f" style={{ gridColumn: '1/-1' }}>{mode === 'link' || mode === 'reset' ? 'Email' : 'Email or phone number'}<input type="text" inputMode={mode === 'link' || mode === 'reset' ? 'email' : 'text'} required value={email} onChange={(e) => setEmail(e.target.value)} placeholder={mode === 'link' || mode === 'reset' ? 'you@example.com' : 'you@example.com or 98765 43210'} autoComplete="username" autoCapitalize="none" spellCheck="false" />
          {(mode === 'in' || mode === 'up') && <span className="tiny muted" style={{ textTransform: 'none', letterSpacing: 0, fontFamily: 'var(--f-body)', fontWeight: 400 }}>A 10-digit number is read as an Indian mobile (+91). Use +country code for others.</span>}</label>
        {(mode === 'in' || mode === 'up') && (
          <label className="f" style={{ gridColumn: '1/-1' }}>Password
            <span className="pwrow"><input type={show ? 'text' : 'password'} required minLength={mode === 'up' ? MIN_PW : undefined} value={password} onChange={(e) => setPassword(e.target.value)} autoComplete={mode === 'up' ? 'new-password' : 'current-password'} />
              <button type="button" className="btn ghost sm" onClick={() => setShow(!show)} aria-pressed={show}>{show ? 'Hide' : 'Show'}</button></span>
            {mode === 'up' && <span className="tiny muted" style={{ textTransform: 'none', letterSpacing: 0, fontFamily: 'var(--f-body)', fontWeight: 400 }}>At least {MIN_PW} characters.</span>}
          </label>
        )}
        <div style={{ gridColumn: '1/-1' }} className="row">
          <button className="btn" type="submit" disabled={busy}>{{ in: 'Sign in', up: 'Create account', link: 'Send link', reset: 'Send reset link' }[mode]}</button>
          {googleEnabled && (mode === 'in' || mode === 'up') && <button className="btn ghost" type="button" onClick={() => cloud.signInGoogle().catch(() => {})}>Continue with Google</button>}
        </div>
      </form>
      {note && <p className="small" style={{ margin: '10px 0 0' }}>{note}</p>}
      {cloud.error && <p className="small" style={{ color: 'var(--bad)', margin: '10px 0 0' }}>{cloud.error}</p>}
      <div className="row small" style={{ marginTop: 12, gap: 14 }}>
        {mode === 'in' && <button className="linkbtn" onClick={() => switchTo('reset')}>Forgot password?</button>}
        {(mode === 'in' || mode === 'up') && <button className="linkbtn" onClick={() => switchTo('link')}>Email me a sign-in link instead</button>}
        {(mode === 'link' || mode === 'reset') && <button className="linkbtn" onClick={() => switchTo('in')}>Back to sign in</button>}
      </div>
    </section>
  )
}

function NewPassword({ cloud, embedded }) {
  const [pw, setPw] = useState('')
  const Wrap = embedded ? 'div' : 'section'
  return (
    <Wrap className={embedded ? undefined : 'card'}>
      {!embedded && <h3>Choose a new password</h3>}
      <form className="row" style={{ marginTop: 10 }} onSubmit={async (e) => { e.preventDefault(); if (pw.length < MIN_PW) { cloud.setError(`Choose a password of at least ${MIN_PW} characters.`); return } try { await cloud.updatePassword(pw); notify('Password updated') } catch { /* shown below */ } }}>
        <input type="password" required minLength={MIN_PW} value={pw} onChange={(e) => setPw(e.target.value)} placeholder="New password" aria-label="New password" autoComplete="new-password" style={{ flex: '1 1 180px' }} />
        <button className="btn" type="submit">Save password</button>
      </form>
      {cloud.error && <p className="small" style={{ color: 'var(--bad)', margin: '10px 0 0' }}>{cloud.error}</p>}
    </Wrap>
  )
}

function Board({ group, cloud, X }) {
  const [rows, setRows] = useState(null)
  const [err, setErr] = useState('')
  const load = useCallback(async () => {
    setErr('')
    const { data, error } = await cloud.client.rpc('group_leaderboard', { p_group: group.id, p_exam: X.id })
    if (error) setErr(error.message); else setRows(data)
  }, [cloud.client, group.id, X.id])
  useEffect(() => { load() }, [load])
  const pg = usePaged(rows || [], 10)
  if (err) return <p className="small" style={{ color: 'var(--bad)' }}>{err}</p>
  if (!rows) return <div className="empty">Loading…</div>
  const base = (pg.page - 1) * 10
  return (
    <>
      <div className="tbl">
        <table>
          <thead><tr><th>#</th><th>Name</th><th>XP</th><th>Streak</th><th>Tasks</th><th>Best mock</th></tr></thead>
          <tbody>
            {pg.items.map((r, i) => (
              <tr key={r.user_id} style={r.user_id === cloud.user.id ? { background: 'color-mix(in srgb, var(--accent) 10%, var(--surface))' } : undefined}>
                <td className="num">{base + i + 1}</td>
                <td><b>{r.nickname}</b>{r.user_id === cloud.user.id && <span className="chip" style={{ marginLeft: 6 }}>You</span>}</td>
                <td className="num">{r.xp}</td><td className="num">{r.streak}</td><td className="num">{r.tasks_pct}%</td><td className="num">{r.best_mock === null ? '–' : round1(+r.best_mock)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pager pg={pg} label="Leaderboard page" />
      <div className="row small muted" style={{ justifyContent: 'space-between' }}><span>Showing {X.name}. Switch the exam at the top to compare another.</span><button className="btn ghost sm" onClick={load}>Refresh</button></div>
    </>
  )
}

function Groups({ cloud, X }) {
  const [groups, setGroups] = useState(null)
  const [counts, setCounts] = useState({})
  const [open, setOpen] = useState(null)
  const [name, setName] = useState('')
  const [code, setCode] = useState('')
  const [msg, setMsg] = useState('')
  const reload = useCallback(async () => {
    const g = await cloud.client.from('groups').select('id, name, code, owner, created_at').order('created_at')
    const m = await cloud.client.from('group_members').select('group_id')
    if (g.error) { setMsg(g.error.message); setGroups([]); return }
    const c = {}; (m.data || []).forEach((r) => { c[r.group_id] = (c[r.group_id] || 0) + 1 })
    setGroups(g.data); setCounts(c)
  }, [cloud.client])
  useEffect(() => { reload() }, [reload])
  const run = async (fn, ok) => { setMsg(''); const { error } = await fn(); if (error) setMsg(error.message); else { if (ok) notify(ok); await reload() } }

  return (
    <>
      <section className="card">
        <h3>Your groups</h3>
        {groups === null && <div className="empty" style={{ marginTop: 8 }}>Loading…</div>}
        {groups?.length === 0 && <div className="empty" style={{ marginTop: 8 }}>You are not in a group yet. Create one or join with a code.</div>}
        {groups?.map((g) => (
          <div className="res" key={g.id}>
            <div className="row" style={{ justifyContent: 'space-between', flexWrap: 'nowrap' }}>
              <div><b>{g.name}</b><div className="small muted">{counts[g.id] || 1} member{(counts[g.id] || 1) > 1 ? 's' : ''} · created {fmt(new Date(g.created_at))}</div></div>
              <div className="row" style={{ flexWrap: 'nowrap' }}>
                <button className="btn sm" onClick={() => setOpen(open === g.id ? null : g.id)}>{open === g.id ? 'Hide' : 'Leaderboard'}</button>
              </div>
            </div>
            <div className="row small" style={{ marginTop: 4 }}>
              <span className="muted">Invite code</span><code className="inv">{g.code}</code>
              <button className="linkbtn" onClick={() => navigator.clipboard?.writeText(g.code).then(() => notify('Code copied')).catch(() => {})}>Copy</button>
              <button className="linkbtn" style={{ marginLeft: 'auto' }} onClick={() => run(() => cloud.client.rpc('leave_group', { p_group: g.id }), 'You left the group')}>Leave</button>
            </div>
            {open === g.id && <div style={{ marginTop: 10 }}><Board group={g} cloud={cloud} X={X} /></div>}
          </div>
        ))}
      </section>
      <section className="card">
        <h3>Create or join</h3>
        <form className="row" style={{ marginTop: 10 }} onSubmit={(e) => { e.preventDefault(); run(() => cloud.client.rpc('create_group', { p_name: name }), 'Group created').then(() => setName('')) }}>
          <input type="text" required minLength={2} maxLength={40} value={name} onChange={(e) => setName(e.target.value)} placeholder="New group name" aria-label="New group name" style={{ flex: '1 1 160px' }} />
          <button className="btn" type="submit">Create</button>
        </form>
        <form className="row" style={{ marginTop: 10 }} onSubmit={(e) => { e.preventDefault(); run(() => cloud.client.rpc('join_group', { p_code: code }), 'Joined the group').then(() => setCode('')) }}>
          <input type="text" required maxLength={6} value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} placeholder="Invite code" aria-label="Invite code" style={{ flex: '1 1 160px' }} />
          <button className="btn ghost" type="submit">Join</button>
        </form>
        {msg && <p className="small" style={{ color: 'var(--bad)', margin: '10px 0 0' }}>{msg}</p>}
      </section>
    </>
  )
}

export default function Community() {
  const cloud = useCloud()
  const X = useExam()
  const { state, replace } = useApp()
  const [nick, setNick] = useState('')
  const [confirm, setConfirm] = useState(false)
  const [rev, setRev] = useState(0)
  useEffect(() => { setNick(nicknameOf(cloud.user)) }, [cloud.user])
  const backup = (() => { try { return JSON.parse(localStorage.getItem(`mission90-${X.id}-before-sync`) || 'null') } catch { return null } })()

  return (
    <>
      <h2>Study group</h2>
      {!cloud.enabled && <SetupCard />}
      {cloud.enabled && !cloud.ready && <div className="empty">Connecting…</div>}
      {cloud.enabled && cloud.ready && !cloud.user && <SignIn cloud={cloud} />}
      {cloud.enabled && cloud.user && cloud.recovery && <NewPassword cloud={cloud} />}
      {cloud.enabled && cloud.user && (
        <>
          <section className="card">
            <div className="row" style={{ justifyContent: 'space-between' }}><h3>Your account</h3><span className="small muted">{accountLabel(cloud.user)}</span></div>
            <form className="row" style={{ marginTop: 10 }} onSubmit={async (e) => { e.preventDefault(); try { await cloud.setNickname(nick); notify('Name saved') } catch { /* shown below */ } }}>
              <label className="f" style={{ flex: '1 1 180px' }}>Name shown on leaderboards<input type="text" value={nick} maxLength={24} onChange={(e) => setNick(e.target.value)} /></label>
              <button className="btn" type="submit" style={{ alignSelf: 'end' }}>Save name</button>
            </form>
            <p className="small muted" style={{ margin: '10px 0 0' }}>Your progress for {X.name} saves to your account automatically. Your name updates on the leaderboard the next time you study.</p>
            <details style={{ marginTop: 10 }}><summary><b className="small">Change password</b></summary><div className="in"><NewPassword cloud={cloud} embedded /></div></details>
            {cloud.error && <p className="small" style={{ color: 'var(--bad)', margin: '8px 0 0' }}>{cloud.error}</p>}
            {backup && <div className="row small" style={{ marginTop: 10 }}><span className="muted">A local copy from before the last cloud load is saved.</span><button className="btn ghost sm" onClick={() => { replace(backup); notify('Local copy restored') }}>Restore it</button></div>}
          </section>
          <Groups key={rev} cloud={cloud} X={X} />
          <section className="card">
            <h3>Privacy</h3>
            <p className="small" style={{ margin: '6px 0 10px' }}>Group members see only your name, XP, streak, task percentage, topics learned and best mock score. Nobody can read your notes, errors or answers.</p>
            <div className="row">
              <button className="btn ghost" onClick={() => cloud.signOut()}>Sign out</button>
              {confirm
                ? <><button className="btn" style={{ background: 'var(--bad)' }} onClick={async () => { const { error } = await cloud.client.rpc('delete_my_data'); if (!error) { notify('Cloud data deleted'); setConfirm(false); setRev((n) => n + 1) } }}>Yes, delete my cloud data</button><button className="btn ghost" onClick={() => setConfirm(false)}>Cancel</button></>
                : <button className="btn ghost" onClick={() => setConfirm(true)}>Delete my cloud data</button>}
            </div>
            <p className="tiny muted" style={{ margin: '8px 0 0' }}>Deleting removes your saved progress, leaderboard entries and group memberships from the cloud. This device keeps its own copy.</p>
          </section>
        </>
      )}
    </>
  )
}
