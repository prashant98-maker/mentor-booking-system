import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import BookingCard from '../../components/BookingCard'
import { cancelBooking, getBookings } from '../../services/bookingService'

function Bookings() {
  const [bookings, setBookings] = useState([])

  useEffect(() => {
    setBookings(getBookings())
  }, [])

  function handleCancel(id) {
    cancelBooking(id)
    setBookings(getBookings())
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-12">
      <div className="rounded-3xl bg-white/90 p-6 shadow-sm sm:p-8">
        <p className="font-semibold text-blue-700">YOUR LEARNING JOURNEY</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl">My Bookings</h1>
        <p className="mt-3 text-slate-600">View and manage your demo mentor sessions.</p>
      </div>

      {bookings.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-white/95 p-8 text-center sm:p-10">
          <h2 className="text-xl font-semibold text-slate-800">No bookings yet</h2>
          <p className="mt-2 text-slate-500">Visit the Mentors page to book a demo slot.</p>
          <Link to="/mentors" className="mt-5 inline-flex min-h-11 items-center rounded-xl bg-blue-600 px-5 py-2.5 font-semibold text-white hover:bg-blue-700">Explore mentors</Link>
        </div>
      ) : (
        <div className="mt-8 space-y-4">
          {bookings.slice().reverse().map((booking) => (
            <BookingCard key={booking.id} booking={booking} onCancel={handleCancel} />
          ))}
        </div>
      )}

      <p className="mt-8 text-sm text-slate-500">
        Demo mode: bookings are stored in this browser, not a shared database.
      </p>
    </main>
  )
}

export default Bookings
