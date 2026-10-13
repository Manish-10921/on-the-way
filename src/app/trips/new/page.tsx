'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import Navbar from '@/components/Navbar'

export default function NewTripPage() {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [destination, setDestination] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) { router.push('/login'); return }
    const { error } = await supabase.from('trips').insert({
      title, destination, start_date: startDate, end_date: endDate, description, status: 'planned', user_id: session.user.id,
    })
    if (error) { setError(error.message); setLoading(false) }
    else router.push('/dashboard')
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-cream)' }}>
      <Navbar />
      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '3rem 2rem' }}>
        <Link href="/dashboard" style={{ color: 'var(--color-dusk)', textDecoration: 'none' }}>Back to Dashboard</Link>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', color: 'var(--color-soil)', margin: '1.5rem 0', fontWeight: 800 }}>Plan a New Trip</h1>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', background: 'white', padding: '2rem', borderRadius: '16px', border: '1px solid var(--color-mist)' }}>
          <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Trip Name" required style={inp} />
          <input value={destination} onChange={e => setDestination(e.target.value)} placeholder="Destination" required style={inp} />
          <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} required style={inp} />
          <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} required style={inp} />
          <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Notes..." rows={4} style={inp} />
          {error && <p style={{ color: 'red', fontSize: '0.875rem' }}>{error}</p>}
          <button type="submit" disabled={loading} style={{ background: 'var(--color-soil)', color: 'var(--color-parchment)', border: 'none', borderRadius: '10px', padding: '1rem', fontSize: '1rem', fontWeight: 700, cursor: 'pointer' }}>
            {loading ? 'Saving...' : 'Save Trip'}
          </button>
        </form>
      </div>
    </div>
  )
}

const inp: React.CSSProperties = { width: '100%', padding: '0.85rem 1rem', border: '1.5px solid var(--color-mist)', borderRadius: '10px', fontSize: '0.95rem', background: 'var(--color-cream)', color: 'var(--color-soil)', outline: 'none', fontFamily: 'var(--font-body)' }