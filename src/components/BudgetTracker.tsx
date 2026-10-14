'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

const categories = ['✈️ Flights', '🏨 Hotels', '🍽️ Food', '🎯 Activities', '🚗 Transport', '🛍️ Shopping', '💊 Health', '📦 Other']

interface Expense {
  id: string
  category: string
  description: string
  amount: number
  currency: string
  date: string
}

interface BudgetTrackerProps {
  tripId: string
}

export default function BudgetTracker({ tripId }: BudgetTrackerProps) {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    category: '🍽️ Food',
    description: '',
    amount: '',
    currency: 'USD',
    date: new Date().toISOString().split('T')[0],
  })

  useEffect(() => {
    fetchExpenses()
  }, [tripId])

  const fetchExpenses = async () => {
    const { data } = await supabase
      .from('expenses')
      .select('*')
      .eq('trip_id', tripId)
      .order('date', { ascending: false })
    if (data) setExpenses(data as Expense[])
    setLoading(false)
  }

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return

    await supabase.from('expenses').insert({
      trip_id: tripId,
      user_id: session.user.id,
      category: form.category,
      description: form.description,
      amount: parseFloat(form.amount),
      currency: form.currency,
      date: form.date,
    })
    setForm({ category: '🍽️ Food', description: '', amount: '', currency: 'USD', date: new Date().toISOString().split('T')[0] })
    setShowForm(false)
    fetchExpenses()
  }

  const handleDelete = async (id: string) => {
    await supabase.from('expenses').delete().eq('id', id)
    setExpenses(prev => prev.filter(e => e.id !== id))
  }

  const total = expenses.reduce((sum, e) => sum + Number(e.amount), 0)

  const byCategory = categories.map(cat => ({
    name: cat,
    total: expenses.filter(e => e.category === cat).reduce((sum, e) => sum + Number(e.amount), 0)
  })).filter(c => c.total > 0)

  if (loading) return <p style={{ color: 'var(--color-stone)' }}>Loading expenses...</p>

  return (
    <div>
      {/* Total */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        <div style={{ background: 'var(--color-soil)', borderRadius: '12px', padding: '1.25rem', textAlign: 'center' }}>
          <div style={{ color: 'var(--color-sage)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>Total Spent</div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 700, color: 'var(--color-parchment)' }}>
            ${total.toFixed(2)}
          </div>
        </div>
        <div style={{ background: 'white', borderRadius: '12px', padding: '1.25rem', textAlign: 'center', border: '1px solid var(--color-mist)' }}>
          <div style={{ color: 'var(--color-stone)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>Expenses</div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 700, color: 'var(--color-soil)' }}>
            {expenses.length}
          </div>
        </div>
        {byCategory.slice(0, 2).map(cat => (
          <div key={cat.name} style={{ background: 'white', borderRadius: '12px', padding: '1.25rem', textAlign: 'center', border: '1px solid var(--color-mist)' }}>
            <div style={{ color: 'var(--color-stone)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>{cat.name}</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 700, color: 'var(--color-soil)' }}>
              ${cat.total.toFixed(0)}
            </div>
          </div>
        ))}
      </div>

      {/* Add expense button */}
      <button onClick={() => setShowForm(!showForm)} style={{
        background: 'var(--color-moss)',
        color: 'var(--color-cream)',
        border: 'none',
        borderRadius: '8px',
        padding: '0.7rem 1.25rem',
        cursor: 'pointer',
        fontFamily: 'var(--font-body)',
        fontWeight: 600,
        fontSize: '0.875rem',
        marginBottom: '1.5rem',
      }}>
        {showForm ? 'Cancel' : '+ Add Expense'}
      </button>

      {/* Add expense form */}
      {showForm && (
        <form onSubmit={handleAdd} style={{ background: 'var(--color-cream)', borderRadius: '12px', padding: '1.5rem', marginBottom: '1.5rem', border: '1px solid var(--color-mist)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={labelStyle}>Category</label>
              <select value={form.category} onChange={e => setForm(prev => ({ ...prev, category: e.target.value }))} style={inputStyle}>
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Date</label>
              <input type="date" value={form.date} onChange={e => setForm(prev => ({ ...prev, date: e.target.value }))} style={inputStyle} />
            </div>
          </div>
          <div>
            <label style={labelStyle}>Description</label>
            <input value={form.description} onChange={e => setForm(prev => ({ ...prev, description: e.target.value }))} placeholder="e.g. Hotel breakfast" required style={inputStyle} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
            <div>
              <label style={labelStyle}>Amount</label>
              <input type="number" step="0.01" value={form.amount} onChange={e => setForm(prev => ({ ...prev, amount: e.target.value }))} placeholder="0.00" required style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Currency</label>
              <select value={form.currency} onChange={e => setForm(prev => ({ ...prev, currency: e.target.value }))} style={inputStyle}>
                <option value="USD">USD $</option>
                <option value="EUR">EUR €</option>
                <option value="GBP">GBP £</option>
                <option value="INR">INR ₹</option>
                <option value="JPY">JPY ¥</option>
              </select>
            </div>
          </div>
          <button type="submit" style={{ background: 'var(--color-soil)', color: 'var(--color-parchment)', border: 'none', borderRadius: '8px', padding: '0.85rem', fontFamily: 'var(--font-display)', fontWeight: 700, cursor: 'pointer' }}>
            Save Expense
          </button>
        </form>
      )}

      {/* Expense list */}
      {expenses.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-stone)', background: 'var(--color-cream)', borderRadius: '12px', border: '2px dashed var(--color-mist)' }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>💰</div>
          <p>No expenses yet. Start tracking your spending!</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {expenses.map(expense => (
            <div key={expense.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--color-cream)', borderRadius: '10px', padding: '1rem 1.25rem', border: '1px solid var(--color-mist)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span style={{ fontSize: '1.5rem' }}>{expense.category.split(' ')[0]}</span>
                <div>
                  <div style={{ fontWeight: 600, color: 'var(--color-soil)', fontSize: '0.95rem' }}>{expense.description}</div>
                  <div style={{ color: 'var(--color-stone)', fontSize: '0.8rem' }}>{expense.category} · {expense.date}</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--color-soil)', fontSize: '1.1rem' }}>
                  {expense.currency} {Number(expense.amount).toFixed(2)}
                </span>
                <button onClick={() => handleDelete(expense.id)} style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '1rem' }}>
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '0.8rem',
  fontWeight: 600,
  color: 'var(--color-bark)',
  marginBottom: '0.4rem',
  fontFamily: 'var(--font-body)',
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '0.75rem 1rem',
  border: '1.5px solid var(--color-mist)',
  borderRadius: '8px',
  fontSize: '0.9rem',
  background: 'white',
  color: 'var(--color-soil)',
  outline: 'none',
  fontFamily: 'var(--font-body)',
}