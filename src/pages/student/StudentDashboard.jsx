import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { getBookings } from '../../services/bookingService'

function StudentDashboard() {
  const { user } = useAuth()
  const bookings = getBookings()
  const active = bookings.filter(b => b.status === 'Booked')
  const completed = bookings.filter(b => b.status === 'Completed')
  const cancelled = bookings.filter(b => b.status === 'Cancelled')
  const stats = [
    ['My bookings', bookings.length, '📅'],
    ['Upcoming / active', active.length, '⏰'],
    ['Completed sessions', completed.length, '✓'],
    ['Cancelled bookings', cancelled.length, '↩'],
  ]

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      <header className="rounded-3xl bg-gradient-to-r from-blue-700 to-indigo-800 p-6 text-white shadow-lg sm:p-10">
        <p className="font-bold uppercase tracking-widest text-blue-100">Student dashboard</p>
        <h1 className="mt-3 text-3xl font-extrabold sm:text-4xl">Welcome, {user?.name || 'Student'}!</h1>
        <p className="mt-4 max-w-2xl leading-7 text-blue-100">Find mentors, manage your bookings and track your mentoring journey from one place.</p>
        <div className="mt-6 flex flex-wrap gap-3"><Link to="/mentors" className="rounded-xl bg-white px-5 py-3 font-bold text-blue-800 hover:bg-blue-50">Find a mentor →</Link><Link to="/bookings" className="rounded-xl border border-white/40 px-5 py-3 font-bold hover:bg-white/10">My bookings</Link></div>
      </header>

      <section className="mt-9"><p className="text-sm font-bold uppercase tracking-widest text-blue-700">Your overview</p><h2 className="mt-2 text-2xl font-extrabold text-slate-900">Your mentoring activity</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{stats.map(([label,value,icon]) => <article key={label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex items-center justify-between gap-2"><p className="text-sm text-slate-600">{label}</p><span className="text-2xl">{icon}</span></div><p className="mt-4 text-3xl font-extrabold text-slate-900">{value}</p></article>)}</div>
      </section>

      <section className="mt-10"><h2 className="text-2xl font-extrabold text-slate-900">Quick actions</h2><div className="mt-5 grid gap-5 md:grid-cols-2">
        <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><span className="text-3xl">🔎</span><h3 className="mt-4 text-xl font-bold">Find a mentor</h3><p className="mt-3 leading-7 text-slate-600">Browse mentor profiles and explore available times for your learning goals.</p><Link to="/mentors" className="mt-5 inline-block font-bold text-blue-700">Browse mentors →</Link></article>
        <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><span className="text-3xl">🗓️</span><h3 className="mt-4 text-xl font-bold">My bookings</h3><p className="mt-3 leading-7 text-slate-600">Review your sessions, check booking status and cancel when the option is available.</p><Link to="/bookings" className="mt-5 inline-block font-bold text-blue-700">Manage my bookings →</Link></article>
      </div></section>

      <section className="mt-10 rounded-2xl bg-slate-50 p-6 sm:p-8"><h2 className="text-xl font-extrabold">Prepare for your session</h2><div className="mt-4 grid gap-4 sm:grid-cols-3"><p className="leading-6 text-slate-600"><strong>1. Plan ahead</strong><br/>Check your booking date and time.</p><p className="leading-6 text-slate-600"><strong>2. Prepare questions</strong><br/>Note the topics you want to discuss.</p><p className="leading-6 text-slate-600"><strong>3. Track progress</strong><br/>Review your session status afterwards.</p></div></section>
      <p className="mt-8 text-xs leading-5 text-slate-500">Demo statistics use browser-based booking data. Shared server-side data will be added with backend integration.</p>
    </main>
  )
}
export default StudentDashboard
