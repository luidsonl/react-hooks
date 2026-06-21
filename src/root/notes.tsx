import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Notes from '../pages/Notes'

createRoot(document.getElementById('root')!).render(
  <StrictMode><Notes /></StrictMode>
)
