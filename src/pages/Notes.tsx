import '../styles/notes.css'
import { useState, useMemo, useCallback } from 'react'
import { type Note } from '../components/notes/noteTypes'
import StyleInjector from '../components/notes/StyleInjector'
import Editor from '../components/notes/Editor'

const defaultNotes: Note[] = [
  {
    id: '1',
    title: 'Welcome',
    content: '# Hello\n\nStart writing **markdown** here!\n\n- Item 1\n- Item 2\n\nCode: `const x = 1`',
    updatedAt: Date.now(),
  },
]

export default function Notes() {
  const [notes, setNotes] = useState<Note[]>(defaultNotes)
  const [activeId, setActiveId] = useState('1')

  const activeNote = useMemo(() => notes.find((n) => n.id === activeId), [notes, activeId])

  const handleSave = useCallback((id: string, title: string, content: string) => {
    setNotes((prev) => prev.map((n) =>
      n.id === id ? { ...n, title, content, updatedAt: Date.now() } : n
    ))
  }, [])

  const addNote = useCallback(() => {
    const id = String(Date.now())
    setNotes((prev) => [...prev, { id, title: 'New Note', content: '', updatedAt: Date.now() }])
    setActiveId(id)
  }, [])

  const deleteNote = useCallback((id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id))
    if (activeId === id) {
      setActiveId(notes.find((n) => n.id !== id)?.id ?? '')
    }
  }, [activeId, notes])

  return (
    <div className="page notes-page">
      <StyleInjector />

      <div className="notes-toolbar">
        <button onClick={addNote}>+ New Note</button>
      </div>

      <div className="notes-tab-bar">
        {notes.map((n) => (
          <button
            key={n.id}
            onClick={() => setActiveId(n.id)}
            className={`notes-tab${n.id === activeId ? ' notes-tab--active' : ''}`}
          >
            {n.title}
            {notes.length > 1 && (
              <span
                onClick={(e) => { e.stopPropagation(); deleteNote(n.id) }}
                className="notes-tab-delete"
              >
                ×
              </span>
            )}
          </button>
        ))}
      </div>

      {activeNote && (
        <Editor key={activeNote.id} note={activeNote} onSave={handleSave} />
      )}
    </div>
  )
}
