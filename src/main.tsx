import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { initGa4 } from './analytics/ga4'
import './index.css'
import App from './App'

initGa4(import.meta.env.VITE_GA4_ID)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
