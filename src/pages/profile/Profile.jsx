import MentorProfileEditor from './MentorProfileEditor'
import { useRef, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { getProfilePhoto, saveProfilePhoto } from '../../services/profilePhotoService'

function Profile() {
  const { user } = useAuth()
  const fileInputRef = useRef(null)
  const [photo, setPhoto] = useState(() => getProfilePhoto(user))
  const [message, setMessage] = useState('')
  const [saving, setSaving] = useState(false)

  if (!user) {
    return <Navigate to="/login" replace />
  }

  const isMentor = user.role === 'mentor'
  const initial = user.name?.trim()?.charAt(0)?.toUpperCase() || '?'

  async function handlePhotoChange(event) {
    const file = event.target.files?.[0]
    event.target.value = ''

    if (!file) return

    if (!file.type.startsWith('image/')) {
      setMessage('Please choose an image file.')
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      setMessage('Image size must be 10 MB or less.')
      return
    }

    setSaving(true)
    setMessage('')

    try {
      const dataUrl = await new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result)
        reader.onerror = () => reject(new Error('Could not read the image.'))
        reader.readAsDataURL(file)
      })

      const image = await new Promise((resolve, reject) => {
        const img = new Image()
        img.onload = () => resolve(img)
        img.onerror = () => reject(new Error('Could not open this image.'))
        img.src = dataUrl
      })

      const canvas = document.createElement('canvas')
      const maxSide = 480
      const scale = Math.min(1, maxSide / Math.max(image.width, image.height))
      canvas.width = Math.max(1, Math.round(image.width * scale))
      canvas.height = Math.max(1, Math.round(image.height * scale))

      const context = canvas.getContext('2d')
      if (!context) throw new Error('Image processing is not supported.')

      context.drawImage(image, 0, 0, canvas.width, canvas.height)
      const compressedPhoto = canvas.toDataURL('image/jpeg', 0.82)

      saveProfilePhoto(user, compressedPhoto)
      setPhoto(compressedPhoto)
      setMessage('Profile photo saved successfully!')
    } catch (error) {
      setMessage(error.message || 'Could not save the photo. Please try another image.')
    } finally {
      setSaving(false)
    }
  }

  function removePhoto() {
    try {
      const key = `mentorhub_profile_photo_${encodeURIComponent(user.role)}_${encodeURIComponent(user.name.trim().toLowerCase())}`
      localStorage.removeItem(key)
      window.dispatchEvent(new Event('mentorhub-profile-photo-updated'))
      setPhoto(null)
      setMessage('Profile photo removed.')
    } catch {
      setMessage('Could not remove the photo.')
    }
  }

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg shadow-slate-200/60">
        <div className="bg-gradient-to-r from-blue-800 via-indigo-700 to-violet-700 px-5 py-8 text-white sm:px-8 sm:py-10">
          <p className="text-sm font-bold uppercase tracking-widest text-blue-100">
            Account settings
          </p>
          <h1 className="mt-2 break-words text-3xl font-extrabold sm:text-4xl">
            My Profile
          </h1>
          <p className="mt-3 max-w-2xl leading-7 text-blue-100">
            Personalise your MentorHub profile with your own photo.
          </p>
        </div>

        <div className="grid gap-8 p-5 sm:p-8 md:grid-cols-[220px_minmax(0,1fr)]">
          <aside className="flex flex-col items-center rounded-2xl border border-slate-200 bg-slate-50 p-5 text-center">
            <div className="flex h-36 w-36 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-blue-100 text-5xl font-extrabold text-blue-800 shadow-lg ring-2 ring-blue-100">
              {photo ? (
                <img
                  src={photo}
                  alt={`${user.name}'s profile`}
                  className="h-full w-full object-cover"
                />
              ) : (
                initial
              )}
            </div>

            <h2 className="mt-4 max-w-full break-words text-lg font-bold text-slate-900">
              {user.name}
            </h2>
            <span className="mt-2 rounded-full bg-blue-100 px-3 py-1 text-xs font-bold capitalize text-blue-800">
              {user.role}
            </span>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={saving}
              className="mt-5 inline-flex min-h-11 w-full items-center justify-center rounded-xl bg-blue-700 px-4 py-3 text-sm font-bold text-white transition hover:bg-blue-800 disabled:cursor-wait disabled:opacity-60"
            >
              {saving ? 'Saving photo...' : photo ? 'Change photo' : 'Upload photo'}
            </button>

            {photo && (
              <button
                type="button"
                onClick={removePhoto}
                disabled={saving}
                className="mt-2 min-h-10 w-full rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-white disabled:opacity-60"
              >
                Remove photo
              </button>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handlePhotoChange}
            />

            <p className="mt-3 text-xs leading-5 text-slate-500">
              Choose a photo from your device. Images up to 10 MB are accepted.
            </p>
            {message && (
              <p role="status" className="mt-3 break-words text-sm font-semibold text-blue-800">
                {message}
              </p>
            )}
          </aside>

          <div className="min-w-0">
            <div className="mb-5">
              <h2 className="text-xl font-extrabold text-slate-900">Account details</h2>
              <p className="mt-1 text-sm leading-6 text-slate-500">
                Your current MentorHub demo account information.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 p-5">
                <p className="text-sm font-semibold text-slate-500">Full name</p>
                <p className="mt-2 break-words text-lg font-bold text-slate-900">
                  {user.name}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 p-5">
                <p className="text-sm font-semibold text-slate-500">Account role</p>
                <p className="mt-2 text-lg font-bold capitalize text-slate-900">
                  {user.role}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 p-5 sm:col-span-2">
                <p className="text-sm font-semibold text-slate-500">Profile photo</p>
                <p className="mt-2 text-sm leading-6 text-slate-700">
                  {photo
                    ? 'Your photo is saved in this browser and appears in the navigation bar.'
                    : 'You have not uploaded a photo yet. Upload one to personalise your profile.'}
                </p>
              </div>
            </div>

            <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">
              This is a demo profile. Your photo is stored locally in this browser, not on a server, so it will not automatically appear on another device or browser.
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to={isMentor ? '/mentor-dashboard' : '/student-dashboard'}
                className="inline-flex min-h-11 items-center justify-center rounded-xl bg-blue-700 px-5 py-3 font-semibold text-white hover:bg-blue-800"
              >
                Open my dashboard
              </Link>
              {!isMentor && (
                <Link
                  to="/mentors"
                  className="inline-flex min-h-11 items-center justify-center rounded-xl border border-slate-300 px-5 py-3 font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Find mentors
                </Link>
              )}
            </div>
          </div>
        
      <MentorProfileEditor user={user} />
    </div>
      </section>
    </main>
  )
}

export default Profile

