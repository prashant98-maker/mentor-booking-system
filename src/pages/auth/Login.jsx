import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

function Login() {
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
    login(name, role)
    navigate(role === 'mentor' ? '/mentor-dashboard' : '/student-dashboard')
  }

  return (
    <main className="mx-auto flex min-h-[75vh] max-w-6xl items-center justify-center px-4 py-10 sm:px-6">
      <section className="grid w-full max-w-4xl overflow-hidden rounded-3xl bg-white shadow-xl md:grid-cols-2">
        <div className="hidden flex-col justify-between bg-gradient-to-br from-blue-700 to-indigo-900 p-10 text-white md:flex">
          <p className="text-sm font-bold tracking-widest">MENTORHUB</p>
          <div>
            <h1 className="text-4xl font-bold leading-tight">Your next step starts with the right guidance.</h1>
            <p className="mt-4 leading-7 text-blue-100">Connect with mentors, plan sessions and keep your learning journey organised.</p>
          </div>
          <p className="text-sm text-blue-100">Learn. Grow. Succeed.</p>
        </div>

        <div className="p-6 sm:p-10">
          <p className="font-semibold text-blue-700">WELCOME BACK</p>
          <h2 className="mt-2 text-3xl font-bold text-slate-900">Login</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Choose your demo role to preview the correct dashboard.
          </p>

          <form onSubmit={handleSubmit} className="mt-7 space-y-5">
            <div>
              <label htmlFor="login-name" className="mb-2 block text-sm font-semibold text-slate-700">Your name</label>
              <input id="login-name" value={name} onChange={(event) => setName(event.target.value)} placeholder="Enter your name" className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100" />
            </div>

            <div>
              <label htmlFor="login-role" className="mb-2 block text-sm font-semibold text-slate-700">Login as</label>
              <select id="login-role" value={role} onChange={(event) => setRole(event.target.value)} className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100">
                <option value="student">Student</option>
                <option value="mentor">Mentor</option>
              </select>
            </div>

            <button type="submit" className="w-full rounded-xl bg-blue-700 px-5 py-3 font-bold text-white transition hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2">
              Continue to dashboard
            </button>
          </form>

          <p className="mt-6 text-sm text-slate-600">
            New here? <Link to="/signup" className="font-bold text-blue-700 underline">Create an account</Link>
          </p>

          <p className="mt-5 rounded-xl bg-amber-50 p-3 text-xs leading-5 text-amber-900">
            Frontend demo only: this page does not verify passwords or create a secure account yet.
          </p>
        </div>
      </section>
    </main>
  )
}

export default Login
