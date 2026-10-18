import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { cancelMyBooking, fetchBookings } from '../../services/databaseService'

function Bookings() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    try { setBookings(await fetchBookings()); setError('') }
    catch (e) { setError(e.message) }
    finally { setLoading(false) }
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => { void load() }, 0)
    return () => clearTimeout(timer)
  }, [load])

  async function cancel(id) {
    setBusy(id)
    setError('')
    try {
      await cancelMyBooking(id)
      setMessage('Booking cancelled.')
      await load()
    } catch (e) { setError(e.message) }
    finally { setBusy('') }
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <header className="rounded-3xl bg-white p-6 shadow-sm sm:p-8">
        <h1 className="text-3xl font-bold">My Bookings</h1>
        <p className="mt-3 text-slate-600">Your account bookings from MongoDB.</p>
      </header>
      {message && <p role="status" className="mt-4 rounded-xl bg-green-50 p-4 text-green-800">{message}</p>}
      {error && <p role="alert" className="mt-4 rounded-xl bg-red-50 p-4 text-red-700">{error}</p>}
      {loading ? <p className="mt-5">Loading bookings...</p> : bookings.length === 0
        ? <div className="mt-6 rounded-2xl bg-white p-8 text-center"><p>No bookings found.</p><Link to="/mentors" className="mt-4 inline-block font-bold text-blue-700">Explore available slots →</Link></div>
        : <div className="mt-6 space-y-4">{bookings.map(b => <article key={b.id} className="rounded-2xl border bg-white p-5 shadow-sm">
            <h2 className="text-lg font-bold">{b.mentorName}</h2>
            <p className="mt-2">{b.date} · {b.time}</p>
            <p className="mt-2 font-semibold">Status: {b.status}</p>
            {b.status === 'Booked' && <button disabled={!!busy} onClick={() => cancel(b.id)} className="mt-4 rounded-xl border border-red-200 px-4 py-2 font-semibold text-red-700 disabled:opacity-60">{busy === b.id ? 'Cancelling...' : 'Cancel booking'}</button>}
          </article>)}</div>}
    </main>
  )
}
export default Bookings

