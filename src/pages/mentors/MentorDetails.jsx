import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { fetchMentorProfiles } from '../../services/databaseService'

function MentorDetails() {
  const { id } = useParams()
  const [mentor, setMentor] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true

    fetchMentorProfiles()
      .then(items => {
        if (active) {
          setMentor(items.find(item => String(item.id) === id) || null)
        }
      })
      .catch(e => {
        if (active) setError(e.message)
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [id])

  if (loading) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-12">
        Loading mentor profile...
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <Link
        to="/mentors"
        className="text-sm font-semibold text-blue-700 hover:underline"
      >
        ← Back to mentors
      </Link>

      {error ? (
        <p role="alert" className="mt-5 text-red-700">{error}</p>
      ) : !mentor ? (
        <h1 className="mt-5 text-2xl font-bold text-slate-900">
          Mentor not found
        </h1>
      ) : (
        <article className="mt-5 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg">
          <div className="h-2 bg-gradient-to-r from-blue-700 via-indigo-600 to-cyan-400" />

          <div className="p-6 sm:p-10">
            <p className="text-sm font-bold uppercase tracking-widest text-blue-700">
              Mentor Profile
            </p>

            <div className="mt-5 flex flex-col items-center text-center">
              {mentor.profilePhoto ? (
                <img
                  src={mentor.profilePhoto}
                  alt={`${mentor.name}'s profile`}
                  className="h-[88px] w-[88px] rounded-full border-4 border-blue-100 object-cover shadow-md"
                />
              ) : (
                <div
                  className="flex h-24 w-24 items-center justify-center rounded-full bg-blue-100 text-3xl font-bold text-blue-700"
                  aria-label="Mentor profile photo unavailable"
                >
                  {mentor.name?.charAt(0)?.toUpperCase() || 'M'}
                </div>
              )}

              <h1 className="mt-4 text-3xl font-extrabold text-slate-900">
                {mentor.name}
              </h1>

              <p className="mt-2 text-indigo-700">
                {mentor.experience || 0} years experience
              </p>
            </div>

            <section className="mt-8">
              <h2 className="text-lg font-bold text-slate-900">
                About the mentor
              </h2>
              <p className="mt-3 leading-7 text-slate-600">
                {mentor.bio || 'Mentor bio will be added soon.'}
              </p>
            </section>

            <section className="mt-7">
              <h2 className="text-lg font-bold text-slate-900">Skills</h2>

              {mentor.skills?.length ? (
                <div className="mt-3 flex flex-wrap gap-2">
                  {mentor.skills.map(skill => (
                    <span
                      key={skill}
                      className="rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="mt-2 text-sm text-slate-500">
                  Skills will be added soon.
                </p>
              )}
            </section>

            <Link
              to="/mentors"
              className="mt-8 inline-flex rounded-xl bg-blue-700 px-5 py-3 font-bold text-white hover:bg-blue-800"
            >
              Explore available slots
            </Link>
          </div>
        </article>
      )}
    </main>
  )
}

export default MentorDetails

