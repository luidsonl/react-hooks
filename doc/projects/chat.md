# Real-time Chat

**Hooks:** `useState` `useEffect` `useRef` `useOptimistic` `useCallback` `useTransition` `useSyncExternalStore`

**Files:**
- `src/pages/Chat.tsx` — chat page with message feed and input

---

## `useState`

Messages list and input text.

`src/pages/Chat.tsx:19-20`
```tsx
const [messages, setMessages] = useState<Message[]>(initialMessages)
const [input, setInput] = useState('')
```

---

## `useEffect`

Auto-scroll on new messages + bot message interval.

`src/pages/Chat.tsx:50-54`
```tsx
useEffect(() => {
  if (listRef.current) {
    listRef.current.scrollTop = listRef.current.scrollHeight
  }
}, [optimisticMessages])
```
Scrolls the message list to the bottom whenever the optimistic message list changes.

`src/pages/Chat.tsx:56-66`
```tsx
useEffect(() => {
  const interval = setInterval(() => {
    const text = msgs[Math.floor(Math.random() * msgs.length)]
    setMessages((prev) => [...prev, { id: generateId(), text, user: 'Bot' }])
  }, 8000)
  return () => clearInterval(interval)
}, [])
```
Simulates incoming bot messages every 8 seconds with proper cleanup on unmount.

---

## `useRef`

Scroll container reference.

`src/pages/Chat.tsx:21`
```tsx
const listRef = useRef<HTMLDivElement>(null)
```
Attached to the message list `<div>` at line 80 to enable auto-scrolling.

---

## `useOptimistic`

Instant message UI feedback.

`src/pages/Chat.tsx:24-27`
```tsx
const [optimisticMessages, addOptimistic] = useOptimistic(
  messages,
  (state, newMsg: Message) => [...state, newMsg]
)
```
When `sendMessage` calls `addOptimistic(temp)` (line 37), the new message appears immediately in the UI. After the simulated server responds, `startTransition` commits the confirmed messages to `messages`, which replaces the optimistic state.

---

## `useCallback`

Memoized send handler.

`src/pages/Chat.tsx:29-48`
```tsx
const sendMessage = useCallback(async () => {
  if (!input.trim()) return
  const text = input.trim()
  setInput('')
  const temp: Message = { id: generateId(), text, user: 'You', pending: true }
  addOptimistic(temp)
  const reply = await simulateResponse(text)
  startTransition(() => {
    setMessages((prev) => [
      ...prev,
      { id: generateId(), text, user: 'You' },
      reply,
    ])
  })
}, [input, addOptimistic])
```

---

## `useTransition`

Non-blocking message confirmation.

`src/pages/Chat.tsx:18`
```tsx
const [, startTransition] = useTransition()
```
At line 41, `startTransition` wraps the `setMessages` call so the UI stays responsive while the message list re-renders.

---

## `useSyncExternalStore`

Online/offline indicator.

`src/pages/Chat.tsx:22`
```tsx
const isOnline = useSyncExternalStore(subscribe, getOnlineStatus, () => true)
```
`subscribe` (lines 8-15) listens to `online`/`offline` window events. `getOnlineStatus` (line 6) reads `navigator.onLine`. The indicator is displayed in the UI at lines 73-76.
