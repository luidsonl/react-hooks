export type CalendarEvent = { id: string; date: string; title: string; color: string }

export type EventAction =
  | { type: 'ADD'; event: CalendarEvent }
  | { type: 'EDIT'; id: string; title: string }
  | { type: 'DELETE'; id: string }

export function eventReducer(state: CalendarEvent[], action: EventAction): CalendarEvent[] {
  switch (action.type) {
    case 'ADD': return [...state, action.event]
    case 'EDIT': return state.map((e) => e.id === action.id ? { ...e, title: action.title } : e)
    case 'DELETE': return state.filter((e) => e.id !== action.id)
  }
}

export const COLORS = ['#6366f1', '#22c55e', '#eab308', '#ef4444', '#ec4899', '#14b8a6']

export const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

export function formatDate(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}
