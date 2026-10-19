import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'
import './install.jsx'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(<StrictMode><App /></StrictMode>)

// Lets the browser offer "Install app"; the worker keeps the last copy for offline use.
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => navigator.serviceWorker.register(new URL('../sw.js', window.location.href).href, { scope: new URL('../', window.location.href).pathname }).catch(() => {}))
}
