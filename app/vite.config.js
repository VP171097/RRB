import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'node:path'

// Two pages: the landing page at the site root and the study app under /app/.
// base './' keeps asset paths relative, so the build works at https://<user>.github.io/<repo>/ and locally.
// The exam content lives one level up (RRB_*), so the dev server may read from there.
export default defineConfig({
  base: './',
  plugins: [react()],
  server: { fs: { allow: ['..'] } },
  build: {
    rollupOptions: {
      input: { landing: resolve(import.meta.dirname, 'index.html'), app: resolve(import.meta.dirname, 'app/index.html') },
    },
  },
})
