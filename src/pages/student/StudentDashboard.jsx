import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { fetchBookings } from '../../services/databaseService'

function StudentDashboard() {
  const { user } = useAuth()
  const [bookings, setBookings] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    fetchBookings().then(setBookings).catch(e => setError(e.message))
  }, [])

  const stats = [
    ['My bookings', bookings.length],
    ['Upcoming / active', bookings.filter(b => b.status === 'Booked').length],
    ['Completed sessions', bookings.filter(b => b.status === 'Completed').length],
    ['Cancelled bookings', bookings.filter(b => b.status === 'Cancelled').length],
  ]

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <header className="rounded-3xl bg-gradient-to-r from-blue-700 to-indigo-800 p-7 text-white shadow-lg sm:p-10">
        <p className="font-bold uppercase tracking-widest text-blue-100">Student dashboard</p>
        <h1 className="mt-3 text-3xl font-extrabold">Welcome, {user?.name || 'Student'}!</h1>
        <p className="mt-3 text-blue-100">Your activity is loaded from the database.</p>
        <div className="mt-6 flex flex-wrap gap-3"><Link to="/mentors" className="rounded-xl bg-white px-5 py-3 font-bold text-blue-800">Find a mentor →</Link><Link to="/bookings" className="rounded-xl border border-white/40 px-5 py-3 font-bold">My bookings</Link></div>
      </header>
      {error && <p role="alert" className="mt-4 rounded-xl bg-red-50 p-4 text-red-700">{error}</p>}
      <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{stats.map(([label, value]) => <article key={label} className="rounded-2xl border bg-white p-5 shadow-sm"><p className="text-sm text-slate-600">{label}</p><p className="mt-3 text-3xl font-extrabold">{value}</p></article>)}</section>
    </main>
  )
}
export default StudentDashboard
