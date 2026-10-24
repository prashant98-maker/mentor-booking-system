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
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-md">
      <div className="h-1.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-400" />

      <div className="p-5">
        <div className="flex items-center gap-4">
          <div className="shrink-0 rounded-full bg-gradient-to-br from-blue-600 via-indigo-500 to-cyan-400 p-[3px] shadow-md">
            <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border-2 border-white bg-gradient-to-br from-blue-100 to-indigo-100 text-lg font-extrabold text-blue-800">
              {mentor.profilePhoto ? (
                <img
                  src={mentor.profilePhoto}
                  alt={`${mentor.name}'s profile`}
                  className="h-full w-full rounded-full object-cover"
                />
              ) : (
                initials
              )}
            </div>
          </div>

          <div className="min-w-0 flex-1">
            <h2 className="break-words text-lg font-bold text-slate-900">
              {mentor.name}
            </h2>

            <span className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-500" />
              {mentor.experience || 0} years experience
            </span>
          </div>
        </div>

        <p className="mt-5 text-sm leading-6 text-slate-600">
          {mentor.bio || 'This mentor has not added a bio yet.'}
        </p>

        {skills.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {skills.slice(0, 4).map(skill => (
              <span
                key={skill}
                className="rounded-full border border-blue-100 bg-blue-50/80 px-3 py-1.5 text-xs font-semibold text-blue-700"
              >
                {skill}
              </span>
            ))}
          </div>
        )}

        <div className="mt-5 border-t border-slate-100 pt-4">
          <Link
            to={`/mentors/${mentor.id}`}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-700 to-indigo-700 px-4 py-2.5 text-sm font-bold text-white shadow-sm hover:from-blue-800 hover:to-indigo-800"
          >
            View Profile <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </article>
  )
}

export default MentorCard