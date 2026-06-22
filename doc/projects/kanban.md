# Kanban Board

**Hooks:** `useState` `useRef` `useCallback` `useMemo`

**Files:**
- `src/pages/Kanban.tsx` — page component (columns, cards, drag-and-drop)
- `src/components/kanban/Column.tsx` — column component with card list
- `src/components/kanban/Card.tsx` — individual draggable card

---

## `useState`

5 instances managing columns, cards, and form inputs.

`src/pages/Kanban.tsx:22`
```tsx
const [cols, setCols] = useState<ColumnMeta[]>(initialCols)
const [allCards, setAllCards] = useState<Map<string, Card>>(initialCards)
const [newColTitle, setNewColTitle] = useState('')
const [newCardText, setNewCardText] = useState('')
const [newCardCol, setNewCardCol] = useState(cols[0]?.id ?? '')
```
`cols` and `allCards` hold the full board state. `newColTitle`, `newCardText`, `newCardCol` are controlled inputs for the toolbar.

---

## `useRef`

2 refs: drag tracking + column element registry.

`src/pages/Kanban.tsx:27-28`
```tsx
const dragRef = useRef<{ cardId: string; fromCol: string } | null>(null)
const colElements = useRef<Map<string, HTMLDivElement>>(new Map())
```
`dragRef` stores the currently dragged card's id and source column during a drag operation. `colElements` maps column ids to their DOM nodes.

---

## `useCallback`

7 memoized handlers.

`src/pages/Kanban.tsx:29-82`
```tsx
const setColRef = useCallback((id: string) => (el: HTMLDivElement | null) => {
  if (el) colElements.current.set(id, el)
  else colElements.current.delete(id)
}, [])

const onDragStart = useCallback((cardId: string, colId: string) => {
  dragRef.current = { cardId, fromCol: colId }
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
  setCols((prev) => [...prev, { id: crypto.randomUUID(), title: newColTitle.trim(), cardIds: [] }])
  setNewColTitle('')
}, [newColTitle])
```
Every handler is wrapped in `useCallback` so the `Column` children don't re-render unnecessarily on every render.

---

## `useMemo`

Filters card map for each column.

`src/components/kanban/Column.tsx:21-24`
```tsx
const columnCards = useMemo(
  () => column.cardIds.map((id) => cards.get(id)).filter(Boolean),
  [column.cardIds, cards]
)
```
Converts the column's `cardIds` array into actual card objects from the shared `Map`, re-running only when the column's cards or the card map changes.
