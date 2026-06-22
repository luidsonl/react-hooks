import { useInsertionEffect } from 'react'

export default function StyleInjector() {
  useInsertionEffect(() => {
    const id = 'notes-code-style'
    const existing = document.getElementById(id)
    if (existing) return
    const style = document.createElement('style')
    style.id = id
    style.textContent = `
      .notes-preview code {
        background: #1e1e2e; color: #cdd6f4; padding: 2px 6px;
        border-radius: 4px; font-size: 0.85rem;
      }
      .notes-preview pre code {
        display: block; padding: 12px; margin: 8px 0;
      }
      .notes-preview h1, .notes-preview h2, .notes-preview h3 {
        margin: 16px 0 8px; color: #e4e5ea;
      }
      .notes-preview ul { padding-left: 20px; }
    `
    document.head.appendChild(style)
    return () => style.remove()
  }, [])

  return null
}
