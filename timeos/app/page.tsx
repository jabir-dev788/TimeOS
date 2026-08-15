import { createClient } from '@/lib/supabase/server'
import PresetCities from '@/components/clock/PresetCities'
import CitySearch from '@/components/clock/CitySearch'
import ThemeToggle from '@/components/ThemeToggle'

export default async function HomePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
        {/* Header */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div>
            <h1 className="text-2xl sm:text-4xl font-bold">TimeOS</h1>
            <p className="text-sm sm:text-base text-muted-foreground">World Clock & Time Management</p>
          </div>
          <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
            <ThemeToggle />
            {user ? (
              <a href="/dashboard" className="text-sm hover:underline">
                Dashboard
              </a>
            ) : (
              <div className="flex gap-2">
                <a href="/login" className="text-sm hover:underline">
                  Login
                </a>
                <a href="/signup" className="text-sm bg-primary text-primary-foreground px-3 py-1 rounded-md hover:bg-primary/90">
                  Sign Up
                </a>
              </div>
            )}
          </div>
        </header>

        {/* Search Section */}
        <section className="mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4">Find a City</h2>
          <CitySearch />
        </section>

        {/* Preset Cities */}
        <section>
          <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4">World Clock</h2>
          <PresetCities />
        </section>

        {/* User greeting */}
        {user && (
          <div className="mt-6 sm:mt-8 p-3 sm:p-4 bg-primary/10 rounded-lg text-sm sm:text-base">
            <p>Welcome back, {user.email}! 👋</p>
          </div>
        )}
      </div>
    </div>
  )
}