'use client'
import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { supabase, type Trip } from '@/lib/supabase'
import Navbar from '@/components/Navbar'

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
    }
    fetchTrip()
  }, [id, router])

  const handleDelete = async () => {
    if (!confirm('Delete this trip?')) return
    await supabase.from('trips').delete().eq('id', id)
    router.push('/dashboard')
  }

  const handleShare = () => {
    const url = window.location.href
    navigator.clipboard.writeText(url)
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

      {/* Hero */}
      <div style={{
        background: `linear-gradient(135deg, var(--color-soil) 0%, var(--color-bark) 100%)`,
        padding: '3.5rem 2rem',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', bottom: '-30%', right: '5%',
          width: '300px', height: '300px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(143,166,122,0.15) 0%, transparent 70%)',
        }} />
        <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative' }}>
          <Link href="/dashboard" style={{ color: 'var(--color-sage)', textDecoration: 'none', fontSize: '0.9rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
            ← Back to Dashboard
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

        {/* Info cards */}
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

        {/* Description */}
        {trip.description && (
          <div style={{ background: 'white', borderRadius: '16px', padding: '2rem', border: '1px solid var(--color-mist)', marginBottom: '2rem' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', color: 'var(--color-soil)', marginBottom: '1rem', fontWeight: 700 }}>
              📝 Trip Notes
            </h2>
            <p style={{ color: 'var(--color-dusk)', lineHeight: 1.8, fontSize: '0.95rem' }}>{trip.description}</p>
          </div>
        )}

        {/* Action buttons */}
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
            ✏️ Edit Trip
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
            {copied ? '✅ Link Copied!' : '🔗 Share Trip'}
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
            🗑️ Delete Trip
          </button>
        </div>
      </div>
    </div>
  )
}