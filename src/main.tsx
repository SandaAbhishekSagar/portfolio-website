import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import './index.css'
import App from './App'

const root = document.getElementById('root')!

// The prerenderer fills #root with the full record. Hydrate that markup
// instead of discarding it, so the server HTML is what the user actually sees.
if (root.hasChildNodes()) {
  hydrateRoot(root, <StrictMode><App /></StrictMode>)
} else {
  createRoot(root).render(<StrictMode><App /></StrictMode>)
}
