'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, X } from 'lucide-react'

interface CityResult {
  name: string
  country: string
  timezone: string
}

interface CitySearchProps {
  onAddCity: (city: CityResult) => void
}

export default function CitySearch({ onAddCity }: CitySearchProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<CityResult[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const searchCities = async () => {
    if (query.length < 2) return
    
    setLoading(true)
    setError('')
    
    try {
      const res = await fetch(`/api/time/search?q=${encodeURIComponent(query)}`)
      const data = await res.json()
      
      if (data.cities) {
        setResults(data.cities)
      } else {
        setResults([])
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setError('Failed to search cities')
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      searchCities()
    }
  }

  const clearSearch = () => {
    setQuery('')
    setResults([])
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Input
            type="text"
            placeholder="Search for a city..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="pl-10"
          />
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          {query && (
            <button
              onClick={clearSearch}
              className="absolute right-3 top-2.5"
            >
              <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
            </button>
          )}
        </div>
        <Button onClick={searchCities} disabled={loading}>
          {loading ? 'Searching...' : 'Search'}
        </Button>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      {results.length > 0 && (
        <div className="border rounded-lg divide-y">
          {results.map((city) => (
            <div
              key={`${city.name}-${city.country}`}
              className="p-3 hover:bg-muted cursor-pointer flex justify-between items-center"
              onClick={() => {
                onAddCity(city)
                clearSearch()
              }}
            >
              <div>
                <p className="font-medium">{city.name}</p>
                <p className="text-sm text-muted-foreground">{city.country}</p>
              </div>
              <Button variant="outline" size="sm">
                Add
              </Button>
            </div>
          ))}
        </div>
      )}

      {results.length === 0 && query.length >= 2 && !loading && (
        <p className="text-sm text-muted-foreground">No cities found</p>
      )}
    </div>
  )
}