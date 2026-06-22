# Event Calendar

**Hooks:** `useState` `useReducer` `useRef` `useLayoutEffect` `useEffect` `useMemo` `useCallback` `useDebugValue`

**Files:**
- `src/pages/Calendar.tsx` — calendar page with grid + event panel
- `src/components/calendar/useCalendar.ts` — custom hook for month navigation
- `src/components/calendar/CalendarGrid.tsx` — day grid
- `src/components/calendar/EventPanel.tsx` — event add/edit/delete

---

## `useState`

Selected day, new/edit event form state.

`src/pages/Calendar.tsx:15-18`
```tsx
const [selectedDay, setSelectedDay] = useState<number | null>(new Date().getDate())
const [newTitle, setNewTitle] = useState('')
const [editingId, setEditingId] = useState<string | null>(null)
const [editTitle, setEditTitle] = useState('')
```

---

## `useReducer`

Event CRUD.

`src/pages/Calendar.tsx:14`
```tsx
const [events, dispatch] = useReducer(eventReducer, initialEvents)
```
The reducer (defined in `src/components/calendar/calendarTypes.ts`) handles `ADD`, `EDIT`, and `DELETE` actions. Dispatched at lines 56-64 (add), line 121 (edit), and line 123 (delete).

---

## `useRef`

Grid DOM ref, cell sizes map, focus reference.

`src/pages/Calendar.tsx:19-21`
```tsx
const gridRef = useRef<HTMLDivElement>(null)
const cellSizes = useRef<Map<string, number>>(new Map())
const focusedDay = useRef<HTMLButtonElement>(null)
```
`gridRef` is passed to `CalendarGrid` for measurement. `cellSizes` stores day cell heights read in `useLayoutEffect`. `focusedDay` holds the selected day button element for keyboard focus.

---

## `useLayoutEffect`

Measure cell dimensions synchronously.

`src/pages/Calendar.tsx:23-31`
```tsx
useLayoutEffect(() => {
  if (gridRef.current) {
    const cells = gridRef.current.querySelectorAll('[data-day]')
    cells.forEach((cell) => {
      const day = cell.getAttribute('data-day')
      if (day) cellSizes.current.set(day, cell.clientHeight)
    })
  }
}, [cal.days])
```
`useLayoutEffect` fires synchronously after DOM mutations but before the browser paints, guaranteeing that `clientHeight` values are accurate. This prevents layout thrashing that would occur with `useEffect`.

---

## `useEffect`

Focus selected day after month change.

`src/pages/Calendar.tsx:33-35`
```tsx
useEffect(() => {
  focusedDay.current?.focus()
}, [cal.month])
```
After navigating to a new month, the selected day button receives keyboard focus for accessibility.

---

## `useMemo`

Filtered events for day and month.

`src/pages/Calendar.tsx:41-52`
```tsx
const dayEvents = useMemo(
  () => events.filter((e) => e.date === selectedDate),
  [events, selectedDate]
)

const allEvents = useMemo(
  () => events.filter((e) => {
    const [y, m] = e.date.split('-').map(Number)
    return y === cal.year && m === cal.month + 1
  }),
  [events, cal.year, cal.month]
)
```

---

## `useCallback`

Memoized event-add handler.

`src/pages/Calendar.tsx:54-66`
```tsx
const addEvent = useCallback(() => {
  if (!newTitle.trim() || !selectedDate) return
  dispatch({
    type: 'ADD',
    event: {
      id: String(Date.now()),
      date: selectedDate,
      title: newTitle.trim(),
      color: COLORS[events.length % COLORS.length],
    },
  })
  setNewTitle('')
}, [newTitle, selectedDate, events.length])
```

---

## `useDebugValue`

DevTools label for `useCalendar`.

`src/components/calendar/useCalendar.ts:7`
```tsx
useDebugValue({ year, month, label: `${month + 1}/${year}` })
```
In React DevTools the `useCalendar` hook displays `{ year: 2026, month: 5, label: "6/2026" }`.
