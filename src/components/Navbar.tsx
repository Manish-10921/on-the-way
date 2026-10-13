'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { useEffect, useState } from 'react'

export default function Navbar() {
  const router = useRouter()
  const [userEmail, setUserEmail] = useState<string | null>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUserEmail(data.session?.user?.email ?? null)
    })
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserEmail(session?.user?.email ?? null)
    })
    return () => listener.subscription.unsubscribe()
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <nav style={{
      background: 'var(--color-soil)',
      borderBottom: '1px solid var(--color-bark)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '64px',
      }}>
        <Link href="/" style={{ textDecoration: 'none' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <path d="M14 2C8 2 3 7 3 13c0 8 11 15 11 15s11-7 11-15c0-6-5-11-11-11z" fill="var(--color-sage)" opacity="0.9"/>
              <path d="M14 9a4 4 0 100 8 4 4 0 000-8z" fill="var(--color-cream)"/>
            </svg>
            <span style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.3rem',
              fontWeight: 700,
              color: 'var(--color-parchment)',
              letterSpacing: '-0.02em',
            }}>
              On The Way
            </span>
          </div>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          {userEmail ? (
            <>
              <Link href="/dashboard" style={linkStyle}>Dashboard</Link>
            <Link href="/trips/new" style={linkStyle}>+ New Trip</Link>
<Link href="/plan" style={linkStyle}>AI Planner</Link>
              <span style={{ color: 'var(--color-sand)', fontSize: '0.85rem' }}>
                {userEmail.split('@')[0]}
              </span>
              <button onClick={handleSignOut} style={btnOutlineStyle}>
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link href="/login" style={linkStyle}>Sign In</Link>
              <Link href="/signup" style={btnStyle}>Get Started</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

const linkStyle: React.CSSProperties = {
  color: 'var(--color-mist)',
  textDecoration: 'none',
  fontSize: '0.95rem',
  fontFamily: 'var(--font-body)',
  transition: 'color 0.2s',
}

const btnStyle: React.CSSProperties = {
  background: 'var(--color-moss)',
  color: 'var(--color-cream)',
  padding: '0.45rem 1.2rem',
  borderRadius: '6px',
  textDecoration: 'none',
  fontSize: '0.9rem',
  fontFamily: 'var(--font-body)',
  fontWeight: 600,
  transition: 'background 0.2s',
}

const btnOutlineStyle: React.CSSProperties = {
  background: 'transparent',
  border: '1px solid var(--color-dusk)',
  color: 'var(--color-mist)',
  padding: '0.4rem 1rem',
  borderRadius: '6px',
  cursor: 'pointer',
  fontSize: '0.9rem',
  fontFamily: 'var(--font-body)',
  transition: 'all 0.2s',
}