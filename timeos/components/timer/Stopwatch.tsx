
'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Play, Pause, RotateCcw, Flag } from 'lucide-react'

export default function Stopwatch() {
  const [time, setTime] = useState(0) // milliseconds
  const [isRunning, setIsRunning] = useState(false)
  const [laps, setLaps] = useState<number[]>([])
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTime((prev) => prev + 10) // update every 10ms
      }, 10)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isRunning])

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000)
    const seconds = Math.floor((ms % 60000) / 1000)
    const milliseconds = Math.floor((ms % 1000) / 10)
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(milliseconds).padStart(2, '0')}`
  }

  const handleStart = () => setIsRunning(true)
  const handlePause = () => setIsRunning(false)
  const handleReset = () => {
    setIsRunning(false)
    setTime(0)
    setLaps([])
  }
  const handleLap = () => {
    if (time > 0) {
      setLaps((prev) => [...prev, time])
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Stopwatch</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-4xl font-mono font-bold text-center py-4">
          {formatTime(time)}
        </div>

        <div className="flex justify-center gap-2 flex-wrap">
          {!isRunning ? (
            <Button onClick={handleStart} className="gap-2">
              <Play className="h-4 w-4" /> Start
            </Button>
          ) : (
            <Button onClick={handlePause} variant="outline" className="gap-2">
              <Pause className="h-4 w-4" /> Pause
            </Button>
          )}
          <Button onClick={handleLap} variant="secondary" disabled={!isRunning || time === 0} className="gap-2">
            <Flag className="h-4 w-4" /> Lap
          </Button>
          <Button onClick={handleReset} variant="destructive" className="gap-2">
            <RotateCcw className="h-4 w-4" /> Reset
          </Button>
        </div>

        {laps.length > 0 && (
          <div className="mt-4 max-h-40 overflow-y-auto">
            <h4 className="text-sm font-medium mb-2">Laps</h4>
            <div className="space-y-1">
              {laps.map((lapTime, index) => (
                <div key={index} className="flex justify-between text-sm py-1 border-b border-border">
                  <span>Lap {index + 1}</span>
                  <span className="font-mono">{formatTime(lapTime)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}