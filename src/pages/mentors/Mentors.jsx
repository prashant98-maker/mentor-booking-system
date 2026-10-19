import { useCallback, useEffect, useState } from 'react'
import { fetchSlots, createBooking, fetchMentorProfiles } from '../../services/databaseService'
import MentorCard from '../../components/MentorCard'

function Mentors() {
  const [slots, setSlots] = useState([])
  const [mentors, setMentors] = useState([])
  const [loading, setLoading] = useState(true)
  const [mentorsLoading, setMentorsLoading] = useState(true)
  const [error, setError] = useState('')
  const [mentorError, setMentorError] = useState('')
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const data = await fetchSlots()
      setSlots(data.filter(s => s.available && s.date >= new Date().toLocaleDateString('en-CA')))
      setError('')
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [])

  const loadMentors = useCallback(async () => {
    setMentorsLoading(true)
    try {
      setMentors(await fetchMentorProfiles())
      setMentorError('')
    } catch (e) {
      setMentorError(e.message)
    } finally {
      setMentorsLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
    void loadMentors()
  }, [load, loadMentors])

  async function book(slot) {
    setBusy(slot.id)
    setError('')
    setMessage('')
    try {
      await createBooking(slot.id)
      setMessage('Booking successfully saved.')
      await load()
    } catch (e) {
      setError(e.message)
    } finally {
      setBusy('')
    }
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <header className="rounded-3xl bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-900 p-6 text-white sm:p-8">
        <p className="font-semibold tracking-widest text-cyan-300">MENTORHUB</p>
        <h1 className="mt-2 text-3xl font-bold">Find Your Mentor</h1>
        <p className="mt-3 text-slate-200">Explore real mentor profiles and book an available session.</p>
      </header>

      {message && <p role="status" className="mt-5 rounded-xl bg-green-50 p-4 text-green-800">{message}</p>}
      {error && <p role="alert" className="mt-5 rounded-xl bg-red-50 p-4 text-red-700">{error}</p>}

      <section className="mt-10">
        <p className="text-sm font-bold uppercase tracking-widest text-blue-700">Meet the mentors</p>
        <h2 className="mt-2 text-2xl font-extrabold text-slate-900">Learn from experienced guides</h2>

        {mentorError && <p role="alert" className="mt-4 rounded-xl bg-amber-50 p-4 text-amber-900">{mentorError}</p>}
        {mentorsLoading ? (
          <p className="mt-5">Loading mentor profiles...</p>
        ) : mentors.length === 0 ? (
          <p className="mt-5 rounded-xl border border-slate-200 bg-white p-5 text-slate-600">No mentor profiles have been added yet.</p>
        ) : (
          <>
            <p className="mt-2 text-sm text-slate-500">{mentors.length} mentor profiles</p>
            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {mentors.map(mentor => <MentorCard key={mentor.id} mentor={mentor} />)}
            </div>
          </>
        )}
      </section>

      <section className="mt-12">
        <p className="text-sm font-bold uppercase tracking-widest text-indigo-700">Book a session</p>
        <h2 className="mt-2 text-2xl font-extrabold text-slate-900">Available Mentor Slots</h2>
        <p className="mt-2 text-slate-600">Choose from available future slots stored in the database.</p>

        {loading ? <p className="mt-6">Loading available slots...</p> : slots.length === 0 ? (
          <p className="mt-5 rounded-2xl border border-slate-200 bg-white p-6 text-slate-600">No available future slots. Please check again later.</p>
        ) : (
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {slots.map(slot => (
              <article key={slot.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900">{slot.mentorName}</h3>
                <p className="mt-3 text-slate-700">{slot.date}</p>
                <p className="mt-1 text-slate-600">{slot.time}</p>
                <button disabled={!!busy} onClick={() => book(slot)} className="mt-5 rounded-xl bg-blue-700 px-5 py-3 font-bold text-white disabled:opacity-60">
                  {busy === slot.id ? 'Booking...' : 'Book this slot'}
                </button>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}

export default Mentors
