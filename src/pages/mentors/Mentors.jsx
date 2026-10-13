import { useState } from 'react'
import { Link } from 'react-router-dom'
import MentorCard from '../../components/MentorCard'
import SlotCard from '../../components/SlotCard'
import mentors from '../../services/mentorService'
import { addBooking, getBookings } from '../../services/bookingService'
import { getSlots } from '../../services/slotService'

function makeSlots() {
  const slots = getSlots()
  const bookings = getBookings()

  return slots.map((slot) => ({
    ...slot,
    date: new Date(`${slot.date}T12:00:00`).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }),
    available: !bookings.some(
      (booking) =>
        String(booking.slotId) === String(slot.id) &&
        booking.status !== 'Cancelled',
    ),
  }))
}

function Mentors() {
  const [slots, setSlots] = useState(makeSlots)
  const [message, setMessage] = useState('')
  const [success, setSuccess] = useState(false)

  function handleBook(slot) {
    const result = addBooking(slot)

    if (!result.success) {
      setMessage(result.message)
      setSuccess(false)
      setSlots(makeSlots())
      return
    }

    setSlots(makeSlots())
    setMessage(`${slot.mentorName} ka slot book ho gaya!`)
    setSuccess(true)
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12">
      <section>
        <div className="max-w-3xl rounded-3xl bg-white/90 p-6 shadow-sm sm:p-8">
          <p className="font-semibold text-blue-700">MENTORHUB • YOUR NEXT STEP</p>
          <h1 className="mt-3 text-3xl font-bold text-slate-900 sm:text-4xl">
            Meet Our Mentors
          </h1>
          <p className="mt-3 leading-7 text-slate-600">
            Explore mentor profiles and find the right guidance for your goals.
          </p>
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {mentors.map((mentor) => (
            <MentorCard key={mentor.id} mentor={mentor} />
          ))}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
          Available Time Slots
        </h2>
        <p className="mt-2 text-slate-600">
          Choose an available time to book a session with a mentor.
        </p>

        {message && (
          <div className={`mt-5 rounded-xl p-4 text-sm ${success ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-900'}`}>
            {message}
            {success && <Link className="ml-2 font-bold underline" to="/bookings">View bookings</Link>}
          </div>
        )}

        <div className="mt-6 space-y-4">
          {slots.map((slot) => (
            <SlotCard key={slot.id} slot={slot} onBook={handleBook} />
          ))}
        </div>
      </section>
    </main>
  )
}

export default Mentors
