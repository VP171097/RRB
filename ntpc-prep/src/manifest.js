import { useEffect, useState } from 'react'

const base = import.meta.env.BASE_URL
export const pdfUrl = (path) => base + 'pdfs/' + path.split('/').map(encodeURIComponent).join('/')

export function useManifest() {
  const [m, setM] = useState({ loading: true, files: [], error: false })
  useEffect(() => {
    let live = true
    fetch(base + 'pdfs/manifest.json', { cache: 'no-cache' })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((j) => live && setM({ loading: false, files: j.files || [], error: false }))
      .catch(() => live && setM({ loading: false, files: [], error: true }))
    return () => { live = false }
  }, [])
  return m
}
