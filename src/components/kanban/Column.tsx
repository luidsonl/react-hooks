import { useMemo } from 'react'
import Card from './Card'

export type ColumnData = { id: string; title: string; cardIds: string[] }

type Props = {
  column: ColumnData
  cards: Map<string, { id: string; text: string }>
  onDragStart: (cardId: string, colId: string) => void
  onDragOver: (e: React.DragEvent, colId: string) => void
  onDrop: (colId: string) => void
  onDeleteColumn: (id: string) => void
  onDeleteCard: (id: string) => void
  colRef?: (el: HTMLDivElement | null) => void
}

export default function Column({
  column, cards, onDragStart, onDragOver, onDrop,
  onDeleteColumn, onDeleteCard, colRef,
}: Props) {
  const columnCards = useMemo(
    () => column.cardIds.map((id) => cards.get(id)).filter(Boolean),
    [column.cardIds, cards]
  )

  return (
    <div
      ref={colRef}
      onDragOver={(e) => onDragOver(e, column.id)}
      onDrop={() => onDrop(column.id)}
      className="kanban-column"
    >
      <div className="kanban-column-header">
        <h3 className="kanban-column-title">
          {column.title}
          <span className="kanban-column-count">
            ({column.cardIds.length})
          </span>
        </h3>
        <button onClick={() => onDeleteColumn(column.id)} className="kanban-btn-delete-col">
          ×
        </button>
      </div>
      <div className="kanban-card-list">
        {columnCards.map((card) =>
          card && (
            <Card
              key={card.id}
              card={card}
              onDragStart={() => onDragStart(card.id, column.id)}
              onDelete={() => onDeleteCard(card.id)}
            />
          )
        )}
      </div>
    </div>
  )
}
