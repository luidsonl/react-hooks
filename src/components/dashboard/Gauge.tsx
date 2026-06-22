type Props = {
  label: string
  value: number
  unit: string
  max: number
  color: string
}

export default function Gauge({ label, value, unit, max, color }: Props) {
  const pct = Math.min((value / max) * 100, 100)
  return (
    <div className="island dashboard-gauge">
      <div className="dashboard-gauge-label">{label}</div>
      <div className="dashboard-gauge-value" style={{ color }}>
        {value}{unit}
      </div>
      <div className="dashboard-gauge-track">
        <div className="dashboard-gauge-fill" style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  )
}
