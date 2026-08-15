'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Play, Pause, RotateCcw, Bell } from 'lucide-react'

export default function CountdownTimer() {
  const [totalSeconds, setTotalSeconds] = useState(0)
  const [remaining, setRemaining] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [inputMinutes, setInputMinutes] = useState('')
  const [inputSeconds, setInputSeconds] = useState('')
  const [isComplete, setIsComplete] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    // Create audio element for alert
    audioRef.current = new Audio('/notification.mp3') // Add this file to public folder
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [])

  useEffect(() => {
    if (isRunning && remaining > 0) {
      intervalRef.current = setInterval(() => {
        setRemaining((prev) => {
          if (prev <= 1) {
            setIsRunning(false)
            setIsComplete(true)
            audioRef.current?.play()
            return 0
          }
          return prev - 1
        })
      }, 1000)
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
  }, [isRunning, remaining])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
  }

  const handleSetTimer = () => {
    const mins = parseInt(inputMinutes) || 0
    const secs = parseInt(inputSeconds) || 0
    const total = mins * 60 + secs
    if (total > 0) {
      setTotalSeconds(total)
      setRemaining(total)
      setIsComplete(false)
      setIsRunning(false)
    }
  }

  const handleStart = () => {
    if (remaining > 0) {
      setIsRunning(true)
      setIsComplete(false)
    }
  }

  const handlePause = () => setIsRunning(false)

  const handleReset = () => {
    setIsRunning(false)
    setRemaining(totalSeconds)
    setIsComplete(false)
  }

  const handleClear = () => {
    setIsRunning(false)
    setTotalSeconds(0)
    setRemaining(0)
    setInputMinutes('')
    setInputSeconds('')
    setIsComplete(false)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Countdown Timer</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {totalSeconds === 0 ? (
          // Setup mode
          <div className="space-y-4">
            <div className="flex gap-2">
              <div className="flex-1">
                <label className="text-sm text-muted-foreground">Minutes</label>
                <Input
                  type="number"
                  placeholder="0"
                  min="0"
                  max="99"
                  value={inputMinutes}
                  onChange={(e) => setInputMinutes(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div className="flex-1">
                <label className="text-sm text-muted-foreground">Seconds</label>
                <Input
                  type="number"
                  placeholder="0"
                  min="0"
                  max="59"
                  value={inputSeconds}
                  onChange={(e) => setInputSeconds(e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>
            <Button onClick={handleSetTimer} className="w-full">
              Set Timer
            </Button>
          </div>
        ) : (
          <>
            <div className="text-4xl font-mono font-bold text-center py-4">
              {formatTime(remaining)}
            </div>

            {isComplete && (
              <div className="bg-primary/10 text-primary p-3 rounded-lg text-center flex items-center justify-center gap-2">
                <Bell className="h-4 w-4" />
                <span>Time&apos;s Up!</span>
              </div>
            )}

            <div className="flex justify-center gap-2 flex-wrap">
              {!isRunning && !isComplete ? (
                <Button onClick={handleStart} className="gap-2">
                  <Play className="h-4 w-4" /> Start
                </Button>
              ) : isRunning ? (
                <Button onClick={handlePause} variant="outline" className="gap-2">
                  <Pause className="h-4 w-4" /> Pause
                </Button>
              ) : null}
              <Button onClick={handleReset} variant="secondary" disabled={remaining === totalSeconds} className="gap-2">
                <RotateCcw className="h-4 w-4" /> Reset
              </Button>
              <Button onClick={handleClear} variant="destructive" className="gap-2">
                Clear
              </Button>
            </div>

            {isComplete && (
              <Button onClick={handleClear} className="w-full">
                Set New Timer
              </Button>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}