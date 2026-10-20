import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RecoilRoot } from 'recoil'
import './index.css'
import App from './App.jsx'
import { prefersReducedMotion } from './lib/motion'

// Reveal animations hide their targets only when motion is allowed,
// so content stays visible for reduced-motion visitors.
if (!prefersReducedMotion()) document.documentElement.classList.add('motion-ready')

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RecoilRoot>
      <App />
    </RecoilRoot>
  </StrictMode>,
)
