'use client'
import { useState } from 'react'
import Navbar from '@/components/Navbar'

const steps = [
  { key: 'destination', question: 'Where do you want to go?', placeholder: 'e.g. Paris, France' },
  { key: 'duration', question: 'How many days is your trip?', placeholder: 'e.g. 7' },
  { key: 'budget', question: 'What is your budget per person?', placeholder: 'e.g. $2000' },
  { key: 'travelers', question: 'How many people are traveling?', placeholder: 'e.g. 2' },
  { key: 'interests', question: 'What are your interests?', placeholder: 'e.g. history, food, adventure, nature' },
  { key: 'style', question: 'What is your travel style?', placeholder: 'e.g. luxury, backpacker, family, romantic' },
  { key: 'from', question: 'Where are you flying from?', placeholder: 'e.g. New York, USA' },
]

export default function PlanPage() {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [current, setCurrent] = useState('')
  const [plan, setPlan] = useState('')
  const [loading, setLoading] = useState(false)

  const handleNext = () => {
    setAnswers(prev => ({ ...prev, [steps[step].key]: current }))
    setCurrent('')
    setStep(prev => prev + 1)
  }

  const handleGenerate = async () => {
    const finalAnswers = { ...answers, [steps[step].key]: current }
    setAnswers(finalAnswers)
    setLoading(true)
    setPlan('')

    const prompt = `You are an expert travel planner. Create a complete detailed trip plan:

Destination: ${finalAnswers.destination}
Duration: ${finalAnswers.duration} days
Budget per person: ${finalAnswers.budget}
Number of travelers: ${finalAnswers.travelers}
Interests: ${finalAnswers.interests}
Travel style: ${finalAnswers.style}
Flying from: ${finalAnswers.from}

Include:
1. FLIGHTS - Options, costs, best airlines
2. HOTELS - 3 recommendations with prices
3. DAY BY DAY ITINERARY - Morning, afternoon, evening for each day
4. TOP TOURIST ATTRACTIONS - Must see places with tips
5. RESTAURANTS - Best local food and restaurants
6. PACKING LIST - Essential items
7. BUDGET BREAKDOWN - All costs and total
8. LOCAL TIPS - Currency, transport, safety, culture`

    try {
      const response = await fetch('/api/plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      })
      const data = await response.json()
      setPlan(data.result)
    } catch {
 } catch {
    setPlan('Something went wrong. Please try again.')
    }
    setLoading(false)
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-cream)' }}>
      <Navbar />
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '3rem 2rem' }}>
        <p style={{ color: 'var(--color-clay)', fontSize: '0.85rem', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>AI Trip Planner</p>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 4vw, 3rem)', color: 'var(--color-soil)', fontWeight: 800, marginBottom: '0.5rem' }}>Plan My Perfect Trip</h1>
        <p style={{ color: 'var(--color-dusk)', marginBottom: '3rem', lineHeight: 1.7 }}>Answer a few questions and our AI will build your complete travel plan.</p>

        {!plan && !loading && (
          <div style={{ background: 'white', borderRadius: '20px', padding: '2.5rem', border: '1px solid var(--color-mist)', boxShadow: '0 8px 40px rgba(59,42,26,0.06)' }}>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem' }}>
              {steps.map((_, i) => (
                <div key={i} style={{ flex: 1, height: '4px', borderRadius: '2px', background: i <= step ? 'var(--color-moss)' : 'var(--color-mist)', transition: 'background 0.3s' }} />
              ))}
            </div>
            <p style={{ color: 'var(--color-stone)', fontSize: '0.85rem', marginBottom: '0.5rem' }}>Question {step + 1} of {steps.length}</p>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: 'var(--color-soil)', marginBottom: '1.5rem', fontWeight: 700 }}>{steps[step].question}</h2>
            <input
              value={current}
              onChange={e => setCurrent(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && current.trim()) { step < steps.length - 1 ? handleNext() : handleGenerate() } }}
              placeholder={steps[step].placeholder}
              autoFocus
              style={{ width: '100%', padding: '1rem', border: '1.5px solid var(--color-mist)', borderRadius: '10px', fontSize: '1rem', background: 'var(--color-cream)', color: 'var(--color-soil)', outline: 'none', fontFamily: 'var(--font-body)', marginBottom: '1.5rem' }}
            />
            <button
              onClick={step < steps.length - 1 ? handleNext : handleGenerate}
              disabled={!current.trim()}
              style={{ background: current.trim() ? 'var(--color-soil)' : 'var(--color-mist)', color: 'var(--color-parchment)', border: 'none', borderRadius: '10px', padding: '1rem 2rem', fontSize: '1rem', fontFamily: 'var(--font-display)', fontWeight: 700, cursor: current.trim() ? 'pointer' : 'not-allowed' }}
            >
              {step < steps.length - 1 ? 'Next' : 'Generate My Trip Plan'}
            </button>
          </div>
        )}

        {loading && (
          <div style={{ textAlign: 'center', padding: '4rem', background: 'white', borderRadius: '20px', border: '1px solid var(--color-mist)' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🌍</div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: 'var(--color-soil)', marginBottom: '0.5rem' }}>Building your perfect trip...</h3>
            <p style={{ color: 'var(--color-stone)' }}>Planning flights, hotels, itinerary and more. This takes about 15 seconds.</p>
          </div>
        )}

        {plan && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', color: 'var(--color-soil)', fontWeight: 700 }}>Your Trip Plan to {answers.destination}</h2>
              <button onClick={() => { setPlan(''); setStep(0); setAnswers({}); setCurrent('') }} style={{ background: 'transparent', border: '1.5px solid var(--color-mist)', color: 'var(--color-dusk)', padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: '0.9rem' }}>
                Plan Another Trip
              </button>
            </div>
            <div style={{ background: 'white', borderRadius: '20px', padding: '2.5rem', border: '1px solid var(--color-mist)', boxShadow: '0 8px 40px rgba(59,42,26,0.06)', whiteSpace: 'pre-wrap', lineHeight: 1.8, color: 'var(--color-soil)', fontFamily: 'var(--font-body)', fontSize: '0.95rem' }}>
              {plan}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}