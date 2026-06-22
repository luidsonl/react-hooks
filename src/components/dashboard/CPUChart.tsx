type HistoryPoint = { time: string; value: number }

type Props = {
  history: HistoryPoint[]
  isPending: boolean
}

export default function CPUChart({ history, isPending }: Props) {
  if (history.length === 0) {
    return (
      <div className="dashboard-chart-empty">
        Waiting for data...
      </div>
    )
  }

  return (
    <div className={`dashboard-chart${isPending ? ' dashboard-chart--pending' : ''}`}>
      {history.map((h, i) => (
        <div key={i} className="dashboard-chart-bar-group">
          <div className="dashboard-chart-bar" style={{ height: `${h.value}%` }} />
          {history.length <= 15 && (
            <span className="dashboard-chart-label">
              {h.time.slice(0, 5)}
            </span>
          )}
        </div>
      ))}
    </div>
  )
}
