import { Link } from 'react-router-dom'

function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="mt-auto bg-slate-950 text-slate-300">
      <div className="mx-auto max-w-7xl px-6 py-12 sm:px-8 lg:px-10">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">

          {/* Brand */}
          <div>
            <Link to="/" className="inline-flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-500 text-xl font-extrabold text-white shadow-lg shadow-indigo-500/20">
                M
              </span>
              <span className="text-2xl font-extrabold tracking-tight text-white">
                Mentor<span className="text-indigo-400">Hub</span>
              </span>
            </Link>

            <p className="mt-5 max-w-xs text-sm leading-7 text-slate-400">
              Learn from experienced mentors, discover new opportunities, and
              take the next step in your learning journey.
            </p>

            <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-slate-800 px-3 py-2 text-xs text-slate-400">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              Learn. Grow. Succeed.
            </div>
          </div>

          {/* Explore */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-white">
              Explore
            </h3>
            <ul className="mt-5 space-y-3 text-sm">
              <li>
                <Link to="/" className="transition hover:text-indigo-300">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/mentors" className="transition hover:text-indigo-300">
                  Find Mentors
                </Link>
              </li>
              <li>
                <Link to="/bookings" className="transition hover:text-indigo-300">
                  My Bookings
                </Link>
              </li>
            </ul>
          </div>

          {/* Community */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-white">
              Community
            </h3>
            <ul className="mt-5 space-y-3 text-sm">
              <li>
                <Link to="/signup" className="transition hover:text-indigo-300">
                  Join MentorHub
                </Link>
              </li>
              <li>
                <Link to="/login" className="transition hover:text-indigo-300">
                  Sign In
                </Link>
              </li>
              <li>
                <Link to="/profile" className="transition hover:text-indigo-300">
                  My Profile
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact / Mission */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-white">
              Our Mission
            </h3>
            <p className="mt-5 text-sm leading-7 text-slate-400">
              Connecting learners with guidance that helps turn goals into
              progress.
            </p>

            <Link
              to="/mentors"
              className="mt-5 inline-flex items-center gap-2 rounded-lg bg-indigo-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-400"
            >
              Find Your Mentor
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col gap-4 border-t border-slate-800 pt-6 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left">
          <p className="text-xs leading-5 text-slate-500">
            © {currentYear} MentorHub. All rights reserved.
          </p>

          <p className="text-xs text-slate-500">
            Built for learners. Designed for growth.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
