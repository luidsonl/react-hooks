# Markdown Notes App

**Hooks:** `useState` `useEffect` `useRef` `useInsertionEffect` `useCallback` `useMemo` `useDeferredValue`

**Files:**
- `src/pages/Notes.tsx` — note list and tab management
- `src/components/notes/Editor.tsx` — markdown editor + preview
- `src/components/notes/StyleInjector.tsx` — runtime style injection

---

## `useState`

Notes list and active selection.

`src/pages/Notes.tsx:17-18`
```tsx
const [notes, setNotes] = useState<Note[]>(defaultNotes)
const [activeId, setActiveId] = useState('1')
```

`src/components/notes/Editor.tsx:11-12`
```tsx
const [title, setTitle] = useState(note.title)
const [content, setContent] = useState(note.content)
```
The editor creates local state from the note prop so changes don't mutate the parent until the debounced save fires.

---

## `useEffect`

Cleanup save timer on unmount.

`src/components/notes/Editor.tsx:16-18`
```tsx
useEffect(() => {
  return () => clearTimeout(saveTimer.current)
}, [])
```
Prevents a stale `setTimeout` from calling `onSave` after the editor unmounts.

---

## `useRef`

Debounce timer reference.

`src/components/notes/Editor.tsx:13`
```tsx
const saveTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
```
Used in `debouncedSave` (lines 20-25): clears any pending timer, then sets a new 500ms timeout before calling `onSave`.

---

## `useInsertionEffect`

Inject styles before paint.

`src/components/notes/StyleInjector.tsx:4-25`
```tsx
useInsertionEffect(() => {
  const id = 'notes-code-style'
  const existing = document.getElementById(id)
  if (existing) return
  const style = document.createElement('style')
  style.id = id
  style.textContent = `
    .notes-preview code { background: #1e1e2e; ... }
    .notes-preview pre code { display: block; ... }
  `
  document.head.appendChild(style)
  return () => style.remove()
}, [])
```
`useInsertionEffect` runs synchronously before the browser paints, so the injected `<style>` is available before any elements render. Unlike `useEffect` or `useLayoutEffect`, this is the designated hook for injecting styles at runtime.

---

## `useCallback`

Debounced save + CRUD operations.

`src/components/notes/Editor.tsx:20-25`
```tsx
const debouncedSave = useCallback((t: string, c: string) => {
  clearTimeout(saveTimer.current)
  saveTimer.current = setTimeout(() => {
    onSave(note.id, t, c)
  }, 500)
}, [note.id, onSave])
```

`src/pages/Notes.tsx:22-39`
```tsx
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
```

---

## `useMemo`

Find active note + compute preview HTML.

`src/pages/Notes.tsx:20`
```tsx
const activeNote = useMemo(() => notes.find((n) => n.id === activeId), [notes, activeId])
```

`src/components/notes/Editor.tsx:27`
```tsx
const previewHtml = useMemo(() => simpleMarkdown(deferredContent), [deferredContent])
```
The markdown-to-HTML conversion runs only when the deferred content changes.

---

## `useDeferredValue`

Responsive editing during preview.

`src/components/notes/Editor.tsx:14`
```tsx
const deferredContent = useDeferredValue(content)
```
The textarea updates immediately on every keystroke (`content`). The preview pane reads `deferredContent`, which lags behind during rapid typing. The preview element gets `data-stale` attribute (line 48) while waiting for the deferred value to catch up.
