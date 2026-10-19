// Mission RRB service worker: network first, so the app is always current, with the last copy as the offline fallback.
// Cloud (Supabase) calls and the large PDFs are never cached here.
const CACHE = 'mission-rrb-v1'
self.addEventListener('install', () => self.skipWaiting())
self.addEventListener('activate', (e) => e.waitUntil(
  caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim())
))
self.addEventListener('fetch', (e) => {
  const r = e.request
  if (r.method !== 'GET') return
  const u = new URL(r.url)
  if (u.origin !== location.origin || u.pathname.includes('/pdfs/')) return
  e.respondWith(
    fetch(r).then((res) => {
      if (res.ok) { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(r, copy)) }
      return res
    }).catch(() => caches.match(r).then((m) => m || caches.match(new URL('./app/', self.registration.scope).href)))
  )
})
