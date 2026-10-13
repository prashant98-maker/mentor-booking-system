function BookingCard({ booking, onCancel }) {
  const cancelled = booking.status === 'Cancelled'
  const completed = booking.status === 'Completed'

  return (
    <article className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white/95 p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 className="font-bold text-slate-900">{booking.mentorName}</h2>
        <p className="mt-1 text-slate-600">{booking.date}</p>
        <p className="mt-1 text-sm text-slate-500">{booking.time}</p>
        <span className={`mt-3 inline-flex rounded-full px-3 py-1 text-xs font-bold ${
          cancelled ? 'bg-red-100 text-red-700' :
          completed ? 'bg-green-100 text-green-700' :
          'bg-blue-100 text-blue-700'
        }`}>
          {booking.status || 'Booked'}
        </span>
      </div>

      {!cancelled && !completed && (
        <button
          type="button"
          onClick={() => onCancel(booking.id)}
          className="min-h-11 rounded-xl border border-red-200 px-4 py-2 font-semibold text-red-600 hover:bg-red-50"
        >
          Cancel booking
        </button>
      )}
    </article>
  )
}

export default BookingCard
