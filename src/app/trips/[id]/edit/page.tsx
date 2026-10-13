'use client'
import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { supabase, type Trip } from '@/lib/supabase'
import Navbar from '@/components/Navbar'

export default function EditTripPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string
  const [form, setForm] = useState({
    title: '',
    destination: '',
    start_date: '',
    end_date: '',
    description: '',
    status: 'planned' as 'planned' | 'ongoing' | 'completed',
  })
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [error, setError] = useState('')

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
      const trip = data as Trip
      setForm({
        title: trip.title,
        destination: trip.destination,
        start_date: trip.start_date,
        end_date: trip.end_date,
        description: trip.description || '',
        status: trip.status,
      })
      setFetching(false)
    }
    fetchTrip()
  }, [id, router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (new Date(form.end_date) < new Date(form.start_date)) {
      setError('End date cannot be before start date.')
      return
    }
    setLoading(true)
    const { error } = await supabase
      .from('trips')
      .update(form)
      .eq('id', id)
    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push(`/trips/${id}`)
    }
  }

  if (fetching) return (
    <div style={{ minHeight: '100vh', background: 'var(--color-cream)' }}>
      <Navbar />
      <div style={{ textAlign: 'center', padding: '6rem', color: 'var(--color-stone)' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🌿</div>
        <p>Loading trip...</p>
      </div>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-cream)' }}>
      <Navbar />
      <div style={{ maxWidth: '720px', margin: '0 auto', padding: '3rem 2rem' }}>
        <Link href={`/trips/${id}`} style={{ color: 'var(--color-dusk)', textDecoration: 'none', fontSize: '0.9rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem' }}>
          ← Back to Trip
        </Link>

        <div style={{ marginBottom: '2.5rem' }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 4vw, 3rem)', color: 'var(--color-soil)', fontWeight: 800, marginBottom: '0.5rem' }}>
            Edit Trip
          </h1>
          <p style={{ color: 'var(--color-dusk)', lineHeight: 1.7 }}>Update your trip details below.</p>
        </div>

        <div style={{ background: 'white', borderRadius: '20px', padding: '2.5rem', border: '1px solid var(--color-mist)', boxShadow: '0 8px 40px rgba(59,42,26,0.06)' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <label style={labelStyle}>Trip Name</label>
              <input name="title" value={form.title} onChange={handleChange} required style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Destination</label>
              <input name="destination" value={form.destination} onChange={handleChange} required style={inputStyle} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={labelStyle}>Start Date</label>
                <input name="start_date" type="date" value={form.start_date} onChange={handleChange} required style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>End Date</label>
                <input name="end_date" type="date" value={form.end_date} onChange={handleChange} required style={inputStyle} />
              </div>
            </div>
            <div>
              <label style={labelStyle}>Status</label>
              <select name="status" value={form.status} onChange={handleChange} style={{ ...inputStyle, cursor: 'pointer' }}>
                <option value="planned">📍 Planned</option>
                <option value="ongoing">✈️ Ongoing</option>
                <option value="completed">✅ Completed</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Notes and Description</label>
              <textarea name="description" value={form.description} onChange={handleChange} rows={5} style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.7 }} />
            </div>
            {error && (
              <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: '8px', padding: '0.75rem 1rem', color: '#dc2626', fontSize: '0.875rem' }}>
                {error}
              </div>
            )}
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button type="submit" disabled={loading} style={{
                flex: 1,
                background: loading ? 'var(--color-stone)' : 'var(--color-soil)',
                color: 'var(--color-parchment)',
                border: 'none',
                borderRadius: '10px',
                padding: '1rem',
                fontSize: '1rem',
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                cursor: loading ? 'not-allowed' : 'pointer',
              }}>
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
              <Link href={`/trips/${id}`} style={{
                padding: '1rem 1.5rem',
                borderRadius: '10px',
                border: '1.5px solid var(--color-mist)',
                textDecoration: 'none',
                color: 'var(--color-dusk)',
                fontWeight: 600,
                fontSize: '0.95rem',
                display: 'flex',
                alignItems: 'center',
              }}>
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '0.85rem',
  fontWeight: 600,
  color: 'var(--color-bark)',
  marginBottom: '0.5rem',
  fontFamily: 'var(--font-body)',
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '0.85rem 1rem',
  border: '1.5px solid var(--color-mist)',
  borderRadius: '10px',
  fontSize: '0.95rem',
  background: 'var(--color-cream)',
  color: 'var(--color-soil)',
  outline: 'none',
  fontFamily: 'var(--font-body)',
}