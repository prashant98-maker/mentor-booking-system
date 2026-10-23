import { useState } from 'react'
import { Link } from 'react-router-dom'
import { resendVerification } from '../../services/authService'

function ResendVerification() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setMessage('')
    setError('')
    setLoading(true)

    try {
      const result = await resendVerification(email.trim())
      setMessage(result.message || 'If an unverified account exists, a new verification link will be sent.')
    } catch (err) {
      setError(err.message || 'Unable to request a new link. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="mx-auto flex min-h-[75vh] max-w-6xl items-center justify-center px-4 py-10 sm:px-6">
      <section className="w-full max-w-xl rounded-3xl bg-white p-6 shadow-xl sm:p-10">
        <p className="font-semibold text-blue-700">EMAIL VERIFICATION</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">Resend verification email</h1>
        <p className="mt-2 text-slate-600">
          Enter your signup email. If your account needs verification, a new link will be sent.
          The link is valid for 30 minutes.
        </p>

        {message && <p role="status" className="mt-5 rounded-xl bg-green-50 p-3 text-sm text-green-700">{message}</p>}
        {error && <p role="alert" className="mt-5 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}

        <form onSubmit={handleSubmit} className="mt-7 space-y-5">
          <div>
            <label htmlFor="resend-email" className="mb-2 block text-sm font-semibold text-slate-700">Email</label>
            <input
              id="resend-email"
              type="email"
              autoComplete="email"
              maxLength={254}
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-xl border border-slate-300 px-4 py-3"
            />
          </div>
          <button
            disabled={loading}
            type="submit"
            className="w-full rounded-xl bg-blue-700 px-5 py-3 font-bold text-white disabled:opacity-60"
          >
            {loading ? 'Sending request...' : 'Send new verification link'}
          </button>
        </form>

        <p className="mt-6 text-sm text-slate-600">
          Already verified? <Link to="/login" className="font-bold text-blue-700 underline">Log in</Link>
        </p>
      </section>
    </main>
  )
}

export default ResendVerification
