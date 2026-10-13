import Navbar from '@/components/Navbar'
import Link from 'next/link'

const destinations = [
  { name: 'Bali', country: 'Indonesia', emoji: '🌴', color: '#4a5e3a' },
  { name: 'Tuscany', country: 'Italy', emoji: '🍇', color: '#a0522d' },
  { name: 'Kyoto', country: 'Japan', emoji: '🌸', color: '#8fa67a' },
  { name: 'Patagonia', country: 'Argentina', emoji: '🏔️', color: '#5c3d2e' },
  { name: 'Santorini', country: 'Greece', emoji: '🌊', color: '#6b7c52' },
  { name: 'Marrakech', country: 'Morocco', emoji: '🏺', color: '#c9a87c' },
]

export default function Home() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-cream)' }}>
      <Navbar />

      <section style={{
        position: 'relative',
        minHeight: '90vh',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
        background: `linear-gradient(160deg, var(--color-soil) 0%, var(--color-bark) 50%, var(--color-moss) 100%)`,
      }}>
        <div style={{
          position: 'absolute', top: '-10%', right: '-5%',
          width: '600px', height: '600px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(143,166,122,0.15) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: '-20%', left: '-10%',
          width: '500px', height: '500px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(201,168,124,0.1) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '4rem 2rem', position: 'relative', zIndex: 1 }}>
          <div style={{ maxWidth: '680px' }}>
            <p className="animate-fade-up delay-100" style={{
              color: 'var(--color-sage)',
              fontSize: '0.9rem',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              fontFamily: 'var(--font-body)',
              marginBottom: '1.5rem',
            }}>
              ✦ Your Journey Begins Here
            </p>

            <h1 className="animate-fade-up delay-200" style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(3rem, 6vw, 5.5rem)',
              fontWeight: 800,
              color: 'var(--color-parchment)',
              lineHeight: 1.1,
              marginBottom: '1.5rem',
              letterSpacing: '-0.03em',
            }}>
              Wander with<br />
              <span style={{ color: 'var(--color-sand)', fontStyle: 'italic' }}>intention.</span>
            </h1>

            <p className="animate-fade-up delay-300" style={{
              color: 'var(--color-mist)',
              fontSize: '1.15rem',
              marginBottom: '3rem',
              fontFamily: 'var(--font-body)',
              lineHeight: 1.8,
              maxWidth: '520px',
            }}>
              Plan meaningful trips, discover hidden paths, and keep every adventure
              beautifully organized from the first spark of wanderlust to the final sunset.
            </p>

            <div className="animate-fade-up delay-400" style={{
              display: 'flex',
              gap: '0',
              maxWidth: '520px',
              background: 'var(--color-parchment)',
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
              marginBottom: '3rem',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', padding: '0 1rem' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-dusk)" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                </svg>
              </div>
              <input
                type="text"
                placeholder="Where are you headed?"
                style={{
                  flex: 1,
                  border: 'none',
                  outline: 'none',
                  padding: '1.1rem 0.5rem',
                  background: 'transparent',
                  color: 'var(--color-soil)',
                  fontSize: '1rem',
                  fontFamily: 'var(--font-body)',
                }}
              />
              <Link href="/signup" style={{
                background: 'var(--color-moss)',
                color: 'var(--color-cream)',
                padding: '0 1.8rem',
                display: 'flex',
                alignItems: 'center',
                textDecoration: 'none',
                fontFamily: 'var(--font-body)',
                fontWeight: 600,
                fontSize: '0.95rem',
                whiteSpace: 'nowrap',
              }}>
                Plan Trip
              </Link>
            </div>

            <div className="animate-fade-up delay-500" style={{ display: 'flex', gap: '2.5rem' }}>
              {[
                { num: '1,200+', label: 'Destinations' },
                { num: '8,400+', label: 'Trips Planned' },
                { num: '4.9★', label: 'User Rating' },
              ].map((stat) => (
                <div key={stat.label}>
                  <div style={{ color: 'var(--color-sand)', fontSize: '1.4rem', fontFamily: 'var(--font-display)', fontWeight: 700 }}>
                    {stat.num}
                  </div>
                  <div style={{ color: 'var(--color-stone)', fontSize: '0.8rem', letterSpacing: '0.05em' }}>
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: '6rem 2rem', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <p style={{
            color: 'var(--color-clay)',
            fontSize: '0.85rem',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            marginBottom: '0.75rem',
          }}>Explore The World</p>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            color: 'var(--color-soil)',
            fontWeight: 700,
          }}>
            Popular Destinations
          </h2>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '1.5rem',
        }}>
          {destinations.map((dest) => (
            <Link key={dest.name} href="/signup" style={{ textDecoration: 'none' }}>
              <div style={{
                background: 'white',
                borderRadius: '16px',
                padding: '2rem',
                border: '1px solid var(--color-mist)',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden',
              }}>
                <div style={{
                  position: 'absolute', top: 0, left: 0, right: 0, height: '4px',
                  background: dest.color,
                }} />
                <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{dest.emoji}</div>
                <h3 style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.5rem',
                  color: 'var(--color-soil)',
                  marginBottom: '0.25rem',
                }}>{dest.name}</h3>
                <p style={{ color: 'var(--color-stone)', fontSize: '0.9rem' }}>{dest.country}</p>
                <p style={{
                  marginTop: '1rem',
                  color: dest.color,
                  fontSize: '0.85rem',
                  fontWeight: 600,
                }}>Plan this trip</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section style={{
        background: 'var(--color-soil)',
        padding: '6rem 2rem',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              color: 'var(--color-parchment)',
              fontWeight: 700,
              marginBottom: '1rem',
            }}>
              Everything you need to roam freely
            </h2>
            <p style={{ color: 'var(--color-stone)', maxWidth: '500px', margin: '0 auto', lineHeight: 1.8 }}>
              From dreaming to arriving, we have got every step of your journey covered.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.5rem' }}>
            {[
              { icon: '🗺️', title: 'Smart Itineraries', desc: 'Build day-by-day plans with ease. Add activities, restaurants, and hidden gems.' },
              { icon: '🔒', title: 'Secure & Private', desc: 'Your travel data stays yours. Powered by Supabase with row-level security on every trip.' },
              { icon: '📍', title: 'Destination Search', desc: 'Discover thousands of destinations with curated tips and local insights.' },
              { icon: '📅', title: 'Trip Timeline', desc: 'Visualize your entire journey in a beautiful timeline view.' },
            ].map((feat) => (
              <div key={feat.title} style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '16px',
                padding: '2rem',
              }}>
                <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>{feat.icon}</div>
                <h3 style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.2rem',
                  color: 'var(--color-parchment)',
                  marginBottom: '0.75rem',
                }}>{feat.title}</h3>
                <p style={{ color: 'var(--color-stone)', fontSize: '0.9rem', lineHeight: 1.7 }}>{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: '6rem 2rem', textAlign: 'center' }}>
        <h2 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(2rem, 4vw, 3.5rem)',
          color: 'var(--color-soil)',
          fontWeight: 800,
          marginBottom: '1.5rem',
          letterSpacing: '-0.02em',
        }}>
          Your next adventure<br />
          <span style={{ color: 'var(--color-clay)', fontStyle: 'italic' }}>awaits.</span>
        </h2>
        <p style={{
          color: 'var(--color-dusk)',
          fontSize: '1.1rem',
          maxWidth: '400px',
          margin: '0 auto 2.5rem',
          lineHeight: 1.8,
        }}>
          Join thousands of travellers planning smarter, deeper, more meaningful journeys.
        </p>
        <Link href="/signup" style={{
          display: 'inline-block',
          background: 'var(--color-soil)',
          color: 'var(--color-parchment)',
          padding: '1rem 2.5rem',
          borderRadius: '8px',
          textDecoration: 'none',
          fontFamily: 'var(--font-display)',
          fontWeight: 700,
          fontSize: '1.1rem',
          boxShadow: '0 8px 30px rgba(59,42,26,0.2)',
        }}>
          Start Planning for Free
        </Link>
      </section>

      <footer style={{
        background: 'var(--color-soil)',
        color: 'var(--color-stone)',
        padding: '2rem',
        textAlign: 'center',
        fontSize: '0.85rem',
      }}>
        <p>2024 On The Way. Made with love for explorers.</p>
      </footer>
    </div>
  )
}