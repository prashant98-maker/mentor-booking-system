function MentorCard({ mentor }) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <div className="flex items-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-xl font-bold text-blue-700">
          {mentor.name.charAt(0)}
        </div>

        <div>
          <h2 className="text-lg font-bold text-slate-900">
            {mentor.name}
          </h2>
          <p className="text-sm text-blue-600">{mentor.expertise}</p>
        </div>
      </div>

      <p className="mt-4 text-sm leading-6 text-slate-600">
        {mentor.bio}
      </p>

      <div className="mt-5 flex items-center justify-between">
        <span className="text-sm text-slate-500">{mentor.experience}</span>
        <span className="font-bold text-slate-900">
          {mentor.price}
        </span>
      </div>
    </article>
  )
}

export default MentorCard
