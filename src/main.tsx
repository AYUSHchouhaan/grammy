import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// Removed index.css import - using inline styles instead
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
