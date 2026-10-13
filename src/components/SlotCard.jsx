function SlotCard({ slot, onBook }) {
  return (
    <article className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white/95 p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h3 className="font-bold text-slate-900">{slot.date}</h3>
        <p className="mt-1 text-slate-600">{slot.time}</p>
        <p className="mt-1 text-sm text-slate-500">Mentor: {slot.mentorName}</p>
      </div>
      <button
        type="button"
        disabled={!slot.available}
        onClick={() => onBook(slot)}
        className="min-h-11 rounded-xl bg-blue-600 px-5 py-2.5 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
      >
        {slot.available ? 'Book slot' : 'Unavailable'}
      </button>
    </article>
  )
}

export default SlotCard
