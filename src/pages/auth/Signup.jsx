import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

function Signup() {
  const { user, login } = useAuth()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [role, setRole] = useState('student')

  if (user) {
    return (
      <Navigate
        to={user.role === 'mentor' ? '/mentor-dashboard' : '/student-dashboard'}
        replace
      />
    )
  }

  function handleSubmit(event) {
    event.preventDefault()
    if (!name.trim()) return
    login(name, role)
    navigate(role === 'mentor' ? '/mentor-dashboard' : '/student-dashboard')
  }

  return (
    <main className="mx-auto flex min-h-[75vh] max-w-6xl items-center justify-center px-4 py-10 sm:px-6">
      <section className="w-full max-w-xl rounded-3xl bg-white p-6 shadow-xl sm:p-10">
        <p className="font-semibold text-blue-700">JOIN MENTORHUB</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">Create your account</h1>
        <p className="mt-2 leading-6 text-slate-600">Choose how you want to use the platform.</p>

        <form onSubmit={handleSubmit} className="mt-7 space-y-5">
          <div>
            <label htmlFor="signup-name" className="mb-2 block text-sm font-semibold text-slate-700">Full name</label>
            <input id="signup-name" required value={name} onChange={(event) => setName(event.target.value)} placeholder="Enter your name" className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100" />
          </div>

          <fieldset>
            <legend className="mb-3 text-sm font-semibold text-slate-700">I want to join as</legend>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className={`cursor-pointer rounded-2xl border p-4 ${role === 'student' ? 'border-blue-600 bg-blue-50 ring-1 ring-blue-600' : 'border-slate-200'}`}>
                <input type="radio" name="role" value="student" checked={role === 'student'} onChange={() => setRole('student')} className="mr-2 accent-blue-700" />
                <span className="font-bold text-slate-900">Student</span>
                <p className="mt-2 text-sm text-slate-600">Find mentors and manage sessions.</p>
              </label>
              <label className={`cursor-pointer rounded-2xl border p-4 ${role === 'mentor' ? 'border-teal-600 bg-teal-50 ring-1 ring-teal-600' : 'border-slate-200'}`}>
                <input type="radio" name="role" value="mentor" checked={role === 'mentor'} onChange={() => setRole('mentor')} className="mr-2 accent-teal-700" />
                <span className="font-bold text-slate-900">Mentor</span>
                <p className="mt-2 text-sm text-slate-600">Create slots and manage sessions.</p>
              </label>
            </div>
          </fieldset>

          <button type="submit" className="w-full rounded-xl bg-blue-700 px-5 py-3 font-bold text-white transition hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2">
            Create demo account
          </button>
        </form>

        <p className="mt-6 text-sm text-slate-600">
          Already joined? <Link to="/login" className="font-bold text-blue-700 underline">Login</Link>
        </p>
        <p className="mt-5 rounded-xl bg-amber-50 p-3 text-xs leading-5 text-amber-900">
          Demo only: account details are not verified or registered with a server.
        </p>
      </section>
    </main>
  )
}

export default Signup
