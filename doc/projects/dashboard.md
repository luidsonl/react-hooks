# Live Data Dashboard

**Hooks:** `useState` `useEffect` `useRef` `useMemo` `useCallback` `useTransition` `useDebugValue` `useSyncExternalStore`

**Files:**
- `src/pages/Dashboard.tsx` — main dashboard page
- `src/components/dashboard/useMetrics.ts` — custom hook for simulated metrics
- `src/components/dashboard/useTimeZone.ts` — custom hook for locale timezone

---

## `useState`

History data and pause toggle.

`src/pages/Dashboard.tsx:13-14`
```tsx
const [history, setHistory] = useState<HistoryPoint[]>([])
const [paused, setPaused] = useState(false)
```

---

## `useEffect`

Data polling interval.

`src/pages/Dashboard.tsx:26-31`
```tsx
useEffect(() => {
  if (!paused) {
    intervalRef.current = setInterval(addPoint, 3000)
    return () => clearInterval(intervalRef.current)
  }
}, [paused, addPoint])
```
Clears and restarts the interval when `paused` changes. Cleanup prevents leaks on unmount.

---

## `useRef`

Interval ID + rolling history buffer.

`src/pages/Dashboard.tsx:16-17`
```tsx
const historyRef = useRef<HistoryPoint[]>([])
const intervalRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined)
```
`historyRef` maintains a mutable array of the last 20 data points (sliced at line 22). `intervalRef` stores the interval handle for cleanup.

---

## `useMemo`

Computed stats.

`src/pages/Dashboard.tsx:33-41`
```tsx
const avgCpu = useMemo(
  () => history.length ? (history.reduce((s, h) => s + h.value, 0) / history.length).toFixed(1) : '0',
  [history]
)

const maxMetric = useMemo(
  () => metrics.reduce((max, m) => m.value > max.value ? m : max, metrics[0]),
  [metrics]
)
```

---

## `useCallback`

Data point collector.

`src/pages/Dashboard.tsx:19-24`
```tsx
const addPoint = useCallback(() => {
  const now = new Date().toLocaleTimeString(tz, { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  const cpu = metrics.find((m) => m.label === 'CPU')?.value ?? 0
  historyRef.current = [...historyRef.current.slice(-19), { time: now, value: cpu }]
  startTransition(() => setHistory([...historyRef.current]))
}, [metrics, tz])
```

---

## `useTransition`

Batched history updates.

`src/pages/Dashboard.tsx:15`
```tsx
const [isPending, startTransition] = useTransition()
```
`startTransition` wraps `setHistory` at line 23 so chart re-renders don't block the UI. `isPending` shows "Rendering..." at line 73.

---

## `useDebugValue`

DevTools label for `useMetrics`.

`src/components/dashboard/useMetrics.ts:13`
```tsx
useDebugValue(metrics.map((m) => `${m.label}: ${m.value}${m.unit}`).join(', '))
```
In React DevTools, the `useMetrics` hook instance displays a summary like `"CPU: 45%, Memory: 3.8GB, Network: 201Mbps, Disk I/O: 55MB/s"`.

---

## `useSyncExternalStore`

Reactive timezone from `<html lang>`.

`src/components/dashboard/useTimeZone.ts:12`
```tsx
return useSyncExternalStore(store.subscribe, store.getSnapshot, () => 'en-US')
```
The store subscribes to `MutationObserver` on `<html>` (lines 6-10) and reads `document.documentElement.lang` as the snapshot (line 5). If the lang attribute changes, the component re-renders with the new timezone.
