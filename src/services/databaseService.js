const TOKEN_KEY = 'mentorhub_token'
const API_BASE = import.meta.env.VITE_API_URL || 'https://mentor-booking-system-prashant.onrender.com'

async function api(path, options = {}) {
  const token = localStorage.getItem(TOKEN_KEY)
  const response = await fetch(`${API_BASE}/api${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  })
  const data = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(data.message || 'API request failed.')
  return data
}

export async function fetchSlots() {
  return (await api('/slots')).slots
}

export async function createSlot({ date, time }) {
  return (await api('/slots', { method: 'POST', body: JSON.stringify({ date, time }) })).slot
}

export async function fetchBookings() {
  return (await api('/bookings')).bookings
}

export async function createBooking(slotId) {
  return api('/bookings', { method: 'POST', body: JSON.stringify({ slotId }) })
}

export async function updateBookingStatus(id, status) {
  return api(`/bookings/${encodeURIComponent(id)}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  })
}

export async function cancelMyBooking(id) {
  return api(`/bookings/${encodeURIComponent(id)}/cancel`, { method: 'PATCH' })
}


export async function fetchMentorProfiles() {
  const response = await fetch(`${API_BASE}/api/mentors`)
  const data = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(data.message || 'Could not load mentor profiles.')
  return data.mentors || []
}

export async function fetchMyMentorProfile() {
  return (await api('/mentors/me')).profile
}

export async function saveMyMentorProfile(profile) {
  return (await api('/mentors/me', {
    method: 'PUT',
    body: JSON.stringify(profile),
  })).profile
}
