import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base './' keeps asset paths relative, so the same build works at
// https://<user>.github.io/<repo>/ and on a local `npm run preview`.
export default defineConfig({
  base: './',
  plugins: [react()],
})
