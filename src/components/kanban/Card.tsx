type Props = {
  card: { id: string; text: string }
  onDragStart: () => void
  onDelete: () => void
}

export default function Card({ card, onDragStart, onDelete }: Props) {
  return (
    <div
      draggable
      onDragStart={onDragStart}
      className="kanban-card"
    >
      <span>{card.text}</span>
      <button onClick={onDelete} className="kanban-btn-delete-card">
        ×
      </button>
    </div>
  )
}
