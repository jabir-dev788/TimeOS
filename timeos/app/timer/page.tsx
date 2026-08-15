
import Stopwatch from '@/components/timer/Stopwatch'
import CountdownTimer from '@/components/timer/CountdownTimer'

export default function TimerPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2">Timers</h1>
        <p className="text-muted-foreground mb-8">Stopwatch and countdown timer</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Stopwatch />
          <CountdownTimer />
        </div>
      </div>
    </div>
  )
}