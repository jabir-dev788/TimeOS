'use client'

import { useState, useEffect } from 'react'

interface ClockDisplayProps {
  city: string
  country: string
  timezone: string
}

export default function ClockDisplay({ city, country, timezone }: ClockDisplayProps) {
  const [time, setTime] = useState<string>('--:--:--')
  const [date, setDate] = useState<string>('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTime = async () => {
      try {
        const res = await fetch(`/api/time/${encodeURIComponent(city)}`)
        const data = await res.json()
        
        if (data.datetime) {
          const dateObj = new Date(data.datetime)
          setTime(dateObj.toLocaleTimeString('en-US', { 
            hour12: true,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
          }))
          setDate(dateObj.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            year: 'numeric'
          }))
        }
        setLoading(false)
      } catch (error) {
        console.error('Error fetching time:', error)
        setLoading(false)
      }
    }

    fetchTime()
    
    // Update every second
    const interval = setInterval(fetchTime, 1000)
    
    return () => clearInterval(interval)
  }, [city])

  if (loading) {
    return (
      <div className="p-4 bg-card rounded-lg shadow-sm animate-pulse">
        <div className="h-6 bg-muted rounded w-24 mb-2"></div>
        <div className="h-10 bg-muted rounded w-32 mb-2"></div>
        <div className="h-4 bg-muted rounded w-20"></div>
      </div>
    )
  }

  return (
    <div className="p-4 bg-card rounded-lg shadow-sm border border-border hover:shadow-md transition-shadow">
      <h3 className="font-semibold text-lg">{city}</h3>
      <p className="text-sm text-muted-foreground">{country}</p>
      <div className="mt-2">
        <span className="text-2xl font-mono font-bold">{time}</span>
      </div>
      <p className="text-xs text-muted-foreground mt-1">{date}</p>
      <p className="text-xs text-muted-foreground">{timezone}</p>
    </div>
  )
}