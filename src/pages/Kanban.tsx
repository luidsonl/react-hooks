import '../styles/kanban.css'
import { useState, useRef, useCallback } from 'react'
import Column from '../components/kanban/Column'

type Card = { id: string; text: string }

const initialCards: Map<string, Card> = new Map([
  ['c1', { id: 'c1', text: 'Design UI' }],
  ['c2', { id: 'c2', text: 'Write docs' }],
  ['c3', { id: 'c3', text: 'Implement API' }],
])

type ColumnMeta = { id: string; title: string; cardIds: string[] }

const initialCols: ColumnMeta[] = [
  { id: 'todo', title: 'To Do', cardIds: ['c1', 'c2'] },
  { id: 'doing', title: 'Doing', cardIds: ['c3'] },
  { id: 'done', title: 'Done', cardIds: [] },
]

export default function Kanban() {
  const [cols, setCols] = useState<ColumnMeta[]>(initialCols)
  const [allCards, setAllCards] = useState<Map<string, Card>>(initialCards)
  const [newColTitle, setNewColTitle] = useState('')
  const [newCardText, setNewCardText] = useState('')
  const [newCardCol, setNewCardCol] = useState(cols[0]?.id ?? '')
  const dragRef = useRef<{ cardId: string; fromCol: string } | null>(null)
  const colElements = useRef<Map<string, HTMLDivElement>>(new Map())
  const setColRef = useCallback((id: string) => (el: HTMLDivElement | null) => {
    if (el) colElements.current.set(id, el)
    else colElements.current.delete(id)
  }, [])

  const onDragStart = useCallback((cardId: string, colId: string) => {
    dragRef.current = { cardId, fromCol: colId }
  }, [])

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
  }, [])

  const onDrop = useCallback((toCol: string) => {
    if (!dragRef.current) return
    const { cardId, fromCol } = dragRef.current
    if (fromCol === toCol) { dragRef.current = null; return }

    setCols((prev) => prev.map((c) => {
      if (c.id === fromCol) return { ...c, cardIds: c.cardIds.filter((id) => id !== cardId) }
      if (c.id === toCol) return { ...c, cardIds: [...c.cardIds, cardId] }
      return c
    }))
    dragRef.current = null
  }, [])

  const addColumn = useCallback(() => {
    if (!newColTitle.trim()) return
    const id = crypto.randomUUID()
    setCols((prev) => [...prev, { id, title: newColTitle.trim(), cardIds: [] }])
    setNewColTitle('')
  }, [newColTitle])

  const deleteColumn = useCallback((id: string) => {
    setCols((prev) => prev.filter((c) => c.id !== id))
  }, [])

  const addCard = useCallback(() => {
    if (!newCardText.trim() || !newCardCol) return
    const id = crypto.randomUUID()
    const card: Card = { id, text: newCardText.trim() }
    setAllCards((prev) => new Map(prev).set(id, card))
    setCols((prev) => prev.map((c) =>
      c.id === newCardCol ? { ...c, cardIds: [...c.cardIds, id] } : c
    ))
    setNewCardText('')
  }, [newCardText, newCardCol])

  const deleteCard = useCallback((cardId: string, colId: string) => {
    setAllCards((prev) => { const m = new Map(prev); m.delete(cardId); return m })
    setCols((prev) => prev.map((c) =>
      c.id === colId ? { ...c, cardIds: c.cardIds.filter((id) => id !== cardId) } : c
    ))
  }, [])

  return (
    <div className="page">
      <div className="kanban-toolbar">
        <div>
          <label className="kanban-label">New Column</label>
          <input
            value={newColTitle}
            onChange={(e) => setNewColTitle(e.target.value)}
            placeholder="Column name"
            className="kanban-input-name"
          />
        </div>
        <button onClick={addColumn} className="kanban-btn-toolbar">Add Column</button>
      </div>

      <div className="kanban-toolbar-cards">
        <div>
          <label className="kanban-label">New Card</label>
          <input
            value={newCardText}
            onChange={(e) => setNewCardText(e.target.value)}
            placeholder="Card text"
            className="kanban-input-text"
          />
        </div>
        <select
          value={newCardCol}
          onChange={(e) => setNewCardCol(e.target.value)}
          className="kanban-select-col"
        >
          {cols.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
        </select>
        <button onClick={addCard} className="kanban-btn-toolbar">Add Card</button>
      </div>

      <div className="kanban-column-container">
        {cols.map((col) => (
          <Column
            key={col.id}
            column={col}
            cards={allCards}
            onDragStart={onDragStart}
            onDragOver={onDragOver}
            onDrop={onDrop}
            onDeleteColumn={deleteColumn}
            onDeleteCard={(id) => deleteCard(id, col.id)}
            colRef={setColRef(col.id)}
          />
        ))}
      </div>

      <div className="kanban-footer-hint">
        Drag cards between columns
      </div>
    </div>
  )
}
