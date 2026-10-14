'use client'
import { useEffect, useState } from 'react'

interface WeatherData {
  temperature: number
  weathercode: number
  windspeed: number
  humidity: number
}

const weatherDescriptions: Record<number, { label: string; emoji: string }> = {
  0: { label: 'Clear sky', emoji: '☀️' },
  1: { label: 'Mainly clear', emoji: '🌤️' },
  2: { label: 'Partly cloudy', emoji: '⛅' },
  3: { label: 'Overcast', emoji: '☁️' },
  45: { label: 'Foggy', emoji: '🌫️' },
  48: { label: 'Foggy', emoji: '🌫️' },
  51: { label: 'Light drizzle', emoji: '🌦️' },
  61: { label: 'Light rain', emoji: '🌧️' },
  63: { label: 'Moderate rain', emoji: '🌧️' },
  65: { label: 'Heavy rain', emoji: '🌧️' },
  71: { label: 'Light snow', emoji: '❄️' },
  73: { label: 'Moderate snow', emoji: '❄️' },
  75: { label: 'Heavy snow', emoji: '❄️' },
  80: { label: 'Rain showers', emoji: '🌦️' },
  85: { label: 'Snow showers', emoji: '🌨️' },
  95: { label: 'Thunderstorm', emoji: '⛈️' },
}

interface WeatherProps {
  destination: string
}

export default function Weather({ destination }: WeatherProps) {
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const geoRes = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(destination)}&format=json&limit=1`
        )
        const geoData = await geoRes.json()
        if (!geoData || !geoData[0]) { setError(true); setLoading(false); return }

        const { lat, lon } = geoData[0]
        const weatherRes = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=relativehumidity_2m&timezone=auto`
        )
        const weatherData = await weatherRes.json()
        const current = weatherData.current_weather

        setWeather({
          temperature: Math.round(current.temperature),
          weathercode: current.weathercode,
          windspeed: Math.round(current.windspeed),
          humidity: weatherData.hourly.relativehumidity_2m[0],
        })
      } catch {
        setError(true)
      }
      setLoading(false)
    }
    fetchWeather()
  }, [destination])

  if (loading) return (
    <div style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--color-stone)' }}>
      Loading weather...
    </div>
  )

  if (error || !weather) return (
    <div style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--color-stone)' }}>
      Weather data unavailable for this destination.
    </div>
  )

  const condition = weatherDescriptions[weather.weathercode] || { label: 'Unknown', emoji: '🌡️' }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '1rem' }}>
      <div style={{ background: 'var(--color-cream)', borderRadius: '12px', padding: '1.25rem', textAlign: 'center', border: '1px solid var(--color-mist)' }}>
        <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{condition.emoji}</div>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 700, color: 'var(--color-soil)' }}>{weather.temperature}°C</div>
        <div style={{ color: 'var(--color-stone)', fontSize: '0.85rem' }}>{condition.label}</div>
      </div>
      <div style={{ background: 'var(--color-cream)', borderRadius: '12px', padding: '1.25rem', textAlign: 'center', border: '1px solid var(--color-mist)' }}>
        <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>💨</div>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-soil)' }}>{weather.windspeed} km/h</div>
        <div style={{ color: 'var(--color-stone)', fontSize: '0.85rem' }}>Wind Speed</div>
      </div>
      <div style={{ background: 'var(--color-cream)', borderRadius: '12px', padding: '1.25rem', textAlign: 'center', border: '1px solid var(--color-mist)' }}>
        <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>💧</div>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-soil)' }}>{weather.humidity}%</div>
        <div style={{ color: 'var(--color-stone)', fontSize: '0.85rem' }}>Humidity</div>
      </div>
    </div>
  )
}