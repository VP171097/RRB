import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { SUPABASE_URL, SUPABASE_ANON_KEY, ENABLE_GOOGLE } from './cloud-config.js'
export const googleEnabled = ENABLE_GOOGLE

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

// Turns Supabase's messages into plain language.
export function friendly(msg = '') {
  const m = msg.toLowerCase()
  if (m.includes('invalid login')) return 'Wrong email, phone number or password.'
  if (m.includes('already registered') || m.includes('already been registered')) return 'That email or phone number already has an account. Try signing in.'
  if (m.includes('email not confirmed')) return 'This account is not confirmed yet. Email accounts: open the link we emailed. Phone accounts: the site owner needs to turn off "Confirm email".'
  if (m.includes('rate limit') || m.includes('too many')) return 'Too many emails sent. Wait a few minutes and try again.'
  if (m.includes('password should be')) return 'Choose a longer password (at least 8 characters).'
  if (m.includes('same password')) return 'Choose a password you have not used before.'
  if (m.includes('failed to fetch') || m.includes('network')) return 'Could not reach the cloud service. Check your connection.'
  return msg || 'Something went wrong.'
}

// Accepts an email or a phone number. Phone numbers without a country code are treated as Indian (+91).
export function parseId(raw) {
  const t = (raw || '').trim()
  if (t.includes('@')) return /^\S+@\S+\.\S+$/.test(t) ? { email: t.toLowerCase() } : { error: 'Enter a valid email address.' }
  const digits = t.replace(/[^\d]/g, '')
  if (!digits) return { error: 'Enter an email or a phone number.' }
  let n = t.startsWith('+') ? digits : digits.length === 10 ? '91' + digits : digits.length === 11 && digits.startsWith('0') ? '91' + digits.slice(1) : digits
  if (n.length < 11 || n.length > 15) return { error: 'Enter a 10-digit mobile number, or a number with its country code like +91 98765 43210.' }
  return { phone: '+' + n }
}
// Phone numbers sign in with a password only (no SMS/OTP): the number becomes a private email-style
// login name, so only Supabase's Email provider is needed.
const PHONE_DOMAIN = 'phone.mission90.app'
export const idKey = (id) => ({ email: id.phone ? id.phone.replace('+', '') + '@' + PHONE_DOMAIN : id.email })
const phoneOf = (email = '') => (email.endsWith('@' + PHONE_DOMAIN) ? '+' + email.split('@')[0] : '')

const cleanName = (s) => (s || '').replace(/[^\p{L}\p{N} ._-]/gu, '').trim().slice(0, 24)
export const nicknameOf = (user) => cleanName(user?.user_metadata?.nickname) || (phoneOf(user?.email) ? '' : cleanName((user?.email || '').split('@')[0])) || 'Learner'
export const accountLabel = (user) => phoneOf(user?.email) || user?.email || ''

export function CloudProvider({ children }) {
  const [client, setClient] = useState(null)
  const [ready, setReady] = useState(!cloudConfigured)
  const [user, setUser] = useState(null)
  const [error, setError] = useState('')
  const [recovery, setRecovery] = useState(false)
  const alive = useRef(true)

  useEffect(() => {
    alive.current = true
    let sub
    getClient().then(async (c) => {
      if (!alive.current || !c) return
      setClient(c)
      const { data } = await c.auth.getSession()
      if (alive.current) { setUser(data.session?.user || null); setReady(true) }
      sub = c.auth.onAuthStateChange((e, session) => { if (!alive.current) return; setUser(session?.user || null); if (e === 'PASSWORD_RECOVERY') setRecovery(true) }).data.subscription
    }).catch(() => { if (alive.current) { setError('Could not reach the cloud service.'); setReady(true) } })
    return () => { alive.current = false; sub?.unsubscribe() }
  }, [])

  const api = useMemo(() => {
    const redirect = window.location.origin + window.location.pathname
    const wrap = async (fn) => { setError(''); try { return await fn() } catch (e) { setError(friendly(e.message)); throw e } }
    return {
      signInEmail: (email) => wrap(async () => { const { error: e } = await client.auth.signInWithOtp({ email, options: { emailRedirectTo: redirect } }); if (e) throw e }),
      signUp: (id, password, nickname) => wrap(async () => {
        const { data, error: e } = await client.auth.signUp({ ...idKey(id), password, options: { data: { nickname: cleanName(nickname) }, emailRedirectTo: redirect } })
        if (e) throw e
        return { needsConfirm: !data.session }
      }),
      signInPassword: (id, password) => wrap(async () => { const { error: e } = await client.auth.signInWithPassword({ ...idKey(id), password }); if (e) throw e }),
      resetPassword: (email) => wrap(async () => { const { error: e } = await client.auth.resetPasswordForEmail(email, { redirectTo: redirect }); if (e) throw e }),
      updatePassword: (password) => wrap(async () => { const { error: e } = await client.auth.updateUser({ password }); if (e) throw e; setRecovery(false) }),
      signInGoogle: () => wrap(async () => { const { error: e } = await client.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: redirect } }); if (e) throw e }),
      signOut: () => wrap(async () => { await client.auth.signOut() }),
      setNickname: (n) => wrap(async () => { const { data, error: e } = await client.auth.updateUser({ data: { nickname: cleanName(n) } }); if (e) throw e; setUser(data.user) }),
    }
  }, [client])

  const value = useMemo(() => ({ enabled: cloudConfigured, ready, client, user, error, setError, recovery, ...api }), [ready, client, user, error, recovery, api])
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}
