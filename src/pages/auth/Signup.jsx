import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { signup } from '../../services/authService'

function Signup() {
  const { user, login } = useAuth()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('student')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (user) {
    return <Navigate to={user.role === 'mentor' ? '/mentor-dashboard' : '/student-dashboard'} replace />
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')

    if (password.length < 8 || password.length > 72) {
      setError('Password must be between 8 and 72 characters.')
      return
    }

    setLoading(true)
    try {
      const result = await signup({ name, email, password, role })
      login(result)
      navigate(result.user.role === 'mentor' ? '/mentor-dashboard' : '/student-dashboard')
    } catch (err) {
      setError(err.message || 'Signup failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="mx-auto flex min-h-[75vh] max-w-6xl items-center justify-center px-4 py-10 sm:px-6">
      <section className="w-full max-w-xl rounded-3xl bg-white p-6 shadow-xl sm:p-10">
        <p className="font-semibold text-blue-700">JOIN MENTORHUB</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">Create your account</h1>
        <p className="mt-2 text-slate-600">Register as a student or mentor.</p>

        {error && <p role="alert" className="mt-5 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}

        <form onSubmit={handleSubmit} className="mt-7 space-y-5">
          <div>
            <label htmlFor="signup-name" className="mb-2 block text-sm font-semibold text-slate-700">Full name</label>
            <input id="signup-name" autoComplete="name" minLength={2} maxLength={80} required value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-xl border border-slate-300 px-4 py-3" />
          </div>
          <div>
            <label htmlFor="signup-email" className="mb-2 block text-sm font-semibold text-slate-700">Email</label>
            <input id="signup-email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-xl border border-slate-300 px-4 py-3" />
          </div>
          <div>
            <label htmlFor="signup-password" className="mb-2 block text-sm font-semibold text-slate-700">Password (8–72 characters)</label>
            <input id="signup-password" type="password" autoComplete="new-password" minLength={8} maxLength={72} required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-xl border border-slate-300 px-4 py-3" />
          </div>
          <fieldset>
            <legend className="mb-3 text-sm font-semibold text-slate-700">Join as</legend>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="rounded-xl border border-slate-200 p-4">
                <input type="radio" name="role" value="student" checked={role === 'student'} onChange={() => setRole('student')} className="mr-2" />
                Student
              </label>
              <label className="rounded-xl border border-slate-200 p-4">
                <input type="radio" name="role" value="mentor" checked={role === 'mentor'} onChange={() => setRole('mentor')} className="mr-2" />
                Mentor
              </label>
            </div>
          </fieldset>
          <button disabled={loading} type="submit" className="w-full rounded-xl bg-blue-700 px-5 py-3 font-bold text-white disabled:opacity-60">
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        <p className="mt-6 text-sm text-slate-600">Already registered? <Link to="/login" className="font-bold text-blue-700 underline">Login</Link></p>
      </section>
    </main>
  )
}

export default Signup
