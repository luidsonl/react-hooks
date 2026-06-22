import { useState, useEffect, useDebugValue } from 'react'

export type Metric = { label: string; value: number; unit: string; color: string }

export function useMetrics() {
  const [metrics, setMetrics] = useState<Metric[]>([
    { label: 'CPU', value: 23, unit: '%', color: '#6366f1' },
    { label: 'Memory', value: 4.2, unit: 'GB', color: '#22c55e' },
    { label: 'Network', value: 156, unit: 'Mbps', color: '#eab308' },
    { label: 'Disk I/O', value: 42, unit: 'MB/s', color: '#ef4444' },
  ])

  useDebugValue(metrics.map((m) => `${m.label}: ${m.value}${m.unit}`).join(', '))

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics((prev) =>
        prev.map((m) => ({
          ...m,
          value: m.label === 'Memory'
            ? Number((m.value + (Math.random() - 0.5) * 0.5).toFixed(1))
            : Math.max(0, Math.round(m.value + (Math.random() - 0.5) * 20)),
        }))
      )
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  return metrics
}
