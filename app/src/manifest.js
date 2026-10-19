import { useEffect, useState } from 'react'

const base = import.meta.env.BASE_URL
export const pdfUrl = (folder, path) => `${base}pdfs/${folder}/` + path.split('/').map(encodeURIComponent).join('/')

// Each exam folder (RRB_*/pdfs) is copied to public/pdfs/<folder> at build time, with a manifest.json.
export function useManifest(folder) {
  const [m, setM] = useState({ loading: true, files: [], error: false })
  useEffect(() => {
    let live = true
    setM({ loading: true, files: [], error: false })
    fetch(`${base}pdfs/${folder}/manifest.json`, { cache: 'no-cache' })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((j) => live && setM({ loading: false, files: j.files || [], error: false }))
      .catch(() => live && setM({ loading: false, files: [], error: true }))
    return () => { live = false }
  }, [folder])
  return m
}
