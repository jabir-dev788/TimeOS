import { NextRequest, NextResponse } from 'next/server'
import { redis } from '@/lib/redis'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get('q')
  
  if (!query || query.length < 2) {
    return NextResponse.json({ cities: [] })
  }

  try {
    // Check Redis cache
    const cacheKey = `search:${query.toLowerCase()}`
    const cached = await redis.get(cacheKey)
    
    if (cached) {
      return NextResponse.json({ cities: cached, cached: true })
    }

    // Use GeoNames API (free, needs account)
    // Free tier: 1000 credits/day
    const username = process.env.GEONAMES_USERNAME || 'demo' // Replace with your username
    
    const response = await fetch(
      `http://api.geonames.org/search?q=${encodeURIComponent(query)}&maxRows=10&username=${username}&featureClass=P&type=json`
    )
    
    if (!response.ok) {
      throw new Error('GeoNames API error')
    }
    
    const data = await response.json()
    
    // Extract city names and timezones
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const cities = data.geonames?.map((item: any) => ({
      name: item.name,
      country: item.countryName,
      timezone: item.timezone?.timeZoneId || 'UTC',
      lat: item.lat,
      lng: item.lng
    })) || []
    
    // Cache for 24 hours
    await redis.set(cacheKey, cities, { ex: 86400 })
    
    return NextResponse.json({ cities, cached: false })
    
  } catch (error) {
    console.error('Search API error:', error)
    return NextResponse.json(
      { error: 'Failed to search cities' },
      { status: 500 }
    )
  }
}