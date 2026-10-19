import { Link } from 'react-router-dom'

function MentorCard({ mentor }) {
  const skills = mentor.skills || []
  const initials = (mentor.name || 'Mentor')
    .split(' ').map(part => part[0]).slice(0, 2).join('').toUpperCase()

  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <div className="h-1.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-400" />
      <div className="p-5">
        <div className="flex items-start gap-3">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100 text-lg font-extrabold text-blue-800">{initials}</div>
          <div className="min-w-0 flex-1">
            <h2 className="break-words text-lg font-bold text-slate-900">{mentor.name}</h2>
            <p className="mt-1 text-sm font-medium text-blue-700">{mentor.experience || 0} years experience</p>
          </div>
        </div>
        <p className="mt-4 text-sm leading-6 text-slate-600">{mentor.bio || 'This mentor has not added a bio yet.'}</p>
        {skills.length > 0 && <div className="mt-4 flex flex-wrap gap-2">{skills.slice(0, 4).map(skill => <span key={skill} className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">{skill}</span>)}</div>}
        <div className="mt-5 border-t border-slate-100 pt-4">
          <Link to={`/mentors/${mentor.id}`} className="inline-flex rounded-lg bg-blue-700 px-3 py-2 text-sm font-bold text-white hover:bg-blue-800">View Profile →</Link>
        </div>
      </div>
    </article>
  )
}

export default MentorCard
