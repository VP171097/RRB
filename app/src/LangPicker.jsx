import { useEffect, useRef } from 'react'
import { useGlobal } from './global.jsx'
import { useCloud } from './cloud.jsx'
import { LANGS } from './i18n.jsx'

// Changes the language for this device and, when signed in, saves it on the account so it follows the user.
export function useSetLang() {
  const { set } = useGlobal()
  const cloud = useCloud()
  return (lang) => {
    set({ lang })
    if (cloud?.user && cloud.client) cloud.client.auth.updateUser({ data: { language: lang } }).catch(() => {})
  }
}

// On sign-in, the account's saved language wins over this device's.
export function LangSync() {
  const { g, set } = useGlobal()
  const cloud = useCloud()
  const seen = useRef('')
  const user = cloud?.user
  useEffect(() => {
    const l = user?.user_metadata?.language
    if (user && seen.current !== user.id) {
      seen.current = user.id
      if (LANGS.some((x) => x.id === l) && l !== g.lang) set({ lang: l })
    }
  }, [user]) // eslint-disable-line react-hooks/exhaustive-deps
  return null
}

export function LangPicker({ value, onChange, label }) {
  return (
    <div role="group" aria-label={label}>
      <div className="seg">
        {LANGS.map((l) => <button key={l.id} type="button" className="btn ghost sm" aria-pressed={value === l.id} lang={l.id} onClick={() => onChange(l.id)}>{l.label}</button>)}
      </div>
    </div>
  )
}
