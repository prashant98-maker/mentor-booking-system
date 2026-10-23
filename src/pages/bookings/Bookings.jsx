import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { cancelMyBooking, fetchBookings, rateBooking } from '../../services/databaseService'

function Bookings() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState('')
  const [ratings, setRatings] = useState({})

  const load = useCallback(async () => {
    setLoading(true)
    try {
      setBookings(await fetchBookings())
      setError('')
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => { void load() }, 0)
    return () => clearTimeout(timer)
  }, [load])

  async function cancel(id) {
    setBusy(id)
    setError('')
    setMessage('')
    try {
      await cancelMyBooking(id)
      setMessage('Booking cancelled.')
      await load()
    } catch (e) {
      setError(e.message)
    } finally {
      setBusy('')
    }
  }

  function updateRating(id, field, value) {
    setRatings(previous => ({
      ...previous,
      [id]: {
        stars: previous[id]?.stars ?? '5',
        review: previous[id]?.review ?? '',
        ...previous[id],
        [field]: value,
      },
    }))
  }

  async function submitRating(id) {
    const rating = ratings[id] || { stars: '5', review: '' }
    setBusy(id)
    setError('')
    setMessage('')
    try {
      await rateBooking(id, {
        stars: Number(rating.stars),
        review: rating.review || '',
      })
      setMessage('Rating submitted successfully.')
      setRatings(previous => {
        const next = { ...previous }
        delete next[id]
        return next
      })
      await load()
    } catch (e) {
      setError(e.message)
    } finally {
      setBusy('')
    }
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <header className="rounded-3xl bg-white p-6 shadow-sm sm:p-8">
        <h1 className="text-3xl font-bold">My Bookings</h1>
        <p className="mt-3 text-slate-600">Your account bookings from MongoDB.</p>
      </header>

      {message && <p role="status" className="mt-4 rounded-xl bg-green-50 p-4 text-green-800">{message}</p>}
      {error && <p role="alert" className="mt-4 rounded-xl bg-red-50 p-4 text-red-700">{error}</p>}

      {loading ? <p className="mt-5">Loading bookings...</p> : bookings.length === 0 ? (
        <div className="mt-6 rounded-2xl bg-white p-8 text-center">
          <p>No bookings found.</p>
          <Link to="/mentors" className="mt-4 inline-block font-bold text-blue-700">Explore available slots →</Link>
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {bookings.map(b => (
            <article key={b.id} className="rounded-2xl border bg-white p-5 shadow-sm">
              <h2 className="text-lg font-bold">{b.mentorName}</h2>
              <p className="mt-2">{b.date} · {b.time}</p>
              <p className="mt-2 font-semibold">Status: {b.status}</p>

              {b.status === 'Booked' && (
                <button type="button" disabled={!!busy} onClick={() => cancel(b.id)}
                  className="mt-4 rounded-xl border border-red-200 px-4 py-2 font-semibold text-red-700 disabled:opacity-60">
                  {busy === b.id ? 'Cancelling...' : 'Cancel booking'}
                </button>
              )}

              {b.status === 'Completed' && b.rating?.stars && (
                <div className="mt-4 rounded-xl bg-green-50 p-4">
                  <p className="font-semibold">Your rating: {'★'.repeat(b.rating.stars)}{'☆'.repeat(5 - b.rating.stars)}</p>
                  {b.rating.review && <p className="mt-2">{b.rating.review}</p>}
                </div>
              )}

              {b.status === 'Completed' && !b.rating?.stars && (
                <div className="mt-4 space-y-3 rounded-xl bg-slate-50 p-4">
                  <h3 className="font-bold">Rate this session</h3>
                  <label className="block text-sm font-medium">Stars</label>
<div className="flex items-center gap-2" role="group" aria-label="Rate this session">
  {[1, 2, 3, 4, 5].map(star => (
    <button
      key={star}
      type="button"
      onClick={() => updateRating(b.id, 'stars', String(star))}
      aria-label={`${star} star${star > 1 ? 's' : ''}`}
      aria-pressed={Number(ratings[b.id]?.stars ?? 5) === star}
      className={`text-3xl transition-colors ${
        star <= Number(ratings[b.id]?.stars ?? 5)
          ? 'text-amber-400'
          : 'text-slate-300'
      }`}
    >
      ★
    </button>
  ))}
  <span className="text-sm text-slate-600">
    {ratings[b.id]?.stars ?? 5}/5
  </span>
</div>

                  <label className="block text-sm font-medium" htmlFor={`review-${b.id}`}>Review (optional)</label>
                  <textarea id={`review-${b.id}`} maxLength={500} rows={3}
                    value={ratings[b.id]?.review ?? ''}
                    onChange={e => updateRating(b.id, 'review', e.target.value)}
                    placeholder="Share your feedback (up to 500 characters)"
                    className="w-full rounded-lg border bg-white p-3" />

                  <button type="button" disabled={!!busy} onClick={() => submitRating(b.id)}
                    className="rounded-xl bg-blue-700 px-4 py-2 font-semibold text-white disabled:opacity-60">
                    {busy === b.id ? 'Submitting...' : 'Submit rating'}
                  </button>
                </div>
              )}
            </article>
          ))}
        </div>
      )}
    </main>
  )
}

export default Bookings
