import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { parseLessons, parseDrills } from './lessons.js'
import { setLocale } from './lib.js'

export const LANGS = [{ id: 'en', label: 'English' }, { id: 'hi', label: 'हिन्दी' }]
export const LOCALES = { en: undefined, hi: 'hi-IN' }

// Everything user-visible goes through t('English text'). English is the key; the Hindi dictionary
// (app/src/i18n/hi/*.js plus each exam's hi/dict.js) maps it to Hindi. A string with no entry shows in English.
// t('Day {n} of {total}', { n, total }) fills {name} slots.
const fill = (s, v) => (v ? s.replace(/\{(\w+)\}/g, (m, k) => (k in v ? v[k] : m)) : s)
export function makeT(dict) {
  const look = (s) => {
    if (!dict || typeof s !== 'string') return s
    if (dict[s] != null) return dict[s]
    for (const sep of [' · ', '; ', ', ', ' + ', ' and ']) {
      if (s.includes(sep)) {
        const parts = s.split(sep)
        const out = parts.map((p) => dict[p] ?? p)
        if (out.some((p, i) => p !== parts[i])) return out.join(sep === ' and ' ? ' और ' : sep)
      }
    }
    if (/[.!?] /.test(s)) { // a run of sentences: translate each one that has an entry
      const parts = s.split(/(?<=[.!?]) /)
      const out = parts.map((p) => dict[p] ?? p)
      if (out.some((p, i) => p !== parts[i])) return out.join(' ')
    }
    return s
  }
  const t = (s, v) => fill(look(s), v)
  t.exact = (s) => dict?.[s]
  return t
}

const Ctx = createContext({ lang: 'en', t: makeT(null), pack: null })
export const useI18n = () => useContext(Ctx)
export const useT = () => useContext(Ctx).t

// Merges the Hindi lesson text over the English lessons: Hindi wins where it exists, English fills the rest.
export function mergeLessons(en, hiTexts) {
  const byKey = new Map(en.byKey), bySub = new Map(en.bySub)
  hiTexts.forEach((txt) => {
    const hi = parseLessons(txt || '')
    hi.byKey.forEach((v, k) => byKey.set(k, v))
    hi.bySub.forEach((v, k) => bySub.set(k, v))
  })
  return { byKey, bySub }
}
export function mergeDrills(en, hiTexts) {
  const map = new Map(en.map), alias = new Map(en.alias)
  hiTexts.forEach((txt) => { const hi = parseDrills(txt || ''); hi.map.forEach((v, k) => v.length && map.set(k, v)); hi.alias.forEach((v, k) => alias.set(k, v)) })
  return { map, alias }
}

// Returns the exam object with Hindi content laid over it. packs = [Graduate pack, this exam's pack].
export function localizeExam(X, packs) {
  if (!packs.length) return X
  const get = (k) => packs.map((p) => p?.[k]).filter(Boolean)
  const merged = (k) => Object.assign({}, ...get(k))
  const tricks = merged('tricks'), quiz = merged('quiz'), notes = merged('notes')
  return {
    ...X,
    LESSONS: mergeLessons(X.LESSONS, get('lessons')),
    DRILLS: mergeDrills(X.DRILLS, get('drills')),
    TRICKS: X.TRICKS.map((x) => { const h = tricks[`${x.sub}|${x.topic}|${x.title}`]; return h ? { ...x, ...h } : x }),
    QUIZ: X.QUIZ.map((x) => { const h = quiz[x.q]; return h ? { ...x, ...h } : x }),
    NOTES: X.NOTES.map((n) => notes[n.id] ? { ...n, ...notes[n.id] } : n),
  }
}

export function I18nProvider({ lang, examId, loadPacks, children }) {
  const [state, setState] = useState({ ui: null, packs: [], key: '' })
  useEffect(() => {
    if (lang !== 'hi') return
    let alive = true
    Promise.all([import('./i18n/hi/index.js'), loadPacks(examId)]).then(([ui, packs]) => { if (alive) setState({ ui: ui.default, packs, key: examId }) }).catch(() => {})
    return () => { alive = false }
  }, [lang, examId, loadPacks])
  const on = lang === 'hi' && state.ui && state.key === examId
  const dict = useMemo(() => (on ? Object.assign({}, state.ui, ...state.packs.map((p) => p?.dict || {})) : null), [on, state])
  const t = useMemo(() => makeT(dict), [dict])
  setLocale(LOCALES[lang])
  useEffect(() => { document.documentElement.lang = lang === 'hi' ? 'hi' : 'en' }, [lang])
  const value = useMemo(() => ({ lang, t, packs: on ? state.packs : [] }), [lang, t, on, state])
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}
