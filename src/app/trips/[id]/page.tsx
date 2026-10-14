'use client'
import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { supabase, type Trip } from '@/lib/supabase'
import Navbar from '@/components/Navbar'
import dynamic from 'next/dynamic'

const MapComponent = dynamic(() => import('@/components/Map'), { ssr: false })

const statusColors: Record<string, string> = {
  planned: 'var(--color-sand)',
  ongoing: 'var(--color-sage)',
  completed: 'var(--color-stone)',
}

const statusLabels: Record<string, string> = {
  planned: '📍 Planned',
  ongoing: '✈️ Ongoing',
  completed: '✅ Completed',
}

export default function TripDetailPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string
  const [trip, setTrip] = useState<Trip | null>(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)
  const [photos, setPhotos] = useState<string[]>([])
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    const fetchTrip = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { router.push('/login'); return }
      const { data, error } = await supabase
        .from('trips')
        .select('*')
        .eq('id', id)
        .single()
      if (error || !data) { router.push('/dashboard'); return }
      setTrip(data as Trip)
      setLoading(false)
      fetchPhotos()
    }
    fetchTrip()
  }, [id, router])

  const fetchPhotos = async () => {
    const { data } = await supabase.storage
      .from('trip-photos')
      .list(`${id}/`)
    if (data) {
      const urls = data.map(file => {
        const { data: urlData } = supabase.storage
          .from('trip-photos')
          .getPublicUrl(`${id}/${file.name}`)
        return urlData.publicUrl
      })
      setPhotos(urls)
    }
  }

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return
    setUploading(true)
    for (const file of Array.from(files)) {
      const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
      await supabase.storage
        .from('trip-photos')
        .upload(`${id}/${fileName}`, file, { cacheControl: '3600', upsert: true })
    }
    await fetchPhotos()
    setUploading(false)
  }

  const handleDelete = async () => {
    if (!confirm('Delete this trip?')) return
    await supabase.from('trips').delete().eq('id', id)
    router.push('/dashboard')
  }

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })

  const getDuration = (start: string, end: string) => {
    const diff = Math.ceil((new Date(end).getTime() - new Date(start).getTime()) / (1000 * 60 * 60 * 24))
    return `${diff} day${diff !== 1 ? 's' : ''}`
  }

  if (loading) return (
    <div style={{ minHeight: '100vh', background: 'var(--color-cream)' }}>
      <Navbar />
      <div style={{ textAlign: 'center', padding: '6rem', color: 'var(--color-stone)' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🌿</div>
        <p>Loading your trip...</p>
      </div>
    </div>
  )

  if (!trip) return null

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-cream)' }}>
      <Navbar />

      <div style={{
        background: `linear-gradient(135deg, var(--color-soil) 0%, var(--color-bark) 100%)`,
        padding: '3.5rem 2rem',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative' }}>
          <Link href="/dashboard" style={{ color: 'var(--color-sage)', textDecoration: 'none', fontSize: '0.9rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
            Back to Dashboard
          </Link>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 4vw, 3rem)', color: 'var(--color-parchment)', fontWeight: 800, marginBottom: '0.5rem' }}>
                {trip.title}
              </h1>
              <p style={{ color: 'var(--color-sand)', fontSize: '1.1rem', fontWeight: 600 }}>📍 {trip.destination}</p>
            </div>
            <span style={{
              background: statusColors[trip.status] + '22',
              color: statusColors[trip.status],
              fontSize: '0.9rem',
              fontWeight: 600,
              padding: '0.5rem 1.25rem',
              borderRadius: '20px',
              border: `1px solid ${statusColors[trip.status]}44`,
            }}>
              {statusLabels[trip.status]}
            </span>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2.5rem 2rem' }}>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          {[
            { icon: '📅', label: 'Start Date', value: formatDate(trip.start_date) },
            { icon: '🏁', label: 'End Date', value: formatDate(trip.end_date) },
            { icon: '⏱', label: 'Duration', value: getDuration(trip.start_date, trip.end_date) },
            { icon: '🗓', label: 'Created', value: formatDate(trip.created_at) },
          ].map(info => (
            <div key={info.label} style={{ background: 'white', borderRadius: '12px', padding: '1.25rem', border: '1px solid var(--color-mist)' }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{info.icon}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-stone)', marginBottom: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{info.label}</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', color: 'var(--color-soil)', fontWeight: 600 }}>{info.value}</div>
            </div>
          ))}
        </div>

        <div style={{ background: 'white', borderRadius: '16px', padding: '2rem', border: '1px solid var(--color-mist)', marginBottom: '2rem' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', color: 'var(--color-soil)', marginBottom: '1rem', fontWeight: 700 }}>
            🗺️ Destination Map
          </h2>
          <MapComponent destination={trip.destination} />
        </div>

        {trip.description && (
          <div style={{ background: 'white', borderRadius: '16px', padding: '2rem', border: '1px solid var(--color-mist)', marginBottom: '2rem' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', color: 'var(--color-soil)', marginBottom: '1rem', fontWeight: 700 }}>
              📝 Trip Notes
            </h2>
            <p style={{ color: 'var(--color-dusk)', lineHeight: 1.8, fontSize: '0.95rem' }}>{trip.description}</p>
          </div>
        )}

        <div style={{ background: 'white', borderRadius: '16px', padding: '2rem', border: '1px solid var(--color-mist)', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', color: 'var(--color-soil)', fontWeight: 700 }}>
              📸 Trip Photos
            </h2>
            <label style={{
              background: 'var(--color-moss)',
              color: 'var(--color-cream)',
              padding: '0.6rem 1.25rem',
              borderRadius: '8px',
              cursor: 'pointer',
              fontFamily: 'var(--font-body)',
              fontWeight: 600,
              fontSize: '0.875rem',
            }}>
              {uploading ? 'Uploading...' : '+ Add Photos'}
              <input type="file" accept="image/*" multiple onChange={handlePhotoUpload} style={{ display: 'none' }} />
            </label>
          </div>
          {photos.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', background: 'var(--color-cream)', borderRadius: '12px', border: '2px dashed var(--color-mist)' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>📷</div>
              <p style={{ color: 'var(--color-stone)', fontSize: '0.9rem' }}>No photos yet. Add some memories!</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
              {photos.map((url, i) => (
                <div key={i} style={{ borderRadius: '12px', overflow: 'hidden', aspectRatio: '1', background: 'var(--color-mist)' }}>
                  <img src={url} alt={`Trip photo ${i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <Link href={`/trips/${id}/edit`} style={{
            background: 'var(--color-soil)',
            color: 'var(--color-parchment)',
            padding: '0.85rem 1.75rem',
            borderRadius: '10px',
            textDecoration: 'none',
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            fontSize: '0.95rem',
          }}>
            Edit Trip
          </Link>
          <button onClick={handleShare} style={{
            background: copied ? 'var(--color-moss)' : 'white',
            color: copied ? 'var(--color-cream)' : 'var(--color-soil)',
            border: '1.5px solid var(--color-mist)',
            padding: '0.85rem 1.75rem',
            borderRadius: '10px',
            cursor: 'pointer',
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            fontSize: '0.95rem',
            transition: 'all 0.2s',
          }}>
            {copied ? 'Link Copied!' : 'Share Trip'}
          </button>
          <button onClick={handleDelete} style={{
            background: 'transparent',
            border: '1.5px solid #fca5a5',
            color: '#ef4444',
            padding: '0.85rem 1.75rem',
            borderRadius: '10px',
            cursor: 'pointer',
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            fontSize: '0.95rem',
          }}>
            Delete Trip
          </button>
        </div>
      </div>
    </div>
  )
}