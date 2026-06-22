import { type CalendarEvent } from './calendarTypes'

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

type Props = {
  days: (number | null)[]
  year: number
  month: number
  todayStr: string
  selectedDay: number | null
  allEvents: CalendarEvent[]
  onSelectDay: (day: number) => void
  gridRef: React.RefObject<HTMLDivElement | null>
  focusedDayRef: React.RefObject<HTMLButtonElement | null>
}

export default function CalendarGrid({
  days, year, month, todayStr, selectedDay, allEvents,
  onSelectDay, gridRef, focusedDayRef,
}: Props) {
  return (
    <div
      ref={gridRef}
      className="calendar-grid"
    >
      {WEEKDAYS.map((d) => (
        <div key={d} className="calendar-weekday">
          {d}
        </div>
      ))}
      {days.map((day, i) => {
        const dateStr = day
          ? `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
          : ''
        const isToday = dateStr === todayStr
        const isSelected = day === selectedDay
        const dayEvts = allEvents.filter((e) => e.date === dateStr)
        return (
          <button
            key={i}
            data-day={day}
            ref={day === selectedDay ? focusedDayRef : undefined}
            onClick={() => day && onSelectDay(day)}
            className={`calendar-day${isToday ? ' calendar-day--today' : ''}${isSelected ? ' calendar-day--selected' : ''}`}
            disabled={!day}
          >
            <span className="calendar-day-number">{day}</span>
            {dayEvts.length > 0 && (
              <div className="calendar-day-dots">
                {dayEvts.slice(0, 3).map((e) => (
                  <div key={e.id} className="calendar-day-dot" style={{ background: e.color }} />
                ))}
              </div>
            )}
          </button>
        )
      })}
    </div>
  )
}
