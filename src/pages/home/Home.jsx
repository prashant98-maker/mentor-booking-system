import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

function Home() {
  const { user } = useAuth()
  const mentor = user?.role === 'mentor'
  const student = user?.role === 'student'
  const target = mentor ? '/mentor-dashboard' : student ? '/mentors' : '/signup'

  return (
    <main className="w-full">
      <section className="bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-900 px-4 py-20 text-white sm:px-8 sm:py-28">
        <div className="mx-auto max-w-6xl">
          <p className="font-bold uppercase tracking-widest text-cyan-300">Your learning journey starts here</p>
          <h1 className="mt-5 max-w-4xl text-4xl font-extrabold leading-tight sm:text-6xl">Learn from the right <span className="text-cyan-300">mentor for you.</span></h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-200">Discover mentors, organise availability, book sessions and manage your mentoring journey in one place.</p>
          {user && <p className="mt-4 text-cyan-200">Welcome back, {user.name}!</p>}
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to={target} className="rounded-xl bg-cyan-300 px-6 py-3 font-bold text-slate-950 hover:bg-cyan-200">{mentor ? 'Open Mentor Dashboard' : student ? 'Explore Mentors' : 'Get Started'} →</Link>
            {mentor ? <Link to="/mentor-dashboard#create-slot" className="rounded-xl border border-white/30 px-6 py-3 font-bold hover:bg-white/10">Manage Availability</Link> : student ? <Link to="/bookings" className="rounded-xl border border-white/30 px-6 py-3 font-bold hover:bg-white/10">My Bookings</Link> : <Link to="/login" className="rounded-xl border border-white/30 px-6 py-3 font-bold hover:bg-white/10">Login</Link>}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-8 sm:py-20">
        <div className="text-center"><p className="font-bold uppercase tracking-widest text-blue-700">Platform features</p><h2 className="mt-3 text-3xl font-extrabold text-slate-900 sm:text-4xl">Everything you need to get started</h2><p className="mx-auto mt-4 max-w-2xl leading-7 text-slate-600">A simple way to connect learners and mentors, plan sessions and track bookings.</p></div>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {[['🔎','Discover mentors','Explore mentoring options and find guidance that matches your goals.'],['📅','Manage availability','Mentors can create time slots and review their schedules.'],['🤝','Track sessions','Students can review bookings and check their current status.']].map(([icon,title,desc]) => <article key={title} className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"><span className="text-4xl">{icon}</span><h3 className="mt-5 text-xl font-bold text-slate-900">{title}</h3><p className="mt-3 leading-7 text-slate-600">{desc}</p></article>)}
        </div>
      </section>

      <section className="bg-slate-50 px-4 py-16 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-6xl"><div className="text-center"><p className="font-bold uppercase tracking-widest text-indigo-700">How it works</p><h2 className="mt-3 text-3xl font-extrabold text-slate-900">Three simple steps</h2></div>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {[['01','Sign in','Choose the appropriate account role.'],['02','Explore or publish','Students explore mentors; mentors create available slots.'],['03','Manage sessions','Review bookings and keep session statuses updated.']].map(([n,title,desc]) => <article key={n} className="rounded-2xl border border-slate-200 bg-white p-7"><p className="text-4xl font-extrabold text-blue-200">{n}</p><h3 className="mt-4 text-xl font-bold">{title}</h3><p className="mt-3 leading-7 text-slate-600">{desc}</p></article>)}
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-8"><div className="mx-auto max-w-5xl rounded-3xl bg-gradient-to-r from-blue-700 to-indigo-800 p-8 text-white sm:p-12"><h2 className="text-3xl font-extrabold">Prepare for a productive session</h2><p className="mt-4 max-w-3xl leading-7 text-blue-100">Check the date and time, prepare your questions and review your booking status. Mentors can keep availability organised and students can keep track of their learning sessions.</p><Link to={target} className="mt-6 inline-block rounded-xl bg-white px-6 py-3 font-bold text-blue-800">{mentor ? 'Open Mentor Dashboard' : student ? 'Explore Mentors' : 'Get Started'} →</Link></div></section>
      <footer className="border-t border-slate-200 px-4 py-8 text-center text-sm text-slate-500">Mentor Booking System · Organise learning, availability and sessions.<p className="mt-2 text-xs">Demo version: shared server data, email notifications and automatic reminders require backend integration.</p></footer>
    </main>
  )
}
export default Home
