const API_BASE = import.meta.env.VITE_API_URL || ''

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(data.message || 'Request failed. Please try again.')
  }

  return data
}

export function signup({ name, email, password, role }) {
  return request('/api/auth/signup', {
    method: 'POST',
    body: JSON.stringify({ name, email, password, role }),
  })
}

export function loginRequest({ email, password }) {
  return request('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
}

export function getCurrentUser(token) {
  return request('/api/auth/me', {
    headers: { Authorization: `Bearer ${token}` },
  })
}
