const projects = [
  { name: 'Kanban Board', href: '/kanban.html', hooks: 'useState, useReducer, useRef, useCallback, useMemo, useLayoutEffect, useImperativeHandle' },
  { name: 'Real-time Chat', href: '/chat.html', hooks: 'useState, useEffect, useRef, useOptimistic, useCallback, useTransition, useSyncExternalStore' },
  { name: 'Form Wizard', href: '/form-wizard.html', hooks: 'useState, useEffect, useRef, useActionState, useTransition, useId, useCallback' },
  { name: 'E-commerce', href: '/ecommerce.html', hooks: 'useState, useContext, useReducer, useMemo, useCallback, useTransition, useDeferredValue' },
  { name: 'Dashboard', href: '/dashboard.html', hooks: 'useState, useEffect, useRef, useMemo, useCallback, useTransition, useDebugValue, useSyncExternalStore' },
  { name: 'Markdown Notes', href: '/notes.html', hooks: 'useState, useEffect, useRef, useInsertionEffect, useCallback, useMemo, useImperativeHandle, useDeferredValue' },
  { name: 'Event Calendar', href: '/calendar.html', hooks: 'useState, useReducer, useRef, useLayoutEffect, useMemo, useCallback, useDebugValue' },
  { name: 'Poll / Voting', href: '/poll.html', hooks: 'useState, useEffect, useContext, useReducer, useCallback, useMemo, useOptimistic, use, useTransition' },
]

export default function Home() {
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
          <a href={p.href} style={{ color: 'var(--accent)', marginTop: 'auto' }}>Open project →</a>
        </div>
      ))}
    </div>
  )
}
