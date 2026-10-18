import { useCallback, useEffect, useState } from 'react'
import { fetchBookings, updateBookingStatus } from '../../services/databaseService'

function MentorSessions() {
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

  async function changeStatus(id, status) {
    setBusy(id)
    setError('')
    try {
      await updateBookingStatus(id, status)
      setMessage(`Session marked ${status.toLowerCase()}.`)
      await load()
    } catch (e) { setError(e.message) }
    finally { setBusy('') }
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <header className="rounded-3xl bg-white p-6 shadow-sm sm:p-8">
        <p className="font-semibold text-blue-700">MENTOR WORKSPACE</p>
        <h1 className="mt-2 text-3xl font-bold">My Sessions</h1>
        <p className="mt-3 text-slate-600">Student bookings from the shared database.</p>
        <div className="mt-5 grid grid-cols-2 gap-3 sm:max-w-lg">
          <div className="rounded-xl bg-blue-50 p-4"><p className="text-sm">Active sessions</p><p className="mt-1 text-2xl font-bold">{bookings.filter(b => b.status === 'Booked').length}</p></div>
          <div className="rounded-xl bg-slate-100 p-4"><p className="text-sm">All bookings</p><p className="mt-1 text-2xl font-bold">{bookings.length}</p></div>
        </div>
      </header>
      {message && <p role="status" className="mt-4 rounded-xl bg-green-50 p-4 text-green-800">{message}</p>}
      {error && <p role="alert" className="mt-4 rounded-xl bg-red-50 p-4 text-red-700">{error}</p>}
      {loading ? <p className="mt-5">Loading sessions...</p> : bookings.length === 0
        ? <p className="mt-5 rounded-xl bg-white p-6">No bookings yet.</p>
        : <div className="mt-5 space-y-4">{bookings.map(b => <article key={b.id} className="rounded-2xl border bg-white p-5 shadow-sm">
            <h2 className="font-bold">{b.studentName || 'Student'}</h2>
            <p className="mt-2">{b.date} · {b.time}</p><p className="mt-2 font-semibold">Status: {b.status}</p>
            {b.status === 'Booked' && <div className="mt-4 flex flex-wrap gap-3">
              <button disabled={!!busy} onClick={() => changeStatus(b.id, 'Completed')} className="rounded-xl bg-green-700 px-4 py-2 font-semibold text-white disabled:opacity-60">Mark completed</button>
              <button disabled={!!busy} onClick={() => changeStatus(b.id, 'Cancelled')} className="rounded-xl border border-red-200 px-4 py-2 font-semibold text-red-700 disabled:opacity-60">Cancel session</button>
            </div>}
          </article>)}</div>}
    </main>
  )
}
export default MentorSessions

