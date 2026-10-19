import { Link, useParams } from 'react-router-dom'
import mentors from '../../services/mentorService'

function MentorDetails() {
  const { id } = useParams()
  const mentor = mentors.find(item => String(item.id) === id)

  if (!mentor) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-12">
        <h1 className="text-2xl font-bold text-slate-900">Mentor not found</h1>
        <Link to="/mentors" className="mt-4 inline-block text-blue-700 hover:underline">
          ← Back to mentors
        </Link>
      </main>
    )
  }

  const skills = mentor.skills || []
  const initials = (mentor.name || 'Mentor')
    .split(' ')
    .map(part => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  return (
    <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <Link to="/mentors" className="text-sm font-semibold text-blue-700 hover:underline">
        ← Back to mentors
      </Link>

      <article className="mt-5 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg">
        <div className="h-2 bg-gradient-to-r from-blue-700 via-indigo-600 to-cyan-400" />

        <div className="p-6 sm:p-10">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            {mentor.photo ? (
              <img
                src={mentor.photo}
                alt={`${mentor.name} profile`}
                className="h-24 w-24 rounded-2xl object-cover ring-4 ring-blue-50"
              />
            ) : (
              <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100 text-3xl font-extrabold text-blue-800">
                {initials}
              </div>
            )}

            <div>
              <p className="text-sm font-bold uppercase tracking-widest text-blue-700">
                Mentor Profile
              </p>
              <h1 className="mt-2 text-3xl font-extrabold text-slate-900">
                {mentor.name}
              </h1>
              <p className="mt-2 text-lg font-medium text-indigo-700">
                {mentor.expertise}
              </p>
              <p className="mt-1 text-sm text-slate-500">
                {mentor.experience}
              </p>
            </div>
          </div>

          <section className="mt-8">
            <h2 className="text-lg font-bold text-slate-900">About the mentor</h2>
            <p className="mt-3 leading-7 text-slate-600">
              {mentor.bio || 'Mentor bio will be added soon.'}
            </p>
          </section>

          <section className="mt-7">
            <h2 className="text-lg font-bold text-slate-900">Skills</h2>
            {skills.length > 0 ? (
              <div className="mt-3 flex flex-wrap gap-2">
                {skills.map(skill => (
                  <span key={skill} className="rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <p className="mt-2 text-sm text-slate-500">Skills will be added soon.</p>
            )}
          </section>

          <div className="mt-8 rounded-2xl bg-slate-50 p-5">
            <p className="text-sm text-slate-500">Session option</p>
            <p className="mt-1 text-lg font-bold text-slate-900">
              {mentor.price || 'Contact for details'}
            </p>
            <p className="mt-2 text-sm text-slate-600">
              Check available slots on the Mentors page before booking.
            </p>
            <Link
              to="/mentors"
              className="mt-4 inline-flex rounded-xl bg-blue-700 px-5 py-3 font-bold text-white transition hover:bg-blue-800"
            >
              Explore available slots
            </Link>
          </div>
        </div>
      </article>
    </main>
  )
}

export default MentorDetails
