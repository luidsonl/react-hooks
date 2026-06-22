import { type CalendarEvent, MONTHS } from './calendarTypes'

type Props = {
  selectedDay: number | null
  month: number
  year: number
  newTitle: string
  editingId: string | null
  editTitle: string
  dayEvents: CalendarEvent[]
  onNewTitleChange: (v: string) => void
  onAdd: () => void
  onEditStart: (id: string, title: string) => void
  onEditChange: (v: string) => void
  onEditCommit: (id: string) => void
  onEditCancel: () => void
  onDelete: (id: string) => void
}

export default function EventPanel({
  selectedDay, month, year, newTitle, editingId, editTitle, dayEvents,
  onNewTitleChange, onAdd, onEditStart, onEditChange, onEditCommit,
  onEditCancel, onDelete,
}: Props) {
  return (
    <div className="island" style={{ flex: 1 }}>
      <h4 className="calendar-panel-title">
        {selectedDay ? `${MONTHS[month]} ${selectedDay}, ${year}` : 'Select a day'}
      </h4>
      <div className="calendar-input-row">
        <input
          value={newTitle}
          onChange={(e) => onNewTitleChange(e.target.value)}
          placeholder="Event title"
          onKeyDown={(e) => e.key === 'Enter' && onAdd()}
        />
        <button onClick={onAdd} disabled={!selectedDay || !newTitle.trim()}>Add</button>
      </div>
      {dayEvents.length === 0 && (
        <div className="calendar-no-events">No events</div>
      )}
      {dayEvents.map((e) => (
        <div key={e.id} className="calendar-event-row">
          <div className="calendar-event-dot" style={{ background: e.color }} />
          {editingId === e.id ? (
            <input
              value={editTitle}
              onChange={(ev) => onEditChange(ev.target.value)}
              onKeyDown={(ev) => {
                if (ev.key === 'Enter') onEditCommit(e.id)
                if (ev.key === 'Escape') onEditCancel()
              }}
              className="calendar-edit-input"
              autoFocus
            />
          ) : (
            <span
              className="calendar-event-title"
              onDoubleClick={() => onEditStart(e.id, e.title)}
            >
              {e.title}
            </span>
          )}
          <button
            onClick={() => onDelete(e.id)}
            className="calendar-delete-btn"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  )
}
