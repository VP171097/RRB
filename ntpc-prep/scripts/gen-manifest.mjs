// Scans public/pdfs/<folder>/*.pdf and writes public/pdfs/manifest.json.
// Runs automatically before `npm run dev` and `npm run build`.
import { readdirSync, statSync, writeFileSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'pdfs')
const files = []

function walk(dir, rel) {
  for (const name of readdirSync(dir).sort()) {
    const full = join(dir, name)
    const st = statSync(full)
    if (st.isDirectory()) walk(full, rel ? `${rel}/${name}` : name)
    else if (name.toLowerCase().endsWith('.pdf')) {
      files.push({
        path: rel ? `${rel}/${name}` : name,
        folder: rel || 'other',
        name: name.replace(/\.pdf$/i, '').replace(/[_-]+/g, ' '),
        size: st.size,
        modified: st.mtime.toISOString().slice(0, 10),
      })
    }
  }
}

if (existsSync(root)) walk(root, '')
writeFileSync(join(root, 'manifest.json'), JSON.stringify({ generated: new Date().toISOString(), files }, null, 2))
console.log(`manifest: ${files.length} PDF(s)`)
