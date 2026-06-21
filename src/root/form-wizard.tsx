import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import FormWizard from '../pages/FormWizard'

createRoot(document.getElementById('root')!).render(
  <StrictMode><FormWizard /></StrictMode>
)
