import { NextRequest, NextResponse } from 'next/server'
import { redis } from '@/lib/redis'

// 7 preset cities with their timezones
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

export async function GET(
  request: NextRequest,
  { params }: { params: { city: string } }
) {
  try {
    const cityName = decodeURIComponent(params.city)
    
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

    // Fetch from WorldTimeAPI
    const response = await fetch(
      `http://worldtimeapi.org/api/timezone/${city.timezone}`,
      { next: { revalidate: 60 } } // Cache for 60 seconds at Next.js level
    )
    
    if (!response.ok) {
      throw new Error('Failed to fetch time data')
    }
    
    const data = await response.json()
    
    // Store in Redis for 1 hour (3600 seconds)
    await redis.set(cacheKey, data, { ex: 3600 })
    
    return NextResponse.json({
      ...data,
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