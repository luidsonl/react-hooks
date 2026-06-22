const projects = [
  { id: 'kanban', name: 'Kanban Board', hooks: 'useState, useRef, useCallback, useMemo' },
  { id: 'chat', name: 'Real-time Chat', hooks: 'useState, useEffect, useRef, useOptimistic, useCallback, useTransition, useSyncExternalStore' },
  { id: 'form-wizard', name: 'Form Wizard', hooks: 'useState, useActionState, useTransition, useId' },
  { id: 'ecommerce', name: 'E-commerce', hooks: 'useState, useContext, useReducer, useMemo, useCallback, useTransition, useDeferredValue' },
  { id: 'dashboard', name: 'Dashboard', hooks: 'useState, useEffect, useRef, useMemo, useCallback, useTransition, useDebugValue, useSyncExternalStore' },
  { id: 'notes', name: 'Markdown Notes', hooks: 'useState, useEffect, useRef, useInsertionEffect, useCallback, useMemo, useDeferredValue' },
  { id: 'calendar', name: 'Event Calendar', hooks: 'useState, useReducer, useRef, useLayoutEffect, useEffect, useMemo, useCallback, useDebugValue' },
  { id: 'poll', name: 'Poll / Voting', hooks: 'useState, useEffect, useContext, useReducer, useCallback, useMemo, useOptimistic, useTransition' },
]

export default function Home({ onNavigate }: { onNavigate: (page: string) => void }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16, padding: 24 }}>
      {projects.map((p) => (
        <div key={p.name} style={{
          background: 'var(--surface)', border: '1px solid var(--border)',
          borderRadius: 'var(--radius)', padding: 20, display: 'flex',
          flexDirection: 'column', gap: 8,
        }}>
          <div style={{ fontSize: '1.125rem', fontWeight: 600, color: '#e4e5ea' }}>{p.name}</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--mono)' }}>{p.hooks}</div>
          <a href="#" onClick={(e) => { e.preventDefault(); onNavigate(p.id) }} style={{ color: 'var(--accent)', marginTop: 'auto' }}>Open project →</a>
        </div>
      ))}
    </div>
  )
}
