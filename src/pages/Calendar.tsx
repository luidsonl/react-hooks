import '../styles/calendar.css'
import { useState, useReducer, useRef, useLayoutEffect, useEffect, useMemo, useCallback } from 'react'
import { useCalendar } from '../components/calendar/useCalendar'
import { eventReducer, COLORS, formatDate, type CalendarEvent } from '../components/calendar/calendarTypes'
import CalendarGrid from '../components/calendar/CalendarGrid'
import EventPanel from '../components/calendar/EventPanel'

const initialEvents: CalendarEvent[] = [
  { id: '1', date: formatDate(new Date()), title: 'Today\'s event', color: COLORS[0] },
]

export default function Calendar() {
  const cal = useCalendar(new Date().getFullYear(), new Date().getMonth())
  const [events, dispatch] = useReducer(eventReducer, initialEvents)
  const [selectedDay, setSelectedDay] = useState<number | null>(new Date().getDate())
  const [newTitle, setNewTitle] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const gridRef = useRef<HTMLDivElement>(null)
  const cellSizes = useRef<Map<string, number>>(new Map())
  const focusedDay = useRef<HTMLButtonElement>(null)

  useLayoutEffect(() => {
    if (gridRef.current) {
      const cells = gridRef.current.querySelectorAll('[data-day]')
      cells.forEach((cell) => {
        const day = cell.getAttribute('data-day')
        if (day) cellSizes.current.set(day, cell.clientHeight)
      })
    }
  }, [cal.days])

  useEffect(() => {
    focusedDay.current?.focus()
  }, [cal.month])

  const selectedDate = selectedDay
    ? `${cal.year}-${String(cal.month + 1).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}`
    : ''

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

  const todayStr = formatDate(new Date())

  return (
    <div className="calendar-page">
      <div className="calendar-header">
        <button onClick={cal.prevMonth}>◀</button>
        <select
          value={cal.month}
          onChange={(e) => cal.setMonth(Number(e.target.value))}
          className="calendar-select-month"
        >
          {['January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'].map((m, i) => (
            <option key={m} value={i}>{m}</option>
          ))}
        </select>
        <select
          value={cal.year}
          onChange={(e) => cal.setYear(Number(e.target.value))}
          className="calendar-select-year"
        >
          {Array.from({ length: 21 }, (_, i) => 2020 + i).map((y) => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
        <button onClick={cal.nextMonth}>▶</button>
      </div>

      <CalendarGrid
        days={cal.days}
        year={cal.year}
        month={cal.month}
        todayStr={todayStr}
        selectedDay={selectedDay}
        allEvents={allEvents}
        onSelectDay={setSelectedDay}
        gridRef={gridRef}
        focusedDayRef={focusedDay}
      />

      <div className="calendar-bottom">
        <EventPanel
          selectedDay={selectedDay}
          month={cal.month}
          year={cal.year}
          newTitle={newTitle}
          editingId={editingId}
          editTitle={editTitle}
          dayEvents={dayEvents}
          onNewTitleChange={setNewTitle}
          onAdd={addEvent}
          onEditStart={(id, title) => { setEditingId(id); setEditTitle(title) }}
          onEditChange={setEditTitle}
          onEditCommit={(id) => { dispatch({ type: 'EDIT', id, title: editTitle }); setEditingId(null) }}
          onEditCancel={() => setEditingId(null)}
          onDelete={(id) => dispatch({ type: 'DELETE', id })}
        />
      </div>

      <div className="calendar-hint">
        Double-click event to edit · Arrow keys for day navigation
      </div>
    </div>
  )
}
