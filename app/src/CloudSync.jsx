import { useEffect, useRef } from 'react'
import { useCloud, nicknameOf } from './cloud.jsx'
import { useApp } from './store.jsx'
import { useExam } from './exam.jsx'
import { notify } from './fx.jsx'
import { mockTotal, pct } from './lib.js'

// Keeps the signed-in person's progress for the current exam in Supabase.
// Newer copy wins: on sign-in the cloud copy is loaded if it is newer; otherwise the local copy is uploaded.
export const SYNC_KEY = 'mission90-sync-status'
const setStatus = (s) => { try { localStorage.setItem(SYNC_KEY, JSON.stringify({ s, at: Date.now() })); window.dispatchEvent(new Event('mission90-sync')) } catch { /* ignore */ } }

export default function CloudSync() {
  const cloud = useCloud()
  const { state, replace, xp, streak, tasks, learned } = useApp()
  const X = useExam()
  const uid = cloud.user?.id
  const ready = useRef(false)      // true once the first pull for this user and exam is done
  const syncedT = useRef(0)        // state.t that the cloud already has
  const timer = useRef(0)
  const latest = useRef({})
  latest.current = { state, xp, streak, tasks, learned, nick: nicknameOf(cloud.user) }

  async function push() {
    const c = cloud.client
    if (!c || !uid) return
    const { state: st, xp: xpo, streak: sk, tasks: tk, learned: ln, nick } = latest.current
    setStatus('saving')
    const best = st.mocks.length ? Math.max(...st.mocks.map((m) => mockTotal(m, X.sections))) : null
    const a = await c.from('progress').upsert({ user_id: uid, exam: X.id, data: st, client_t: st.t || 0, updated_at: new Date().toISOString() }, { onConflict: 'user_id,exam' })
    const b = await c.from('summaries').upsert({ user_id: uid, exam: X.id, nickname: nick, xp: xpo.total, streak: sk, tasks_pct: pct(tk.done, tk.all), topics_learned: ln, best_mock: best, updated_at: new Date().toISOString() }, { onConflict: 'user_id,exam' })
    if (a.error || b.error) setStatus('error'); else { syncedT.current = st.t || 0; setStatus('saved') }
  }

  // First load for this person and exam.
  useEffect(() => {
    ready.current = false
    if (!cloud.client || !uid) { setStatus(uid ? 'offline' : 'signedout'); return }
    let live = true
    ;(async () => {
      setStatus('saving')
      const { data, error } = await cloud.client.from('progress').select('data, client_t').eq('user_id', uid).eq('exam', X.id).maybeSingle()
      if (!live) return
      if (error) { setStatus('error'); return }
      const local = latest.current.state
      if (data && (data.client_t || 0) > (local.t || 0)) {
        if (local.t) { try { localStorage.setItem(`mission90-${X.id}-before-sync`, JSON.stringify(local)) } catch { /* ignore */ } }
        replace({ ...data.data, t: data.client_t }, true)
        syncedT.current = data.client_t
        setStatus('saved')
        notify('Loaded your saved progress from the cloud')
      } else {
        syncedT.current = data ? data.client_t || 0 : -1
        await push()
      }
      ready.current = true
    })()
    return () => { live = false }
  }, [uid, cloud.client, X.id]) // eslint-disable-line react-hooks/exhaustive-deps

  // Upload shortly after each change.
  useEffect(() => {
    if (!ready.current || !uid || !cloud.client) return
    if ((state.t || 0) <= syncedT.current) return
    clearTimeout(timer.current)
    timer.current = setTimeout(push, 2000)
    return () => clearTimeout(timer.current)
  }, [state.t]) // eslint-disable-line react-hooks/exhaustive-deps

  // Upload when the tab is hidden, so closing the page does not lose the last minute of work.
  useEffect(() => {
    const on = () => { if (document.visibilityState === 'hidden' && ready.current && (latest.current.state.t || 0) > syncedT.current) push() }
    document.addEventListener('visibilitychange', on)
    return () => document.removeEventListener('visibilitychange', on)
  }) // eslint-disable-line react-hooks/exhaustive-deps

  return null
}
