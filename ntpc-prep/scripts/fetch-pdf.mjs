// Download a PDF into public/pdfs/<folder>/ so it can be committed to git.
// Usage: npm run fetch-pdf -- <url> <folder>/<file-name>.pdf
//   e.g. npm run fetch-pdf -- https://example.com/paper.pdf pyq/ntpc-2025-shift1.pdf
import { writeFileSync, mkdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const [url, target] = process.argv.slice(2)
if (!url || !target) {
  console.error('Usage: npm run fetch-pdf -- <url> <folder>/<file-name>.pdf')
  process.exit(1)
}
const safe = target.replace(/^\/+/, '').replace(/\.\.+/g, '')
const out = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'pdfs', safe.endsWith('.pdf') ? safe : safe + '.pdf')

const res = await fetch(url, { redirect: 'follow', headers: { 'user-agent': 'Mozilla/5.0' } })
if (!res.ok) { console.error(`Download failed: HTTP ${res.status}`); process.exit(1) }
const buf = Buffer.from(await res.arrayBuffer())
if (buf.subarray(0, 4).toString() !== '%PDF') {
  console.error('That URL did not return a PDF (it may be a web page or need a login). Open it in your browser, download it, and drop the file into public/pdfs/ instead.')
  process.exit(1)
}
mkdirSync(dirname(out), { recursive: true })
writeFileSync(out, buf)
console.log(`Saved ${out} (${(buf.length / 1024).toFixed(0)} KB). Now: git add public/pdfs && git commit && git push`)
