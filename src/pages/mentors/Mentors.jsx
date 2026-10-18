import { useCallback, useEffect, useState } from 'react'
import { fetchSlots, createBooking } from '../../services/databaseService'

function Mentors() {
  const [slots, setSlots] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const data = await fetchSlots()
      setSlots(data.filter(s => s.available && s.date >= new Date().toLocaleDateString('en-CA')))
      setError('')
    } catch (e) { setError(e.message) }
    finally { setLoading(false) }
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => { void load() }, 0)
    return () => clearTimeout(timer)
  }, [load])

  async function book(slot) {
    setBusy(slot.id)
    setError('')
    setMessage('')
    try {
      await createBooking(slot.id)
      setMessage('Booking successfully database mein save hui.')
      await load()
    } catch (e) { setError(e.message) }
    finally { setBusy('') }
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <header className="rounded-3xl bg-white p-6 shadow-sm sm:p-8">
        <p className="font-semibold text-blue-700">MENTORHUB</p>
        <h1 className="mt-2 text-3xl font-bold">Available Mentor Slots</h1>
        <p className="mt-3 text-slate-600">Live slots loaded from the database.</p>
      </header>
      {message && <p role="status" className="mt-5 rounded-xl bg-green-50 p-4 text-green-800">{message}</p>}
      {error && <p role="alert" className="mt-5 rounded-xl bg-red-50 p-4 text-red-700">{error}</p>}
      {loading ? <p className="mt-6">Loading available slots...</p> : slots.length === 0
        ? <p className="mt-6 rounded-2xl bg-white p-6 text-slate-600">No available future slots. Please check again later.</p>
        : <div className="mt-6 grid gap-4 md:grid-cols-2">
            {slots.map(s => <article key={s.id} className="rounded-2xl border bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold">{s.mentorName}</h2>
              <p className="mt-3 text-slate-700">{s.date}</p><p className="mt-1 text-slate-600">{s.time}</p>
              <button disabled={!!busy} onClick={() => book(s)} className="mt-5 rounded-xl bg-blue-700 px-5 py-3 font-bold text-white disabled:opacity-60">
                {busy === s.id ? 'Booking...' : 'Book this slot'}
              </button>
            </article>)}
          </div>}
    </main>
  )
}
export default Mentors

