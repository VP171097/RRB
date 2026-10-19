// For each exam folder (../RRB_*/pdfs) copy the PDFs into public/pdfs/<folder>/ and write a manifest.json
// the Library page reads. Runs automatically before `npm run dev` and `npm run build`.
import { readdirSync, statSync, writeFileSync, existsSync, mkdirSync, copyFileSync, rmSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const repo = join(here, '..', '..')
const out = join(here, '..', 'public', 'pdfs')
rmSync(out, { recursive: true, force: true })

for (const dir of readdirSync(repo).filter((d) => /^RRB_/.test(d)).sort()) {
  const src = join(repo, dir, 'pdfs')
  const dest = join(out, dir)
  mkdirSync(dest, { recursive: true })
  const files = []
  const walk = (cur, rel) => {
    for (const name of readdirSync(cur).sort()) {
      const full = join(cur, name)
      const st = statSync(full)
      if (st.isDirectory()) walk(full, rel ? `${rel}/${name}` : name)
      else if (name.toLowerCase().endsWith('.pdf')) {
        mkdirSync(join(dest, rel), { recursive: true })
        copyFileSync(full, join(dest, rel, name))
        files.push({ path: rel ? `${rel}/${name}` : name, folder: rel || 'other', name: name.replace(/\.pdf$/i, '').replace(/[_-]+/g, ' '), size: st.size, modified: st.mtime.toISOString().slice(0, 10) })
      }
    }
  }
  if (existsSync(src)) walk(src, '')
  writeFileSync(join(dest, 'manifest.json'), JSON.stringify({ generated: new Date().toISOString(), files }, null, 2))
  console.log(`${dir}: ${files.length} PDF(s)`)
}
