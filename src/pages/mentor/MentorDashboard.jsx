import { useState } from 'react'
import { addSlot, getSlots } from '../../services/slotService'
import { getBookings, updateBookingStatus } from '../../services/bookingService'

function MentorDashboard() {
  const [slots, setSlots] = useState(getSlots)
  const [bookings, setBookings] = useState(getBookings)
  const [mentorName, setMentorName] = useState('Aarav Sharma')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('10:00 AM - 10:30 AM')
  const [message, setMessage] = useState('')

  function handleAddSlot(event) {
    event.preventDefault()
    if (!date) { setMessage('Please select a date.'); return }
    addSlot({ mentorId: mentorName === 'Aarav Sharma' ? 1 : mentorName === 'Priya Verma' ? 2 : 3, mentorName, date, time })
    setSlots(getSlots())
    setMessage('New time slot added successfully.')
    setDate('')
  }

  function changeStatus(id, status) {
    updateBookingStatus(id, status)
    setBookings(getBookings())
    setSlots(getSlots())
    setMessage('Booking updated: ' + status)
  }

  function isBooked(slot) {
    return bookings.some(b => String(b.slotId) === String(slot.id) && b.status !== 'Cancelled')
  }

  const active = bookings.filter(b => b.status === 'Booked')
  const available = slots.filter(slot => !isBooked(slot))
  const completed = bookings.filter(b => b.status === 'Completed')

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      <header className="rounded-3xl bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-900 p-6 text-white shadow-lg sm:p-9">
        <p className="font-bold uppercase tracking-widest text-cyan-300">Mentor workspace</p><h1 className="mt-3 text-3xl font-extrabold sm:text-4xl">Mentor Dashboard</h1>
        <p className="mt-3 max-w-2xl leading-7 text-slate-300">Create available slots, review student bookings and manage sessions from one dashboard.</p>
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">{[['Total slots',slots.length],['Available slots',available.length],['Active bookings',active.length],['Completed sessions',completed.length]].map(([label,value]) => <div key={label} className="rounded-2xl bg-white/10 p-4"><p className="text-sm text-slate-300">{label}</p><p className="mt-2 text-2xl font-extrabold">{value}</p></div>)}</div>
        <div className="mt-6 flex flex-wrap gap-3"><a href="#create-slot" className="rounded-xl bg-cyan-300 px-5 py-3 font-bold text-slate-950 hover:bg-cyan-200">Manage Availability ↓</a><a href="#student-bookings" className="rounded-xl border border-white/30 px-5 py-3 font-bold hover:bg-white/10">My Sessions ↓</a></div>
      </header>

      {message && <p role="status" className="mt-5 rounded-xl bg-blue-50 p-4 text-sm text-blue-800">{message}</p>}

      <section id="create-slot" className="mt-10 scroll-mt-28 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
        <p className="text-sm font-bold uppercase tracking-widest text-blue-700">Manage Availability</p><h2 className="mt-2 text-2xl font-extrabold">Create an available slot</h2>
        <form onSubmit={handleAddSlot} className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <label className="text-sm font-semibold">Mentor<select value={mentorName} onChange={e => setMentorName(e.target.value)} className="mt-2 min-h-11 w-full rounded-xl border border-slate-300 bg-white px-3"><option>Aarav Sharma</option><option>Priya Verma</option><option>Rahul Singh</option></select></label>
          <label className="text-sm font-semibold">Date<input type="date" required min={new Date().toISOString().slice(0,10)} value={date} onChange={e => setDate(e.target.value)} className="mt-2 min-h-11 w-full rounded-xl border border-slate-300 px-3"/></label>
          <label className="text-sm font-semibold">Time<select value={time} onChange={e => setTime(e.target.value)} className="mt-2 min-h-11 w-full rounded-xl border border-slate-300 bg-white px-3"><option>09:00 AM - 09:30 AM</option><option>10:00 AM - 10:30 AM</option><option>11:00 AM - 11:30 AM</option><option>02:00 PM - 02:30 PM</option><option>03:00 PM - 03:30 PM</option><option>04:00 PM - 04:30 PM</option></select></label>
          <div className="flex items-end"><button type="submit" className="min-h-11 w-full rounded-xl bg-blue-600 px-5 py-3 font-bold text-white hover:bg-blue-700">+ Add slot</button></div>
        </form>
      </section>

      <section id="all-time-slots" className="mt-9 scroll-mt-28"><div className="flex flex-wrap items-end justify-between gap-3"><div><p className="text-sm font-bold uppercase tracking-widest text-blue-700">Your schedule</p><h2 className="mt-2 text-2xl font-extrabold">All time slots</h2></div><span className="rounded-full bg-blue-50 px-4 py-2 text-sm font-bold text-blue-800">{slots.length} total</span></div>
        {slots.length === 0 ? <p className="mt-5 rounded-2xl bg-white p-6 text-slate-600">No slots yet. Add your first slot above.</p> : <div className="mt-5 grid gap-4 md:grid-cols-2">{slots.map(slot => <article key={slot.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex items-start justify-between gap-3"><div><h3 className="font-bold">{slot.mentorName}</h3><p className="mt-2 text-slate-600">{slot.date}</p><p className="mt-1 text-sm text-slate-500">{slot.time}</p></div><span className={'rounded-full px-3 py-1 text-xs font-bold ' + (isBooked(slot) ? 'bg-amber-100 text-amber-800' : 'bg-green-100 text-green-800')}>{isBooked(slot) ? 'Booked' : 'Available'}</span></div></article>)}</div>}
      </section>

      <section id="student-bookings" className="mt-12 scroll-mt-28 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7"><p className="text-sm font-bold uppercase tracking-widest text-indigo-700">My Sessions</p><h2 className="mt-2 text-2xl font-extrabold">Student bookings</h2><p className="mt-2 text-slate-600">Review bookings and update session status.</p>
        {bookings.length === 0 ? <p className="mt-5 rounded-xl bg-slate-50 p-6 text-slate-600">No demo bookings yet.</p> : <div className="mt-5 space-y-4">{bookings.slice().reverse().map(booking => <article key={booking.id} className="flex flex-col gap-4 rounded-2xl border border-slate-200 p-5 sm:flex-row sm:items-center sm:justify-between"><div><h3 className="font-bold">{booking.mentorName}</h3><p className="mt-2 text-slate-600">{booking.date}</p><p className="mt-1 text-sm text-slate-500">{booking.time}</p><p className="mt-3 text-sm font-semibold">Status: {booking.status}</p></div>{booking.status === 'Booked' && <div className="flex flex-wrap gap-2"><button onClick={() => changeStatus(booking.id,'Completed')} className="min-h-11 rounded-xl bg-green-600 px-4 py-2 font-semibold text-white hover:bg-green-700">Mark completed</button><button onClick={() => changeStatus(booking.id,'Cancelled')} className="min-h-11 rounded-xl border border-red-200 px-4 py-2 font-semibold text-red-600 hover:bg-red-50">Cancel session</button></div>}</article>)}</div>}
      </section>

      <section className="mt-10 rounded-2xl bg-slate-50 p-6"><h2 className="text-xl font-extrabold">Mentor checklist</h2><div className="mt-4 grid gap-4 sm:grid-cols-3"><p className="text-slate-600"><strong>Keep availability updated.</strong><br/>Add slots that fit your schedule.</p><p className="text-slate-600"><strong>Review your sessions.</strong><br/>Check booking details regularly.</p><p className="text-slate-600"><strong>Update status.</strong><br/>Mark sessions completed or cancelled.</p></div></section>
      <p className="mt-8 text-xs text-slate-500">Demo version: data is stored in this browser. Shared multi-user bookings and email reminders require backend integration.</p>
    </main>
  )
}
export default MentorDashboard
