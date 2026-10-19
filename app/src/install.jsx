import { useEffect, useState } from 'react'
import { useT } from './i18n.jsx'

// "Install app" support. Chrome and Edge fire beforeinstallprompt, which is saved and replayed from a button.
// iPhones have no such event, so they get the Add to Home Screen steps.
let deferred = null
const subs = new Set()
const ping = () => subs.forEach((f) => f())
if (typeof window !== 'undefined') {
  window.addEventListener('beforeinstallprompt', (e) => { e.preventDefault(); deferred = e; ping() })
  window.addEventListener('appinstalled', () => { deferred = null; ping() })
}
const standalone = () => window.matchMedia?.('(display-mode: standalone)').matches || window.navigator.standalone === true
const ios = () => /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)

export function useInstall() {
  const [, force] = useState(0)
  useEffect(() => { const f = () => force((x) => x + 1); subs.add(f); return () => subs.delete(f) }, [])
  return {
    installed: standalone(),
    ios: ios(),
    ready: !!deferred,
    prompt: async () => {
      if (!deferred) return false
      deferred.prompt()
      const r = await deferred.userChoice.catch(() => null)
      deferred = null; ping()
      return r?.outcome === 'accepted'
    },
  }
}

export function InstallButton({ className = 'btn ghost sm', label }) {
  const t = useT()
  const inst = useInstall()
  const [help, setHelp] = useState(false)
  if (inst.installed) return null
  const click = async () => { if (inst.ready) await inst.prompt(); else setHelp((h) => !h) }
  return (
    <span className="install">
      <button type="button" className={className} onClick={click}>{label || t('Install app')}</button>
      {help && (
        <span className="install-help" role="status">
          {inst.ios
            ? t('On iPhone or iPad: tap the Share button, then "Add to Home Screen".')
            : t('Open your browser menu (the three dots) and tap "Install app" or "Add to Home screen".')}
        </span>
      )}
    </span>
  )
}
