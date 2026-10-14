'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import Navbar from '@/components/Navbar'

interface Invite {
  id: string
  trip_id: string
  owner_id: string
  companion_email: string
  status: string
  created_at: string
  trips: {
    title: string
    destination: string
    start_date: string
    end_date: string
  }
}

export default function InvitesPage() {
  const router = useRouter()
  const [invites, setInvites] = useState<Invite[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { router.push('/login'); return }
      fetchInvites(session.user.email ?? '')
    }
    init()
  }, [router])

  const fetchInvites = async (email: string) => {
    const { data } = await supabase
      .from('trip_companions')
      .select('*, trips(title, destination, start_date, end_date)')
      .eq('companion_email', email)
      .order('created_at', { ascending: false })
    if (data) setInvites(data as Invite[])
    setLoading(false)
  }

  const handleAccept = async (id: string) => {
    await supabase
      .from('trip_companions')
      .update({ status: 'accepted' })
      .eq('id', id)
    setInvites(prev => prev.map(i => i.id === id ? { ...i, status: 'accepted' } : i))
  }

  const handleDecline = async (id: string) => {
    if (!confirm('Decline this invitation?')) return
    await supabase.from('trip_companions').delete().eq('id', id)
    setInvites(prev => prev.filter(i => i.id !== id))
  }

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-cream)' }}>
      <Navbar />
      <div style={{
        background: `linear-gradient(135deg, var(--color-soil) 0%, var(--color-bark) 100%)`,
        padding: '3.5rem 2rem',
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <p style={{ color: 'var(--color-sage)', fontSize: '0.85rem', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
            Your Invitations
          </p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 4vw, 3rem)', color: 'var(--color-parchment)', fontWeight: 700 }}>
            Trip Invites
          </h1>
        </div>
      </div>

      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2.5rem 2rem' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--color-stone)' }}>
            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🌿</div>
            <p>Loading invites...</p>
          </div>
        ) : invites.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '5rem 2rem', background: 'white', borderRadius: '20px', border: '2px dashed var(--color-mist)' }}>
            <div style={{ fontSize: '3.5rem', marginBottom: '1.5rem' }}>✉️</div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: 'var(--color-soil)', marginBottom: '0.75rem' }}>
              No invitations yet
            </h3>
            <p style={{ color: 'var(--color-stone)', marginBottom: '2rem' }}>
              When someone invites you to a trip it will appear here.
            </p>
            <Link href="/dashboard" style={{ background: 'var(--color-moss)', color: 'var(--color-cream)', padding: '0.85rem 2rem', borderRadius: '8px', textDecoration: 'none', fontFamily: 'var(--font-display)', fontWeight: 700 }}>
              Go to Dashboard
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {invites.map(invite => (
              <div key={invite.id} style={{ background: 'white', borderRadius: '16px', border: '1px solid var(--color-mist)', overflow: 'hidden' }}>
                <div style={{ height: '4px', background: invite.status === 'accepted' ? 'var(--color-sage)' : 'var(--color-sand)' }} />
                <div style={{ padding: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
                    <div>
                      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', color: 'var(--color-soil)', marginBottom: '0.25rem' }}>
                        {invite.trips?.title}
                      </h3>
                      <p style={{ color: 'var(--color-clay)', fontWeight: 600, fontSize: '0.9rem' }}>
                        📍 {invite.trips?.destination}
                      </p>
                    </div>
                    <span style={{
                      background: invite.status === 'accepted' ? 'rgba(143,166,122,0.15)' : 'rgba(201,168,124,0.15)',
                      color: invite.status === 'accepted' ? 'var(--color-moss)' : 'var(--color-clay)',
                      fontSize: '0.8rem', fontWeight: 600, padding: '0.35rem 0.9rem', borderRadius: '20px',
                    }}>
                      {invite.status === 'accepted' ? '✅ Accepted' : '⏳ Pending'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.85rem', color: 'var(--color-stone)', marginBottom: '1.25rem' }}>
                    <span>📅 {formatDate(invite.trips?.start_date)}</span>
                    <span>→ {formatDate(invite.trips?.end_date)}</span>
                  </div>
                  {invite.status === 'pending' && (
                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                      <button onClick={() => handleAccept(invite.id)} style={{ background: 'var(--color-moss)', color: 'var(--color-cream)', border: 'none', borderRadius: '8px', padding: '0.7rem 1.5rem', cursor: 'pointer', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.9rem' }}>
                        Accept
                      </button>
                      <button onClick={() => handleDecline(invite.id)} style={{ background: 'transparent', border: '1.5px solid #fca5a5', color: '#ef4444', borderRadius: '8px', padding: '0.7rem 1.5rem', cursor: 'pointer', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.9rem' }}>
                        Decline
                      </button>
                    </div>
                  )}
                  {invite.status === 'accepted' && (
                    <p style={{ color: 'var(--color-moss)', fontWeight: 600, fontSize: '0.9rem' }}>
                      You accepted this invitation!
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
