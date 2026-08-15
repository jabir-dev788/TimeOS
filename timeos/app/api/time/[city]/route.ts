import { NextRequest, NextResponse } from 'next/server'
import { redis } from '@/lib/redis'

// Preset cities with their timezones
const PRESET_CITIES = [
  { name: 'New York', timezone: 'America/New_York', country: 'USA' },
  { name: 'London', timezone: 'Europe/London', country: 'UK' },
  { name: 'Tokyo', timezone: 'Asia/Tokyo', country: 'Japan' },
  { name: 'Dubai', timezone: 'Asia/Dubai', country: 'UAE' },
  { name: 'Ramallah', timezone: 'Asia/Hebron', country: 'Palestine' },
  { name: 'Abuja', timezone: 'Africa/Lagos', country: 'Nigeria' },
  { name: 'Beijing', timezone: 'Asia/Shanghai', country: 'China' },
  { name: 'Moscow', timezone: 'Europe/Moscow', country: 'Russia' },
  { name: 'New Delhi', timezone: 'Asia/Kolkata', country: 'India' },
  { name: 'Riyadh', timezone: 'Asia/Riyadh', country: 'Saudi Arabia' },
  { name: 'Seoul', timezone: 'Asia/Seoul', country: 'South Korea' },
]

function getLocalTimeData(timezone: string) {
  const now = new Date()
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  })
  const parts = formatter.formatToParts(now)
  const p: Record<string, string> = {}
  parts.forEach(item => {
    if (item.type !== 'literal') p[item.type] = item.value
  })
  const hour = p.hour === '24' ? '00' : p.hour
  const datetime = `${p.year}-${p.month}-${p.day}T${hour}:${p.minute}:${p.second}`

  return {
    datetime,
    utc_datetime: now.toISOString(),
    timezone,
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ city: string }> }
) {
  try {
    const { city: cityParam } = await params
    const cityName = decodeURIComponent(cityParam)

    // Find city by name (case-insensitive)
    const city = PRESET_CITIES.find(
      c => c.name.toLowerCase() === cityName.toLowerCase()
    )

    if (!city) {
      return NextResponse.json(
        { error: 'City not found' },
        { status: 404 }
      )
    }

    // Check Redis cache first
    const cacheKey = `time:${city.timezone}`
    try {
      const cached = await redis.get(cacheKey)
      if (cached) {
        return NextResponse.json({
          ...cached,
          cached: true,
          city: city.name,
          country: city.country,
          timezone: city.timezone
        })
      }
    } catch (redisErr) {
      console.warn('Redis cache lookup skipped:', redisErr)
    }

    // Attempt external fetch with timeout
    try {
      const response = await fetch(
        `http://worldtimeapi.org/api/timezone/${city.timezone}`,
        { next: { revalidate: 60 }, signal: AbortSignal.timeout(2000) }
      )

      if (response.ok) {
        const data = await response.json()
        try {
          await redis.set(cacheKey, data, { ex: 3600 })
        } catch {}
        return NextResponse.json({
          ...data,
          cached: false,
          city: city.name,
          country: city.country,
          timezone: city.timezone
        })
      }
    } catch {
      // Fallback gracefully to high-precision local calculation if external API fails or times out
    }

    // Fallback to local time calculation
    const localData = getLocalTimeData(city.timezone)
    return NextResponse.json({
      ...localData,
      cached: false,
      city: city.name,
      country: city.country,
      timezone: city.timezone
    })

  } catch (error) {
    console.error('Time API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch time data' },
      { status: 500 }
    )
  }
}