# Poll / Voting App

**Hooks:** `useState` `useEffect` `useContext` `useReducer` `useCallback` `useMemo` `useOptimistic` `useTransition`

**Files:**
- `src/pages/Poll.tsx` — poll page with voting and suggestion box
- `src/components/poll/pollTypes.ts` — context, reducer, types

---

## `useState`

Voted state and custom option input.

`src/pages/Poll.tsx:28-29`
```tsx
const [votedOption, setVotedOption] = useState<string | null>(null)
const [newOptionText, setNewOptionText] = useState('')
```

---

## `useEffect`

Simulated bot votes.

`src/pages/Poll.tsx:44-53`
```tsx
useEffect(() => {
  if (poll.totalVotes > initial.totalVotes + 10) return
  const interval = setInterval(() => {
    const randOpt = poll.options[Math.floor(Math.random() * poll.options.length)]
    if (randOpt) dispatch({ type: 'VOTE', optionId: randOpt.id })
  }, 4000)
  return () => clearInterval(interval)
}, [poll, initial.totalVotes])
```
Every 4 seconds a random option receives a simulated vote, capped at 10 extra votes above the initial total.

---

## `useContext`

Current user identity.

`src/pages/Poll.tsx:30`
```tsx
const user = useContext(UserCtx)
```
`UserCtx` is created in `src/components/poll/pollTypes.ts:8`:
```tsx
export const UserCtx = createContext<User>({ name: 'Guest', id: '0' })
```
The provider at `Poll.tsx:133` injects `{ name: 'Player1', id: '1' }`, displayed at line 86: `Logged in as: Player1`.

---

## `useReducer`

Poll state management.

`src/pages/Poll.tsx:27`
```tsx
const [poll, dispatch] = useReducer(voteReducer, initial)
```
`voteReducer` (defined in `pollTypes.ts:10-20`) handles the `VOTE` action by incrementing the target option's count and total votes.

---

## `useCallback`

Vote handler and custom option handler.

`src/pages/Poll.tsx:62-81`
```tsx
const handleVote = useCallback((optionId: string) => {
  if (votedOption) return
  setVotedOption(optionId)
  addOptimisticVote(optionId)
  startTransition(() => {
    setTimeout(() => dispatch({ type: 'VOTE', optionId }), 300)
  })
}, [votedOption, addOptimisticVote])

const addCustomOption = useCallback(() => {
  if (!newOptionText.trim()) return
  const id = String(Date.now())
  startTransition(() => dispatch({ type: 'VOTE', optionId: id }))
  setNewOptionText('')
}, [newOptionText])
```

---

## `useMemo`

Vote percentages.

`src/pages/Poll.tsx:55-60`
```tsx
const percentages = useMemo(() => {
  return optimisticPoll.options.map((o) => ({
    ...o,
    pct: optimisticPoll.totalVotes > 0 ? (o.votes / optimisticPoll.totalVotes) * 100 : 0,
  }))
}, [optimisticPoll])
```
Computes each option's vote percentage for the bar chart width, re-running only when the poll data changes.

---

## `useOptimistic`

Instant vote feedback.

`src/pages/Poll.tsx:33-42`
```tsx
const [optimisticPoll, addOptimisticVote] = useOptimistic(
  poll,
  (state, optionId: string) => ({
    ...state,
    options: state.options.map((o) =>
      o.id === optionId ? { ...o, votes: o.votes + 1 } : o
    ),
    totalVotes: state.totalVotes + 1,
  })
)
```
When the user votes, `handleVote` calls `addOptimisticVote(optionId)` at line 65, immediately updating the UI. The actual `dispatch` happens 300ms later inside `startTransition`.

---

## `useTransition`

Smooth vote dispatch.

`src/pages/Poll.tsx:31`
```tsx
const [, startTransition] = useTransition()
```
Used at line 67 inside `handleVote` and at line 77 inside `addCustomOption` to defer the actual reducer dispatch, keeping the UI responsive during re-renders.
