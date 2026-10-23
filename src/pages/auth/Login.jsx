import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { loginRequest } from '../../services/authService'

function Login() {
  const { user, login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (user) {
    return <Navigate to={user.role === 'mentor' ? '/mentor-dashboard' : '/student-dashboard'} replace />
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setLoading(true)

    try {
      const result = await loginRequest({ email, password })
      login(result)
      navigate(result.user.role === 'mentor' ? '/mentor-dashboard' : '/student-dashboard')
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="mx-auto flex min-h-[75vh] max-w-6xl items-center justify-center px-4 py-10 sm:px-6">
      <section className="w-full max-w-xl rounded-3xl bg-white p-6 shadow-xl sm:p-10">
        <p className="font-semibold text-blue-700">WELCOME BACK</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">Login</h1>
        <p className="mt-2 text-slate-600">Login with your registered email and password.</p>

        {error && <p role="alert" className="mt-5 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}

        <form onSubmit={handleSubmit} className="mt-7 space-y-5">
          <div>
            <label htmlFor="login-email" className="mb-2 block text-sm font-semibold text-slate-700">Email</label>
            <input id="login-email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-xl border border-slate-300 px-4 py-3" />
          </div>
          <div>
            <label htmlFor="login-password" className="mb-2 block text-sm font-semibold text-slate-700">Password</label>
            <input id="login-password" type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-xl border border-slate-300 px-4 py-3" />
          </div>
          <button disabled={loading} type="submit" className="w-full rounded-xl bg-blue-700 px-5 py-3 font-bold text-white disabled:opacity-60">
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="mt-6 text-sm text-slate-600">New here? <Link to="/signup" className="font-bold text-blue-700 underline">Create an account</Link></p>
        <p className="mt-3 text-sm text-slate-600">Verification link expired? <Link to="/resend-verification" className="font-bold text-blue-700 underline">Resend verification email</Link></p>
      </section>
    </main>
  )
}

export default Login

