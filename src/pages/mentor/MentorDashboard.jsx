import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { fetchSlots, fetchBookings } from '../../services/databaseService'

function MentorDashboard() {
  const { user } = useAuth()
  const [slots, setSlots] = useState([])
  const [bookings, setBookings] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    Promise.all([fetchSlots(), fetchBookings()])
      .then(([allSlots, allBookings]) => {
        const id = String(user?.id || user?._id)
        setSlots(allSlots.filter(s => String(s.mentorId) === id))
        setBookings(allBookings)
      })
      .catch(e => setError(e.message))
  }, [])

  const stats = [
    ['Total slots', slots.length],
    ['Available slots', slots.filter(s => s.available).length],
    ['Active bookings', bookings.filter(b => b.status === 'Booked').length],
    ['Completed sessions', bookings.filter(b => b.status === 'Completed').length],
  ]

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <header className="rounded-3xl bg-gradient-to-r from-slate-950 to-blue-950 p-7 text-white shadow-lg sm:p-10">
        <p className="font-bold uppercase tracking-widest text-cyan-300">Mentor workspace</p>
        <h1 className="mt-3 text-3xl font-extrabold sm:text-4xl">Mentor Dashboard</h1>
        <p className="mt-3 text-slate-200">Manage your database slots and sessions.</p>
        <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{stats.map(([label, value]) => <article key={label} className="rounded-2xl bg-white/10 p-4"><p className="text-sm text-slate-200">{label}</p><p className="mt-2 text-3xl font-extrabold">{value}</p></article>)}</div>
        <div className="mt-6 flex flex-wrap gap-3"><Link to="/mentor-availability" className="rounded-xl bg-cyan-400 px-5 py-3 font-bold text-slate-950">Manage Availability →</Link><Link to="/mentor-sessions" className="rounded-xl border border-white/40 px-5 py-3 font-bold">My Sessions →</Link></div>
      </header>
      {error && <p role="alert" className="mt-4 rounded-xl bg-red-50 p-4 text-red-700">{error}</p>}
      <section className="mt-8 rounded-2xl bg-white p-6 shadow-sm"><h2 className="text-xl font-bold">Your slots</h2>{slots.length === 0 ? <p className="mt-3 text-slate-600">No slots found for this mentor account yet.</p> : <div className="mt-4 grid gap-3 sm:grid-cols-2">{slots.map(s => <article key={s.id} className="rounded-xl border p-4"><p className="font-semibold">{s.date} · {s.time}</p><p className="mt-2 text-sm">{s.available ? 'Available' : 'Booked'}</p></article>)}</div>}</section>
    </main>
  )
}
export default MentorDashboard
