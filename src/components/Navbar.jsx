import { useEffect, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getProfilePhoto } from '../services/profilePhotoService'

const linkClass = ({ isActive }) =>
  `rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
    isActive
      ? 'bg-blue-50 text-blue-700'
      : 'text-slate-600 hover:bg-slate-100 hover:text-blue-700'
  }`

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { user, logout } = useAuth()
  const [profilePhoto, setProfilePhoto] = useState(() => getProfilePhoto(user))
  const navigate = useNavigate()

  useEffect(() => {
    const updatePhoto = () => setProfilePhoto(getProfilePhoto(user))
    window.addEventListener('mentorhub-profile-photo-updated', updatePhoto)

    return () => {
      window.removeEventListener('mentorhub-profile-photo-updated', updatePhoto)
    }
  }, [user])

  function handleLogout() {
    logout()
    setMenuOpen(false)
    navigate('/login')
  }

  const commonLinks = [{ to: '/', label: 'Home' }]

  const roleLinks = !user
    ? [{ to: '/mentors', label: 'Mentors' }]
    : user.role === 'mentor'
      ? [
          { to: '/mentor-dashboard', label: 'Mentor Dashboard' },
          { to: '/mentor-availability', label: 'Availability' },
          { to: '/mentor-sessions', label: 'My Sessions' },
          { to: '/profile', label: 'My Profile' },
        ]
      : [
          { to: '/student-dashboard', label: 'My Dashboard' },
          { to: '/mentors', label: 'Find Mentors' },
          { to: '/bookings', label: 'My Bookings' },
          { to: '/profile', label: 'My Profile' },
        ]

  const links = [...commonLinks, ...roleLinks]
  const initial = user?.name?.trim()?.charAt(0)?.toUpperCase() || '?'

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur-md">
      <nav className="mx-auto flex min-h-16 w-full max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <Link
          to="/"
          onClick={() => setMenuOpen(false)}
          className="shrink-0 text-xl font-extrabold tracking-tight text-blue-800 sm:text-2xl"
        >
          MentorHub<span className="text-teal-600">.</span>
        </Link>

        <button
          type="button"
          className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-xl border border-slate-200 text-2xl text-slate-700 hover:bg-slate-50 md:hidden"
          aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? '×' : '☰'}
        </button>

        <div className={`${menuOpen ? 'flex' : 'hidden'} w-full min-w-0 flex-col gap-1 border-t border-slate-100 pt-3 md:flex md:w-auto md:flex-row md:flex-wrap md:items-center md:justify-end md:gap-1 md:border-0 md:pt-0`}>
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end
              className={linkClass}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </NavLink>
          ))}

          {user ? (
            <div className="mt-2 flex flex-col gap-2 border-t border-slate-200 pt-3 md:ml-2 md:mt-0 md:flex-row md:items-center md:border-l md:border-t-0 md:pl-3 md:pt-0">
              <Link
                to="/profile"
                onClick={() => setMenuOpen(false)}
                className="flex min-h-11 items-center gap-2 rounded-xl px-2 py-1 hover:bg-slate-50"
                aria-label="Open my profile"
              >
                {profilePhoto ? (
                  <img
                    src={profilePhoto}
                    alt="My profile"
                    className="h-9 w-9 rounded-full border-2 border-blue-100 object-cover"
                  />
                ) : (
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-800">
                    {initial}
                  </span>
                )}
                <span className="max-w-40 break-words text-sm font-semibold text-slate-700">
                  Hi, {user.name}
                </span>
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="min-h-11 rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="mt-2 flex flex-col gap-2 border-t border-slate-200 pt-3 sm:flex-row md:ml-2 md:mt-0 md:border-l md:border-t-0 md:pl-3 md:pt-0">
              <NavLink to="/login" end className={linkClass} onClick={() => setMenuOpen(false)}>
                Login
              </NavLink>
              <Link
                to="/signup"
                onClick={() => setMenuOpen(false)}
                className="inline-flex min-h-11 items-center justify-center rounded-xl bg-blue-700 px-4 py-2 text-sm font-bold text-white hover:bg-blue-800"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </nav>
    </header>
  )
}

export default Navbar
