import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { fetchBookings, fetchMentorProfiles } from '../../services/databaseService'
import MentorCard from '../../components/MentorCard'

function StudentDashboard() {
  const { user } = useAuth()
  const [bookings, setBookings] = useState([])
  const [mentors, setMentors] = useState([])
  const [error, setError] = useState('')
  const [mentorError, setMentorError] = useState('')
  const [mentorsLoading, setMentorsLoading] = useState(true)

  useEffect(() => {
    fetchBookings().then(setBookings).catch(e => setError(e.message))

    fetchMentorProfiles()
      .then(setMentors)
      .catch(e => setMentorError(e.message))
      .finally(() => setMentorsLoading(false))
  }, [])

  const stats = [
    ['My bookings', bookings.length],
    ['Upcoming / active', bookings.filter(b => b.status === 'Booked').length],
    ['Completed sessions', bookings.filter(b => b.status === 'Completed').length],
    ['Cancelled bookings', bookings.filter(b => b.status === 'Cancelled').length],
  ]

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">z
      <header className="rounded-3xl bg-gradient-to-r from-blue-700 to-indigo-800 p-7 text-white shadow-lg sm:p-10">
        <p className="font-bold uppercase tracking-widest text-blue-100">Student dashboard</p>
        <h1 className="mt-3 text-3xl font-extrabold">Welcome, {user?.name || 'Student'}!</h1>
        <p className="mt-3 text-blue-100">Your activity is loaded from the database.</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link to="/mentors" className="rounded-xl bg-white px-5 py-3 font-bold text-blue-800">Find a mentor →</Link>
          <Link to="/bookings" className="rounded-xl border border-white/40 px-5 py-3 font-bold">My bookings</Link>
        </div>
      </header>

      {error && <p role="alert" className="mt-4 rounded-xl bg-red-50 p-4 text-red-700">{error}</p>}

      <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(([label, value]) => (
          <article key={label} className="rounded-2xl border bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-600">{label}</p>
            <p className="mt-3 text-3xl font-extrabold">{value}</p>
          </article>
        ))}
      </section>

      <section className="mt-10">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-blue-700">Discover</p>
            <h2 className="mt-2 text-2xl font-extrabold text-slate-900">Meet Your Mentors</h2>
            <p className="mt-2 text-slate-600">Explore mentor profiles and find the right guide for you.</p>
          </div>
          <Link to="/mentors" className="font-bold text-blue-700 hover:underline">View all mentors →</Link>
        </div>

        {mentorError && <p role="alert" className="mt-4 rounded-xl bg-amber-50 p-4 text-amber-900">{mentorError}</p>}

        {mentorsLoading ? (
          <p className="mt-5 text-slate-600">Loading mentor profiles...</p>
        ) : mentors.length === 0 ? (
          <div className="mt-5 rounded-2xl border bg-white p-6 text-slate-600">
            No mentor profiles are available yet.
            <Link to="/mentors" className="ml-2 font-semibold text-blue-700 hover:underline">Explore mentors</Link>
          </div>
        ) : (
          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {mentors.slice(0, 3).map(mentor => (
              <MentorCard key={mentor.id} mentor={mentor} />
            ))}
          </div>
        )}
      </section>
    </main>
  )
}

export default StudentDashboard
