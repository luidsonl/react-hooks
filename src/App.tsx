import { useState, lazy, Suspense } from 'react'

const Home = lazy(() => import('./pages/Home'))
const Kanban = lazy(() => import('./pages/Kanban'))
const Chat = lazy(() => import('./pages/Chat'))
const FormWizard = lazy(() => import('./pages/FormWizard'))
const Ecommerce = lazy(() => import('./pages/Ecommerce'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const Notes = lazy(() => import('./pages/Notes'))
const Calendar = lazy(() => import('./pages/Calendar'))
const Poll = lazy(() => import('./pages/Poll'))

export default function App() {
  const [page, setPage] = useState('home')

  return (
    <div>
      <nav>
        {page === 'home' ? (
          <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>React Hooks Challenge</span>
        ) : (
          <a href="#" onClick={(e) => { e.preventDefault(); setPage('home') }}>All Examples</a>
        )}
      </nav>
      <Suspense fallback={<div style={{ padding: 24, color: 'var(--text-muted)' }}>Loading...</div>}>
        {page === 'home' && <Home onNavigate={setPage} />}
        {page === 'kanban' && <Kanban />}
        {page === 'chat' && <Chat />}
        {page === 'form-wizard' && <FormWizard />}
        {page === 'ecommerce' && <Ecommerce />}
        {page === 'dashboard' && <Dashboard />}
        {page === 'notes' && <Notes />}
        {page === 'calendar' && <Calendar />}
        {page === 'poll' && <Poll />}
      </Suspense>
    </div>
  )
}
