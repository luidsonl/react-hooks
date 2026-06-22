import '../styles/dashboard.css'
import { useState, useRef, useMemo, useCallback, useTransition, useEffect } from 'react'
import { useMetrics } from '../components/dashboard/useMetrics'
import { useTimeZone } from '../components/dashboard/useTimeZone'
import Gauge from '../components/dashboard/Gauge'
import CPUChart from '../components/dashboard/CPUChart'

type HistoryPoint = { time: string; value: number }

export default function Dashboard() {
  const metrics = useMetrics()
  const tz = useTimeZone()
  const [history, setHistory] = useState<HistoryPoint[]>([])
  const [paused, setPaused] = useState(false)
  const [isPending, startTransition] = useTransition()
  const historyRef = useRef<HistoryPoint[]>([])
  const intervalRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined)

  const addPoint = useCallback(() => {
    const now = new Date().toLocaleTimeString(tz, { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    const cpu = metrics.find((m) => m.label === 'CPU')?.value ?? 0
    historyRef.current = [...historyRef.current.slice(-19), { time: now, value: cpu }]
    startTransition(() => setHistory([...historyRef.current]))
  }, [metrics, tz])

  useEffect(() => {
    if (!paused) {
      intervalRef.current = setInterval(addPoint, 3000)
      return () => clearInterval(intervalRef.current)
    }
  }, [paused, addPoint])

  const avgCpu = useMemo(
    () => history.length ? (history.reduce((s, h) => s + h.value, 0) / history.length).toFixed(1) : '0',
    [history]
  )

  const maxMetric = useMemo(
    () => metrics.reduce((max, m) => m.value > max.value ? m : max, metrics[0]),
    [metrics]
  )

  return (
    <div className="page">
      <div className="dashboard-gauges">
        {metrics.map((m) => {
          const max = m.unit === '%' ? 100 : m.unit === 'GB' ? 16 : m.unit === 'Mbps' ? 1000 : 500
          return <Gauge key={m.label} {...m} max={max} />
        })}
      </div>

      <div className="dashboard-stats">
        <div className="island dashboard-stat">
          <div className="dashboard-stat-label">Avg CPU (last 20)</div>
          <div className="dashboard-stat-value">{avgCpu}%</div>
        </div>
        <div className="island dashboard-stat">
          <div className="dashboard-stat-label">Highest Metric</div>
          <div className="dashboard-stat-value" style={{ color: maxMetric.color }}>
            {maxMetric.label}: {maxMetric.value}{maxMetric.unit}
          </div>
        </div>
        <div className="island dashboard-stat">
          <div className="dashboard-stat-label">Timezone</div>
          <div className="dashboard-stat-value--tz">{tz}</div>
        </div>
      </div>

      <div className="dashboard-controls">
        <button onClick={() => setPaused((p) => !p)}>
          {paused ? 'Resume' : 'Pause'} Updates
        </button>
        {isPending && <span className="dashboard-pending">Rendering...</span>}
      </div>

      <div className="island dashboard-chart-island">
        <h4 className="dashboard-chart-title">CPU History (last 20 ticks)</h4>
        <CPUChart history={history} isPending={isPending} />
      </div>
    </div>
  )
}
