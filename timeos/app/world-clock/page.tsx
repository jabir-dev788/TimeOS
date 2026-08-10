import PresetCities from '@/components/clock/PresetCities'
import CitySearch from '@/components/clock/CitySearch'
import ThemeToggle from '@/components/ThemeToggle'

export default function WorldClockPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">World Clock</h1>
            <p className="text-muted-foreground">Time zones around the world</p>
          </div>
          <ThemeToggle />
        </header>

        <section className="mb-8">
          <CitySearch onAddCity={(city) => {
            console.log('Add city:', city)
          }} />
        </section>

        <section>
          <PresetCities />
        </section>
      </div>
    </div>
  )
}