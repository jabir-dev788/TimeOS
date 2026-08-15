'use client'

import { useState, useEffect } from 'react'

interface ClockDisplayProps {
  city: string
  country: string
  timezone: string
}

function getLocalTime(timezone: string) {
  const now = new Date()
  const time = now.toLocaleTimeString('en-US', {
    timeZone: timezone,
    hour12: true,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
  const date = now.toLocaleDateString('en-US', {
    timeZone: timezone,
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
  return { time, date }
}

export default function ClockDisplay({ city, country, timezone }: ClockDisplayProps) {
  const [time, setTime] = useState<string>('--:--:--')
  const [date, setDate] = useState<string>('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const update = () => {
      const { time, date } = getLocalTime(timezone)
      setTime(time)
      setDate(date)
      setLoading(false)
    }

    update()
    const interval = setInterval(update, 1000)
    return () => clearInterval(interval)
  }, [timezone])

  if (loading) {
    return (
      <div className="p-3 sm:p-4 bg-card rounded-lg shadow-sm animate-pulse">
        <div className="h-5 sm:h-6 bg-muted rounded w-20 sm:w-24 mb-2"></div>
        <div className="h-8 sm:h-10 bg-muted rounded w-24 sm:w-32 mb-2"></div>
        <div className="h-3 sm:h-4 bg-muted rounded w-16 sm:w-20"></div>
      </div>
    )
  }

  return (
    <div className="p-3 sm:p-4 bg-card rounded-lg shadow-sm border border-border hover:shadow-md transition-shadow">
      <h3 className="font-semibold text-sm sm:text-lg">{city}</h3>
      <p className="text-xs sm:text-sm text-muted-foreground">{country}</p>
      <div className="mt-1 sm:mt-2">
        <span className="text-xl sm:text-2xl font-mono font-bold">{time}</span>
      </div>
      <p className="text-xs text-muted-foreground mt-1">{date}</p>
      <p className="text-[10px] sm:text-xs text-muted-foreground truncate">{timezone}</p>
    </div>
  )
}