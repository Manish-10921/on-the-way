'use client'
import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

// Fix leaflet marker icons
const icon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

interface MapProps {
  destination: string
}

export default function Map({ destination }: MapProps) {
  const [coords, setCoords] = useState<[number, number] | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCoords = async () => {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(destination)}&format=json&limit=1`
        )
        const data = await res.json()
        if (data && data[0]) {
          setCoords([parseFloat(data[0].lat), parseFloat(data[0].lon)])
        }
      } catch {
        console.error('Could not find location')
      }
      setLoading(false)
    }
    fetchCoords()
  }, [destination])

  if (loading) return (
    <div style={{ height: '300px', background: 'var(--color-mist)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: 'var(--color-stone)' }}>Loading map...</p>
    </div>
  )

  if (!coords) return (
    <div style={{ height: '300px', background: 'var(--color-mist)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: 'var(--color-stone)' }}>Could not find location on map.</p>
    </div>
  )

  return (
    <MapContainer
      center={coords}
      zoom={10}
      style={{ height: '300px', borderRadius: '12px', zIndex: 1 }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={coords} icon={icon}>
        <Popup>{destination}</Popup>
      </Marker>
    </MapContainer>
  )
}