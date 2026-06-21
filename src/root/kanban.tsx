import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Kanban from '../pages/Kanban'

createRoot(document.getElementById('root')!).render(
  <StrictMode><Kanban /></StrictMode>
)
