'use client'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useState, useEffect } from 'react'
import ClockDisplay from './ClockDisplay'

const PRESET_CITIES = [
  { name: 'New York', country: 'USA', timezone: 'America/New_York' },
  { name: 'London', country: 'UK', timezone: 'Europe/London' },
  { name: 'Tokyo', country: 'Japan', timezone: 'Asia/Tokyo' },
  { name: 'Dubai', country: 'UAE', timezone: 'Asia/Dubai' },
  { name: 'Ramallah', country: 'Palestine', timezone: 'Asia/Hebron' },
  { name: 'Abuja', country: 'Nigeria', timezone: 'Africa/Lagos' },
  { name: 'Beijing', country: 'China', timezone: 'Asia/Shanghai' },
]

export default function PresetCities() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {PRESET_CITIES.map((city) => (
        <ClockDisplay
          key={city.name}
          city={city.name}
          country={city.country}
          timezone={city.timezone}
        />
      ))}
    </div>
  )
}