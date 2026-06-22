import { useState, useMemo, useCallback, useDebugValue } from 'react'

export function useCalendar(initialYear: number, initialMonth: number) {
  const [year, setYear] = useState(initialYear)
  const [month, setMonth] = useState(initialMonth)

  useDebugValue({ year, month, label: `${month + 1}/${year}` })

  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const firstDay = new Date(year, month, 1).getDay()

  const days = useMemo(() => {
    const result: (number | null)[] = []
    for (let i = 0; i < firstDay; i++) result.push(null)
    for (let d = 1; d <= daysInMonth; d++) result.push(d)
    while (result.length % 7 !== 0) result.push(null)
    return result
  }, [daysInMonth, firstDay])

  const nextMonth = useCallback(() => {
    if (month === 11) { setYear((y) => y + 1); setMonth(0) }
    else setMonth((m) => m + 1)
  }, [month])

  const prevMonth = useCallback(() => {
    if (month === 0) { setYear((y) => y - 1); setMonth(11) }
    else setMonth((m) => m - 1)
  }, [month])

  return { year, month, days, nextMonth, prevMonth, setYear, setMonth }
}
