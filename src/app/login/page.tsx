'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push('/dashboard')
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: `linear-gradient(160deg, var(--color-soil) 0%, var(--color-bark) 60%, var(--color-moss) 100%)`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
    }}>
      <div className="animate-fade-up" style={{
        background: 'var(--color-cream)',
        borderRadius: '20px',
        padding: '3rem',
        width: '100%',
        maxWidth: '440px',
        boxShadow: '0 40px 80px rgba(0,0,0,0.4)',
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 700, color: 'var(--color-soil)' }}>
              On The Way
            </span>
          </Link>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.8rem',
            color: 'var(--color-soil)',
            fontWeight: 700,
            marginTop: '1rem',
          }}>Welcome back</h1>
          <p style={{ color: 'var(--color-dusk)', fontSize: '0.9rem', marginTop: '0.5rem' }}>
            Sign in to continue your journey
          </p>
        </div>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={labelStyle}>Email address</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              style={inputStyle}
            />
          </div>

          {error && (
            <div style={{
              background: '#fef2f2',
              border: '1px solid #fca5a5',
              borderRadius: '8px',
              padding: '0.75rem 1rem',
              color: '#dc2626',
              fontSize: '0.875rem',
            }}>
              {error}
            </div>
          )}

          <button type="submit" disabled={loading} style={{
            background: loading ? 'var(--color-stone)' : 'var(--color-soil)',
            color: 'var(--color-parchment)',
            border: 'none',
            borderRadius: '10px',
            padding: '1rem',
            fontSize: '1rem',
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            cursor: loading ? 'not-allowed' : 'pointer',
            marginTop: '0.5rem',
          }}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1.75rem', color: 'var(--color-dusk)', fontSize: '0.9rem' }}>
          Don't have an account?{' '}
          <Link href="/signup" style={{ color: 'var(--color-moss)', fontWeight: 600, textDecoration: 'none' }}>
            Sign up free
          </Link>
        </p>
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
  background: 'white',
  color: 'var(--color-soil)',
  outline: 'none',
}