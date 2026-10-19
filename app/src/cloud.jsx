import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { SUPABASE_URL, SUPABASE_ANON_KEY } from './cloud-config.js'

export const cloudConfigured = !!(SUPABASE_URL && SUPABASE_ANON_KEY)

let clientPromise = null
// The Supabase library is only downloaded when the project is configured.
export function getClient() {
  if (!cloudConfigured) return Promise.resolve(null)
  clientPromise ||= import('@supabase/supabase-js').then(({ createClient }) =>
    createClient(SUPABASE_URL, SUPABASE_ANON_KEY, { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true, flowType: 'pkce' } }))
  return clientPromise
}

const Ctx = createContext(null)
export const useCloud = () => useContext(Ctx)

const cleanName = (s) => (s || '').replace(/[^\p{L}\p{N} ._-]/gu, '').trim().slice(0, 24)
export const nicknameOf = (user) => cleanName(user?.user_metadata?.nickname) || cleanName((user?.email || '').split('@')[0]) || 'Learner'

export function CloudProvider({ children }) {
  const [client, setClient] = useState(null)
  const [ready, setReady] = useState(!cloudConfigured)
  const [user, setUser] = useState(null)
  const [error, setError] = useState('')
  const alive = useRef(true)

  useEffect(() => {
    alive.current = true
    let sub
    getClient().then(async (c) => {
      if (!alive.current || !c) return
      setClient(c)
      const { data } = await c.auth.getSession()
      if (alive.current) { setUser(data.session?.user || null); setReady(true) }
      sub = c.auth.onAuthStateChange((_e, session) => { if (alive.current) setUser(session?.user || null) }).data.subscription
    }).catch(() => { if (alive.current) { setError('Could not reach the cloud service.'); setReady(true) } })
    return () => { alive.current = false; sub?.unsubscribe() }
  }, [])

  const api = useMemo(() => {
    const redirect = window.location.origin + window.location.pathname
    const wrap = async (fn) => { setError(''); try { return await fn() } catch (e) { setError(e.message || 'Something went wrong'); throw e } }
    return {
      signInEmail: (email) => wrap(async () => { const { error: e } = await client.auth.signInWithOtp({ email, options: { emailRedirectTo: redirect } }); if (e) throw e }),
      signInGoogle: () => wrap(async () => { const { error: e } = await client.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: redirect } }); if (e) throw e }),
      signOut: () => wrap(async () => { await client.auth.signOut() }),
      setNickname: (n) => wrap(async () => { const { data, error: e } = await client.auth.updateUser({ data: { nickname: cleanName(n) } }); if (e) throw e; setUser(data.user) }),
    }
  }, [client])

  const value = useMemo(() => ({ enabled: cloudConfigured, ready, client, user, error, setError, ...api }), [ready, client, user, error, api])
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}
