import { useEffect, useState } from 'react'
import { useCloud } from './cloud.jsx'
import { SYNC_KEY } from './CloudSync.jsx'
import { useT } from './i18n.jsx'

// A small dot next to the title: green when saved to the cloud, amber while saving, red on a problem. Hidden when signed out.
export default function SyncDot({ go }) {
  const cloud = useCloud()
  const t = useT()
  const [s, setS] = useState('')
  useEffect(() => {
    const read = () => { try { setS(JSON.parse(localStorage.getItem(SYNC_KEY) || '{}').s || '') } catch { setS('') } }
    read(); window.addEventListener('mission90-sync', read)
    return () => window.removeEventListener('mission90-sync', read)
  }, [])
  if (!cloud?.enabled) return null
  if (!cloud.user) return cloud.ready ? <button className="signin-btn" onClick={() => go('community')}>{t('Sign in')}</button> : null
  const label = t({ saved: 'Saved to your account', saving: 'Saving…', error: 'Could not save to your account', offline: 'Offline' }[s] || 'Signed in')
  const color = { saved: 'var(--ok)', saving: 'var(--signal)', error: 'var(--bad)' }[s] || 'var(--muted)'
  return <button className="syncdot" title={label} aria-label={label} onClick={() => go('community')}><i style={{ background: color }} /></button>
}
