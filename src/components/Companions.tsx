'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import emailjs from '@emailjs/browser'

const EMAILJS_SERVICE_ID = 'service_ki4ngyn'
const EMAILJS_TEMPLATE_ID = 'template_tz51x3g'
const EMAILJS_PUBLIC_KEY = 'EyUzIbMzCkbEvYfgT'

interface Companion {
  id: string
  companion_email: string
  status: string
  created_at: string
}

interface CompanionsProps {
  tripId: string
  tripTitle?: string
  destination?: string
}

export default function Companions({ tripId, tripTitle, destination }: CompanionsProps) {
  const [companions, setCompanions] = useState<Companion[]>([])
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(true)
  const [adding, setAdding] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    fetchCompanions()
  }, [tripId])

  const fetchCompanions = async () => {
    const { data } = await supabase
      .from('trip_companions')
      .select('*')
      .eq('trip_id', tripId)
      .order('created_at', { ascending: false })
    if (data) setCompanions(data as Companion[])
    setLoading(false)
  }

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setAdding(true)

    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return

    if (email === session.user.email) {
      setError('You cannot invite yourself!')
      setAdding(false)
      return
    }

    const existing = companions.find(c => c.companion_email === email)
    if (existing) {
      setError('This person is already invited!')
      setAdding(false)
      return
    }

    const { error: dbError } = await supabase.from('trip_companions').insert({
      trip_id: tripId,
      owner_id: session.user.id,
      companion_email: email,
      status: 'pending',
    })

    if (dbError) {
      setError(dbError.message)
      setAdding(false)
      return
    }

    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          email: email,
          owner_email: session.user.email,
          destination: destination || 'an amazing destination',
          trip_link: `${window.location.origin}/signup`,
        },
        EMAILJS_PUBLIC_KEY
      )
      setSuccess(`Invitation email sent to ${email}!`)
    } catch {
      setSuccess(`${email} added as companion! (Email notification may be delayed)`)
    }

    setEmail('')
    fetchCompanions()
    setAdding(false)
  }

  const handleRemove = async (id: string) => {
    await supabase.from('trip_companions').delete().eq('id', id)
    setCompanions(prev => prev.filter(c => c.id !== id))
  }

  if (loading) return <p style={{ color: 'var(--color-stone)' }}>Loading companions...</p>

  return (
    <div>
      <form onSubmit={handleInvite} style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Friend's email address"
          required
          style={{
            flex: 1,
            minWidth: '200px',
            padding: '0.85rem 1rem',
            border: '1.5px solid var(--color-mist)',
            borderRadius: '10px',
            fontSize: '0.95rem',
            background: 'var(--color-cream)',
            color: 'var(--color-soil)',
            outline: 'none',
            fontFamily: 'var(--font-body)',
          }}
        />
        <button type="submit" disabled={adding} style={{
          background: 'var(--color-moss)',
          color: 'var(--color-cream)',
          border: 'none',
          borderRadius: '10px',
          padding: '0.85rem 1.5rem',
          cursor: adding ? 'not-allowed' : 'pointer',
          fontFamily: 'var(--font-display)',
          fontWeight: 700,
          fontSize: '0.95rem',
          whiteSpace: 'nowrap',
        }}>
          {adding ? 'Inviting...' : '+ Invite'}
        </button>
      </form>

      {error && (
        <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: '8px', padding: '0.75rem 1rem', color: '#dc2626', fontSize: '0.875rem', marginBottom: '1rem' }}>
          {error}
        </div>
      )}

      {success && (
        <div style={{ background: '#f0fdf4', border: '1px solid #86efac', borderRadius: '8px', padding: '0.75rem 1rem', color: '#16a34a', fontSize: '0.875rem', marginBottom: '1rem' }}>
          {success}
        </div>
      )}

      {companions.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-stone)', background: 'var(--color-cream)', borderRadius: '12px', border: '2px dashed var(--color-mist)' }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>👥</div>
          <p>No companions yet. Invite friends to join your trip!</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {companions.map(companion => (
            <div key={companion.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--color-cream)', borderRadius: '10px', padding: '1rem 1.25rem', border: '1px solid var(--color-mist)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--color-moss)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: '1rem' }}>
                  {companion.companion_email[0].toUpperCase()}
                </div>
                <div>
                  <div style={{ fontWeight: 600, color: 'var(--color-soil)', fontSize: '0.95rem' }}>{companion.companion_email}</div>
                  <div style={{ color: 'var(--color-stone)', fontSize: '0.8rem' }}>
                    {companion.status === 'pending' ? '⏳ Invitation pending' : '✅ Accepted'}
                  </div>
                </div>
              </div>
              <button onClick={() => handleRemove(companion.id)} style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '1rem' }}>
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}