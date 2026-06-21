import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Ecommerce from '../pages/Ecommerce'

createRoot(document.getElementById('root')!).render(
  <StrictMode><Ecommerce /></StrictMode>
)
