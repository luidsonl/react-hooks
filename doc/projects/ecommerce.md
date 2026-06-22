# E-commerce Product Listing

**Hooks:** `useState` `useContext` `useReducer` `useMemo` `useCallback` `useTransition` `useDeferredValue`

**Files:**
- `src/pages/Ecommerce.tsx` — shop page with filters and product grid
- `src/components/ecommerce/cart.tsx` — cart context + reducer
- `src/components/ecommerce/CartSummaryMinimal.tsx` — cart sidebar

---

## `useState`

Filter inputs.

`src/pages/Ecommerce.tsx:9-12`
```tsx
const [search, setSearch] = useState('')
const [category, setCategory] = useState('All')
const [minPrice, setMinPrice] = useState('')
const [maxPrice, setMaxPrice] = useState('')
```

---

## `useContext`

Cart state access.

`src/pages/Ecommerce.tsx:15`
```tsx
const { dispatch } = useCart()
```

`src/components/ecommerce/cart.tsx:38-40`
```tsx
export function useCart() {
  return useContext(CartCtx)
}
```
`CartCtx` is created at line 32 via `createContext`. The provider wraps the entire shop in `Ecommerce.tsx:90` and exposes items + dispatch to all descendants.

---

## `useReducer`

Cart CRUD operations.

`src/components/ecommerce/cart.tsx:43`
```tsx
const [items, dispatch] = useReducer(cartReducer, [])
```
`cartReducer` (lines 12-29) handles `ADD`, `REMOVE`, and `SET_QTY` actions. Dispatch calls like `dispatch({ type: 'REMOVE', productId: p.id })` (from `CartSummaryMinimal.tsx:32`) update the cart immutably.

---

## `useMemo`

Filtered product list + cart total.

`src/pages/Ecommerce.tsx:21-30`
```tsx
const filtered = useMemo(() => {
  const max = maxPrice ? parseFloat(maxPrice) : Infinity
  const min = minPrice ? parseFloat(minPrice) : 0
  return products.filter((p) => {
    if (category !== 'All' && p.category !== category) return false
    if (deferredSearch && !p.name.toLowerCase().includes(deferredSearch.toLowerCase())) return false
    if (p.price < min || p.price > max) return false
    return true
  })
}, [category, minPrice, maxPrice, deferredSearch])
```

`src/components/ecommerce/CartSummaryMinimal.tsx:6-9`
```tsx
const total = useMemo(
  () => items.reduce((sum, i) => sum + i.price * i.quantity, 0).toFixed(2),
  [items]
)
```

`src/components/ecommerce/cart.tsx:44`
```tsx
const value = useMemo(() => ({ items, dispatch }), [items])
```
The context value is memoized to prevent unnecessary re-renders of all consumers.

---

## `useCallback`

Deferred search handler.

`src/pages/Ecommerce.tsx:17-19`
```tsx
const setSearchDeferred = useCallback((value: string) => {
  startTransition(() => setSearch(value))
}, [])
```

---

## `useTransition`

Pending state for filter updates.

`src/pages/Ecommerce.tsx:13`
```tsx
const [isPending, startTransition] = useTransition()
```
`isPending` drives the "Updating..." text at line 68 and the loading class on the product grid at line 70.

---

## `useDeferredValue`

Responsive search input.

`src/pages/Ecommerce.tsx:14`
```tsx
const deferredSearch = useDeferredValue(search)
```
The search input updates `search` on every keystroke, but the product filter reads `deferredSearch`, which lags behind during rapid typing. This keeps the input responsive while the (potentially expensive) filter runs on the deferred value.
