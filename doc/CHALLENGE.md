# React Hooks Challenge

## Rules

- Vite + React 19 + TypeScript
- Zero external libraries
- Multiple hooks per project
- Code must compile and run

## Projects

### 1. Kanban Board

Hooks: `useState` `useReducer` `useRef` `useCallback` `useMemo` `useLayoutEffect` `useImperativeHandle`

Drag tasks between columns (add/edit/delete tasks and columns). Use `useLayoutEffect` to measure and sync column heights. Expose `scrollToTask(id)` via `useImperativeHandle`. Memoize drag handlers and filter functions.

### 2. Real-time Chat

Hooks: `useState` `useEffect` `useRef` `useOptimistic` `useCallback` `useTransition` `useSyncExternalStore`

Message feed with optimistic sending (message appears instantly, updates on confirm). `useSyncExternalStore` for online/offline indicator. Auto-scroll to latest message on new messages. Use `useTransition` to keep input responsive during re-renders.

### 3. Multi-step Form Wizard

Hooks: `useState` `useEffect` `useRef` `useActionState` `useTransition` `useId` `useCallback`

Multi-step form (shipping, payment, review) with client-side validation. `useActionState` for async form submission with loading/error/success. `useId` for accessible label-input associations. `useTransition` for smooth step animations. `useRef` to focus first invalid field.

### 4. E-commerce Product Listing

Hooks: `useState` `useContext` `useReducer` `useMemo` `useCallback` `useTransition` `useDeferredValue`

Product catalog with filters (category, price range, rating). Cart managed via `useContext` + `useReducer` (add/remove/update quantity, totals). `useDeferredValue` on filter inputs to keep UI responsive. Memoize filtered list and cart calculations. Async stock check via `useEffect`.

### 5. Live Data Dashboard

Hooks: `useState` `useEffect` `useRef` `useMemo` `useCallback` `useTransition` `useDebugValue` `useSyncExternalStore`

Simulated real-time metrics with custom `useWebSocket(url)` hook. `useDebugValue` on custom hooks for devtools. CPU/memory/network gauges. `useSyncExternalStore` for timezone or locale preference from `<html>` attributes. `useTransition` to batch metric updates.

### 6. Markdown Notes App

Hooks: `useState` `useEffect` `useRef` `useInsertionEffect` `useCallback` `useMemo` `useImperativeHandle` `useDeferredValue`

Live markdown preview with auto-save (debounced via `useRef`). `useInsertionEffect` to inject dynamic code-highlighting styles. Expose `exportAsMarkdown()` / `exportAsHTML()` via `useImperativeHandle`. `useDeferredValue` on the editor content for the preview pane.

### 7. Event Calendar

Hooks: `useState` `useReducer` `useRef` `useLayoutEffect` `useMemo` `useCallback` `useDebugValue`

Month/week view with event CRUD and drag-to-resize. Custom `useCalendar()` hook with `useDebugValue` showing current view range. `useLayoutEffect` to calculate day cell dimensions. Memoize visible events for current view. Arrow-key navigation with `useRef` for focus management.

### 8. Poll / Voting App

Hooks: `useState` `useEffect` `useContext` `useReducer` `useCallback` `useMemo` `useOptimistic` `use` `useTransition`

Live poll with optimistic votes (tally updates instantly, reverts on failure). `use()` to load poll data and user context. `useTransition` for smooth results animation. Context + reducer for global auth/user state. Memoize vote percentages and chart layout.

## Coverage

| Hook | Projects |
|---|---|
| useState | 1-8 |
| useEffect | 2-8 |
| useContext | 4, 8 |
| useReducer | 1, 4, 7, 8 |
| useRef | 1-7 |
| useCallback | 1-8 |
| useMemo | 1, 4-8 |
| useImperativeHandle | 1, 6 |
| useLayoutEffect | 1, 7 |
| useDebugValue | 5, 7 |
| useTransition | 2-5, 8 |
| useDeferredValue | 4, 6 |
| useId | 3 |
| useSyncExternalStore | 2, 5 |
| useInsertionEffect | 6 |
| useActionState | 3 |
| useOptimistic | 2, 8 |
| use | 8 |
