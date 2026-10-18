import { useCallback, useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { createSlot, fetchSlots, fetchBookings } from '../../services/databaseService'

function Availability() {
  const { user } = useAuth()
  const [slots, setSlots] = useState([])
  const [date, setDate] = useState('')
  const [time, setTime] = useState('10:00 AM - 10:30 AM')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const [allSlots, bookings] = await Promise.all([fetchSlots(), fetchBookings()])
      const booked = new Set(bookings.filter(b => b.status !== 'Cancelled').map(b => String(b.slotId)))
      setSlots(allSlots.filter(s => String(s.mentorId) === String(user?.id || user?._id))
        .map(s => ({ ...s, available: !booked.has(String(s.id)) })))
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [user?.id, user?._id])

  useEffect(() => {
    const timer = setTimeout(() => { void load() }, 0)
    return () => clearTimeout(timer)
  }, [load])

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setMessage('')
    setSaving(true)
    try {
      await createSlot({ date, time })
      setDate('')
      setMessage('Slot MongoDB mein save ho gaya.')
      await load()
    } catch (e) {
      setError(e.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <header className="rounded-3xl bg-white p-6 shadow-sm sm:p-8">
        <p className="font-semibold text-blue-700">MENTOR WORKSPACE</p>
        <h1 className="mt-2 text-3xl font-bold">Manage Availability</h1>
        <p className="mt-3 text-slate-600">Slots are saved to the shared database.</p>
      </header>

      {message && <p role="status" className="mt-4 rounded-xl bg-green-50 p-4 text-green-800">{message}</p>}
      {error && <p role="alert" className="mt-4 rounded-xl bg-red-50 p-4 text-red-700">{error}</p>}

      <form onSubmit={handleSubmit} className="mt-7 grid gap-4 rounded-2xl bg-white p-6 shadow-sm sm:grid-cols-3">
        <label className="text-sm font-semibold">Date
          <input required type="date" min={new Date().toLocaleDateString('en-CA')} value={date} onChange={e => setDate(e.target.value)} className="mt-2 min-h-11 w-full rounded-xl border p-3" />
        </label>
        <label className="text-sm font-semibold">Time
          <select value={time} onChange={e => setTime(e.target.value)} className="mt-2 min-h-11 w-full rounded-xl border p-3">
            <option>09:00 AM - 09:30 AM</option>
            <option>10:00 AM - 10:30 AM</option>
            <option>11:00 AM - 11:30 AM</option>
            <option>02:00 PM - 02:30 PM</option>
            <option>03:00 PM - 03:30 PM</option>
            <option>04:00 PM - 04:30 PM</option>
          </select>
        </label>
        <button disabled={saving} className="self-end rounded-xl bg-blue-700 px-5 py-3 font-bold text-white disabled:opacity-60">
          {saving ? 'Saving...' : 'Add slot'}
        </button>
      </form>

      <section className="mt-9">
        <h2 className="text-2xl font-bold">Your database slots</h2>
        {loading ? <p className="mt-4">Loading slots...</p> : slots.length === 0
          ? <p className="mt-4 rounded-xl bg-white p-5 text-slate-600">No slots found for this account. Create one above.</p>
          : <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {slots.map(s => <article key={s.id} className="rounded-2xl bg-white p-5 shadow-sm">
                <h3 className="font-bold">{user?.name || 'Mentor'}</h3>
                <p className="mt-2">{s.date}</p><p className="mt-1 text-slate-600">{s.time}</p>
                <span className={`mt-3 inline-block rounded-full px-3 py-1 text-sm font-semibold ${s.available ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>{s.available ? 'Available' : 'Booked'}</span>
              </article>)}
            </div>}
      </section>
    </main>
  )
}
export default Availability

