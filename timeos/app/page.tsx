import { createClient } from '@/lib/supabase/server'
import PresetCities from '@/components/clock/PresetCities'
import CitySearch from '@/components/clock/CitySearch'
import ThemeToggle from '@/components/ThemeToggle'

export default async function HomePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold">TimeOS</h1>
            <p className="text-muted-foreground">World Clock & Time Management</p>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            {user ? (
              <a href="/dashboard" className="text-sm hover:underline">
                Dashboard
              </a>
            ) : (
              <a href="/login" className="text-sm hover:underline">
                Login
              </a>
            )}
          </div>
        </header>

        {/* Search Section */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Find a City</h2>
          <CitySearch onAddCity={(city) => {
            // We'll implement adding cities later
            console.log('Add city:', city)
          }} />
        </section>

        {/* Preset Cities */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">World Clock</h2>
          <PresetCities />
        </section>

        {/* User greeting */}
        {user && (
          <div className="mt-8 p-4 bg-primary/10 rounded-lg">
            <p>Welcome back, {user.email}! 👋</p>
          </div>
        )}
      </div>
    </div>
  )
}