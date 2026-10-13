'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
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

export default function Dashboard() {
  const router = useRouter()
  const [trips, setTrips] = useState<Trip[]>([])
  const [loading, setLoading] = useState(true)
  const [userEmail, setUserEmail] = useState('')

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/login')
        return
      }
      setUserEmail(session.user.email ?? '')
      await fetchTrips(session.user.id)
    }
    init()
  }, [router])

  const fetchTrips = async (userId: string) => {
    const { data, error } = await supabase
      .from('trips')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (!error && data) setTrips(data as Trip[])
    setLoading(false)
  }

  const deleteTrip = async (id: string) => {
    if (!confirm('Delete this trip?')) return
    await supabase.from('trips').delete().eq('id', id)
    setTrips(prev => prev.filter(t => t.id !== id))
  }

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

  const getDuration = (start: string, end: string) => {
    const diff = Math.ceil((new Date(end).getTime() - new Date(start).getTime()) / (1000 * 60 * 60 * 24))
    return `${diff} day${diff !== 1 ? 's' : ''}`
  }

  const userName = userEmail.split('@')[0]

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-cream)' }}>
      <Navbar />

      <div style={{
        background: `linear-gradient(135deg, var(--color-soil) 0%, var(--color-bark) 100%)`,
        padding: '3.5rem 2rem',
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <p style={{ color: 'var(--color-sage)', fontSize: '0.85rem', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
            Your Journey Map
          </p>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            color: 'var(--color-parchment)',
            fontWeight: 700,
            marginBottom: '0.5rem',
          }}>
            Welcome back, <span style={{ color: 'var(--color-sand)', fontStyle: 'italic' }}>{userName}</span>
          </h1>
          <p style={{ color: 'var(--color-stone)', fontSize: '1rem' }}>
            {trips.length === 0
              ? 'No trips yet — the world is waiting!'
              : `You have ${trips.length} trip${trips.length !== 1 ? 's' : ''} planned.`}
          </p>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2.5rem 2rem' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
          gap: '1rem',
          marginBottom: '2.5rem',
        }}>
          {[
            { label: 'Total Trips', value: trips.length, icon: '🗺️' },
            { label: 'Planned', value: trips.filter(t => t.status === 'planned').length, icon: '📍' },
            { label: 'Ongoing', value: trips.filter(t => t.status === 'ongoing').length, icon: '✈️' },
            { label: 'Completed', value: trips.filter(t => t.status === 'completed').length, icon: '✅' },
          ].map(stat => (
            <div key={stat.label} style={{
              background: 'white',
              border: '1px solid var(--color-mist)',
              borderRadius: '12px',
              padding: '1.25rem',
              textAlign: 'center',
            }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>{stat.icon}</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 700, color: 'var(--color-soil)' }}>
                {stat.value}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-stone)' }}>{stat.label}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: 'var(--color-soil)' }}>
            My Trips
          </h2>
          <Link href="/trips/new" style={{
            background: 'var(--color-soil)',
            color: 'var(--color-parchment)',
            padding: '0.7rem 1.5rem',
            borderRadius: '8px',
            textDecoration: 'none',
            fontWeight: 600,
            fontSize: '0.9rem',
          }}>
            + New Trip
          </Link>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--color-stone)' }}>
            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🌿</div>
            <p>Loading your adventures...</p>
          </div>
        ) : trips.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '5rem 2rem',
            background: 'white',
            borderRadius: '20px',
            border: '2px dashed var(--color-mist)',
          }}>
            <div style={{ fontSize: '3.5rem', marginBottom: '1.5rem' }}>🧳</div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: 'var(--color-soil)', marginBottom: '0.75rem' }}>
              Your adventure log is empty
            </h3>
            <p style={{ color: 'var(--color-stone)', marginBottom: '2rem' }}>
              Start planning your first trip and the world opens up.
            </p>
            <Link href="/trips/new" style={{
              background: 'var(--color-moss)',
              color: 'var(--color-cream)',
              padding: '0.85rem 2rem',
              borderRadius: '8px',
              textDecoration: 'none',
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
            }}>
              Plan My First Trip
            </Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
            {trips.map(trip => (
              <div key={trip.id} style={{
                background: 'white',
                borderRadius: '16px',
                border: '1px solid var(--color-mist)',
                overflow: 'hidden',
              }}>
                <div style={{ height: '5px', background: `linear-gradient(to right, var(--color-moss), var(--color-sage))` }} />
                <div style={{ padding: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                    <h3 style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '1.2rem',
                      color: 'var(--color-soil)',
                      flex: 1,
                    }}>{trip.title}</h3>
                    <span style={{
                      background: statusColors[trip.status] + '22',
                      color: statusColors[trip.status],
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      padding: '0.25rem 0.75rem',
                      borderRadius: '20px',
                      marginLeft: '0.75rem',
                      border: `1px solid ${statusColors[trip.status]}44`,
                    }}>
                      {statusLabels[trip.status]}
                    </span>
                  </div>

                  <p style={{ color: 'var(--color-clay)', fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                    📍 {trip.destination}
                  </p>

                  {trip.description && (
                    <p style={{ color: 'var(--color-dusk)', fontSize: '0.85rem', lineHeight: 1.6, marginBottom: '1rem' }}>
                      {trip.description.length > 100 ? trip.description.slice(0, 100) + '...' : trip.description}
                    </p>
                  )}

                  <div style={{
                    display: 'flex',
                    gap: '1rem',
                    fontSize: '0.8rem',
                    color: 'var(--color-stone)',
                    marginBottom: '1.25rem',
                    paddingTop: '1rem',
                    borderTop: '1px solid var(--color-mist)',
                  }}>
                    <span>📅 {formatDate(trip.start_date)}</span>
                    <span>→ {formatDate(trip.end_date)}</span>
                    <span>⏱ {getDuration(trip.start_date, trip.end_date)}</span>
                  </div>

                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <Link href={`/trips/${trip.id}`} style={{
                      flex: 1,
                      textAlign: 'center',
                      background: 'var(--color-parchment)',
                      color: 'var(--color-soil)',
                      padding: '0.6rem',
                      borderRadius: '8px',
                      textDecoration: 'none',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                    }}>
                      View Trip
                    </Link>
                    <button onClick={() => deleteTrip(trip.id)} style={{
                      background: 'transparent',
                      border: '1px solid #fca5a5',
                      color: '#ef4444',
                      padding: '0.6rem 0.9rem',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '0.85rem',
                    }}>
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}