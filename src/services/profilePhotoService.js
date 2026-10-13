function getProfilePhotoKey(user) {
  if (!user) return null
  return `mentorhub_profile_photo_${encodeURIComponent(user.role)}_${encodeURIComponent(user.name.trim().toLowerCase())}`
}

export function getProfilePhoto(user) {
  try {
    const key = getProfilePhotoKey(user)
    return key ? localStorage.getItem(key) : null
  } catch {
    return null
  }
}

export function saveProfilePhoto(user, photo) {
  const key = getProfilePhotoKey(user)
  if (!key) throw new Error('User not found')
  localStorage.setItem(key, photo)
  window.dispatchEvent(new Event('mentorhub-profile-photo-updated'))
}
