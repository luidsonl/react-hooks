import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Chat from '../pages/Chat'

createRoot(document.getElementById('root')!).render(
  <StrictMode><Chat /></StrictMode>
)
