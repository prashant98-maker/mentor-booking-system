import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { verifyEmail } from '../../services/authService'

// Reuse an in-flight request when React runs the effect again.
const verificationRequests = new Map()

function getVerificationRequest(token) {
  if (!verificationRequests.has(token)) {
    const request = verifyEmail(token).finally(() => {
      if (verificationRequests.get(token) === request) {
        verificationRequests.delete(token)
      }
    })

    verificationRequests.set(token, request)
  }

  return verificationRequests.get(token)
}

function VerifyEmail() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  const [status, setStatus] = useState('loading')
  const [message, setMessage] = useState('Verifying your email...')

  useEffect(() => {
    let active = true

    if (!token) {
      setStatus('error')
      setMessage('The verification link is missing its token.')
      return () => {
        active = false
      }
    }

    getVerificationRequest(token)
      .then((result) => {
        if (!active) return
        setStatus('success')
        setMessage(
          result.message ||
            'Email verified successfully. You can now log in.',
        )
      })
      .catch((error) => {
        if (!active) return
        setStatus('error')
        setMessage(
          error.message ||
            'Verification failed. The link may be invalid or expired.',
        )
      })

    return () => {
      active = false
    }
  }, [token])

  const messageClass =
    status === 'success'
      ? 'bg-green-50 text-green-800'
      : status === 'error'
        ? 'bg-red-50 text-red-700'
        : 'bg-blue-50 text-blue-800'

  return (
    <main className="mx-auto flex min-h-[75vh] max-w-6xl items-center justify-center px-4 py-10 sm:px-6">
      <section className="w-full max-w-xl rounded-3xl bg-white p-6 text-center shadow-xl sm:p-10">
        <p className="font-semibold text-blue-700">MENTORHUB</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">
          Email verification
        </h1>

        <p
          role="status"
          aria-live="polite"
          className={`mt-6 rounded-xl p-4 text-sm ${messageClass}`}
        >
          {message}
        </p>

        {status !== 'loading' && (
          <Link
            to="/login"
            className="mt-6 inline-block rounded-xl bg-blue-700 px-5 py-3 font-bold text-white"
          >
            Go to Login
          </Link>
        )}
      </section>
    </main>
  )
}

export default VerifyEmail