import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Poll from '../pages/Poll'

createRoot(document.getElementById('root')!).render(
  <StrictMode><Poll /></StrictMode>
)
