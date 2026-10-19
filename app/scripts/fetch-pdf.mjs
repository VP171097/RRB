// Download a PDF into an exam folder so it can be committed to git.
// Usage: npm run fetch-pdf -- <url> <exam>/<folder>/<file-name>.pdf
//   exam   = graduate | undergraduate | groupd
//   folder = syllabus | pyq | notes | books | other
//   e.g. npm run fetch-pdf -- https://example.com/paper.pdf graduate/pyq/ntpc-2025-shift1.pdf
import { writeFileSync, mkdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const FOLDERS = { graduate: 'RRB_Graduate', undergraduate: 'RRB_UnderGraduate', groupd: 'RRB_GroupD' }
const [url, target] = process.argv.slice(2)
const parts = (target || '').replace(/^\/+/, '').replace(/\.\.+/g, '').split('/')
if (!url || parts.length < 3 || !FOLDERS[parts[0]]) {
  console.error('Usage: npm run fetch-pdf -- <url> <graduate|undergraduate|groupd>/<folder>/<file-name>.pdf')
  process.exit(1)
}
const rest = parts.slice(1).join('/')
const out = join(dirname(fileURLToPath(import.meta.url)), '..', '..', FOLDERS[parts[0]], 'pdfs', rest.endsWith('.pdf') ? rest : rest + '.pdf')

const res = await fetch(url, { redirect: 'follow', headers: { 'user-agent': 'Mozilla/5.0' } })
if (!res.ok) { console.error(`Download failed: HTTP ${res.status}`); process.exit(1) }
const buf = Buffer.from(await res.arrayBuffer())
if (buf.subarray(0, 4).toString() !== '%PDF') {
  console.error('That URL did not return a PDF (it may be a web page or need a login). Open it in your browser, download it, and drop the file into the exam folder instead.')
  process.exit(1)
}
mkdirSync(dirname(out), { recursive: true })
writeFileSync(out, buf)
console.log(`Saved ${out} (${(buf.length / 1024).toFixed(0)} KB). Now: git add ${FOLDERS[parts[0]]}/pdfs && git commit && git push`)
