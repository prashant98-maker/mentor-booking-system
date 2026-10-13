import { useState } from 'react'
import { addSlot, getSlots } from '../../services/slotService'
import { getBookings } from '../../services/bookingService'

function formatDate(value) {
  if (!value) return 'Date not set'
  const parsed = new Date(`${value}T12:00:00`)
  return Number.isNaN(parsed.getTime())
    ? value
    : parsed.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
}

function Availability() {
  const [slots, setSlots] = useState(getSlots)
  const [bookings, setBookings] = useState(getBookings)
  const [mentorName, setMentorName] = useState('Aarav Sharma')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('10:00 AM - 10:30 AM')
  const [message, setMessage] = useState('')

  function handleAddSlot(event) {
    event.preventDefault()

    if (!date) {
      setMessage('Please select a date.')
      return
    }

    const duplicate = slots.some(
      (slot) =>
        slot.mentorName === mentorName &&
        slot.date === date &&
        slot.time === time,
    )

    if (duplicate) {
      setMessage('This mentor already has a slot at that date and time.')
      return
    }

    addSlot({
      mentorId: mentorName === 'Aarav Sharma' ? 1 : mentorName === 'Priya Verma' ? 2 : 3,
      mentorName,
      date,
      time,
    })

    setSlots(getSlots())
    setBookings(getBookings())
    setMessage('New time slot added successfully.')
    setDate('')
  }

  function isBooked(slot) {
    return bookings.some(
      (booking) =>
        String(booking.slotId) === String(slot.id) &&
        booking.status !== 'Cancelled',
    )
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12">
      <header className="rounded-3xl bg-white/95 p-6 shadow-sm sm:p-8">
        <p className="font-semibold text-blue-700">MENTOR WORKSPACE</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl">Availability</h1>
        <p className="mt-3 text-slate-600">Create slots and view all time slots in one place.</p>
      </header>

      {message && <p role="status" className="mt-5 rounded-xl bg-blue-50 p-4 text-sm text-blue-800">{message}</p>}

      <section className="mt-8 rounded-2xl border border-slate-200 bg-white/95 p-5 shadow-sm sm:p-7">
        <h2 className="text-xl font-bold text-slate-900">Create an available slot</h2>
        <form onSubmit={handleAddSlot} className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <label className="text-sm font-semibold text-slate-700">
            Mentor
            <select value={mentorName} onChange={(e) => setMentorName(e.target.value)} className="mt-2 min-h-11 w-full rounded-xl border border-slate-300 bg-white px-3">
              <option>Aarav Sharma</option>
              <option>Priya Verma</option>
              <option>Rahul Singh</option>
            </select>
          </label>

          <label className="text-sm font-semibold text-slate-700">
            Date
            <input type="date" required min={new Date().toLocaleDateString('en-CA')} value={date} onChange={(e) => setDate(e.target.value)} className="mt-2 min-h-11 w-full rounded-xl border border-slate-300 px-3" />
          </label>

          <label className="text-sm font-semibold text-slate-700">
            Time
            <select value={time} onChange={(e) => setTime(e.target.value)} className="mt-2 min-h-11 w-full rounded-xl border border-slate-300 bg-white px-3">
              <option>09:00 AM - 09:30 AM</option>
              <option>10:00 AM - 10:30 AM</option>
              <option>11:00 AM - 11:30 AM</option>
              <option>02:00 PM - 02:30 PM</option>
              <option>03:00 PM - 03:30 PM</option>
              <option>04:00 PM - 04:30 PM</option>
            </select>
          </label>

          <div className="flex items-end">
            <button type="submit" className="min-h-11 w-full rounded-xl bg-blue-600 px-5 py-2.5 font-bold text-white hover:bg-blue-700">Add slot</button>
          </div>
        </form>
      </section>

      <section className="mt-10">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-2xl font-bold text-slate-900">All time slots</h2>
          <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700">{slots.length} total</span>
        </div>

        {slots.length === 0 ? (
          <p className="mt-5 rounded-2xl bg-white p-6 text-slate-600">No slots yet. Create your first available slot above.</p>
        ) : (
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {slots.slice().sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`)).map((slot) => (
              <article key={slot.id} className="rounded-2xl border border-slate-200 bg-white/95 p-5 shadow-sm">
                <h3 className="font-bold text-slate-900">{slot.mentorName}</h3>
                <p className="mt-2 text-slate-600">{formatDate(slot.date)}</p>
                <p className="mt-1 text-sm text-slate-500">{slot.time}</p>
                <span className={`mt-3 inline-flex rounded-full px-3 py-1 text-xs font-bold ${isBooked(slot) ? 'bg-amber-100 text-amber-800' : 'bg-green-100 text-green-800'}`}>
                  {isBooked(slot) ? 'Booked' : 'Available'}
                </span>
              </article>
            ))}
          </div>
        )}
      </section>

      <p className="mt-8 text-sm text-slate-500">Demo mode: slots are stored in this browser.</p>
    </main>
  )
}

export default Availability
