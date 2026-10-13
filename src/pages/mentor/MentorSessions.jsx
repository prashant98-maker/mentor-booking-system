import { useState } from 'react'
import { getBookings, updateBookingStatus } from '../../services/bookingService'

function MentorSessions() {
  const [bookings, setBookings] = useState(getBookings)
  const [message, setMessage] = useState('')

  function changeStatus(id, status) {
    updateBookingStatus(id, status)
    setBookings(getBookings())
    setMessage(`Session status updated to ${status}.`)
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12">
      <header className="rounded-3xl bg-white/95 p-6 shadow-sm sm:p-8">
        <p className="font-semibold text-blue-700">MENTOR WORKSPACE</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl">My Sessions</h1>
        <p className="mt-3 text-slate-600">View student bookings and update each session status.</p>
        <div className="mt-5 grid grid-cols-2 gap-3 sm:max-w-lg">
          <div className="rounded-2xl bg-blue-50 p-4">
            <p className="text-sm text-slate-600">Active sessions</p>
            <p className="mt-1 text-2xl font-bold text-blue-800">{bookings.filter((b) => b.status === 'Booked').length}</p>
          </div>
          <div className="rounded-2xl bg-slate-100 p-4">
            <p className="text-sm text-slate-600">All bookings</p>
            <p className="mt-1 text-2xl font-bold text-slate-900">{bookings.length}</p>
          </div>
        </div>
      </header>

      {message && <p role="status" className="mt-5 rounded-xl bg-blue-50 p-4 text-sm text-blue-800">{message}</p>}

      <section className="mt-8">
        <h2 className="text-2xl font-bold text-slate-900">Student bookings</h2>
        {bookings.length === 0 ? (
          <p className="mt-4 rounded-2xl bg-white/95 p-6 text-slate-600">No student bookings yet.</p>
        ) : (
          <div className="mt-5 space-y-4">
            {bookings.slice().reverse().map((booking) => (
              <article key={booking.id} className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white/95 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="font-bold text-slate-900">{booking.mentorName}</h3>
                  <p className="mt-1 text-slate-600">{booking.date}</p>
                  <p className="mt-1 text-sm text-slate-500">{booking.time}</p>
                  <p className="mt-2 text-sm font-semibold text-slate-800">Status: {booking.status}</p>
                </div>
                {booking.status === 'Booked' && (
                  <div className="flex flex-wrap gap-2">
                    <button type="button" onClick={() => changeStatus(booking.id, 'Completed')} className="min-h-11 rounded-xl bg-green-600 px-4 py-2 font-semibold text-white hover:bg-green-700">Mark completed</button>
                    <button type="button" onClick={() => changeStatus(booking.id, 'Cancelled')} className="min-h-11 rounded-xl border border-red-200 px-4 py-2 font-semibold text-red-600 hover:bg-red-50">Cancel session</button>
                  </div>
                )}
              </article>
            ))}
          </div>
        )}
      </section>

      <p className="mt-8 text-sm text-slate-500">Demo mode: bookings are stored in this browser.</p>
    </main>
  )
}

export default MentorSessions
