import { Link } from 'react-router-dom'

function MentorCard({ mentor }) {
  const skills = mentor.skills || []
  const initials = (mentor.name || 'Mentor')
    .split(' ')
    .map(part => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  return (
    <article className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="h-1.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-400" />

      <div className="p-5">
        <div className="flex items-start gap-3">
          {mentor.photo ? (
            <img
              src={mentor.photo}
              alt={`${mentor.name} profile`}
              className="h-16 w-16 shrink-0 rounded-xl object-cover ring-2 ring-blue-50"
            />
          ) : (
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100 text-lg font-extrabold text-blue-800">
              {initials}
            </div>
          )}

          <div className="min-w-0 flex-1">
            <h2 className="truncate text-lg font-bold text-slate-900">
              {mentor.name}
            </h2>
            <p className="mt-1 text-sm font-medium text-blue-700">
              {mentor.expertise}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              {mentor.experience}
            </p>
          </div>
        </div>

        <p className="mt-4 text-sm leading-6 text-slate-600">
          {mentor.bio}
        </p>

        {skills.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {skills.slice(0, 4).map(skill => (
              <span
                key={skill}
                className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700"
              >
                {skill}
              </span>
            ))}
          </div>
        )}

        <div className="mt-5 flex items-center justify-between gap-3 border-t border-slate-100 pt-4">
          <span className="text-sm font-bold text-slate-800">
            {mentor.price || 'Contact for details'}
          </span>

          <Link
            to={`/mentors/${mentor.id}`}
            className="inline-flex items-center gap-1 rounded-lg bg-blue-700 px-3 py-2 text-sm font-bold text-white transition hover:bg-blue-800"
          >
            View Profile <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </article>
  )
}

export default MentorCard
