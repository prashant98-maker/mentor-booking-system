import { useEffect, useState } from 'react'
import { fetchMyMentorProfile, saveMyMentorProfile } from '../../services/databaseService'

export default function MentorProfileEditor({ user }) {
  const [bio, setBio] = useState('')
  const [experience, setExperience] = useState('0')
  const [skillsText, setSkillsText] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState(false)

  useEffect(() => {
    if (user?.role !== 'mentor') {
      setLoading(false)
      return
    }

    let active = true

    fetchMyMentorProfile()
      .then((profile) => {
        if (!active) return
        setBio(profile.bio || '')
        setExperience(String(profile.experience ?? 0))
        setSkillsText((profile.skills || []).join(', '))
      })
      .catch((err) => {
        if (active) {
          setError(true)
          setMessage(err.message || 'Profile load nahi ho payi.')
        }
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [user])

  if (user?.role !== 'mentor') return null

  async function handleSubmit(event) {
    event.preventDefault()
    setMessage('')
    setError(false)

    const years = Number(experience)
    const skills = skillsText
      .split(',')
      .map((skill) => skill.trim())
      .filter(Boolean)

    if (!Number.isInteger(years) || years < 0 || years > 60) {
      setError(true)
      setMessage('Experience 0 se 60 saal ke beech poore number mein likho.')
      return
    }

    if (bio.trim().length > 1000 || skills.length > 20 ||
        skills.some((skill) => skill.length > 50)) {
      setError(true)
      setMessage('Bio max 1000 characters aur skills max 20 (har skill 50 characters tak) rakho.')
      return
    }

    setSaving(true)
    try {
      const profile = await saveMyMentorProfile({
        bio: bio.trim(),
        experience: years,
        skills,
      })
      setBio(profile.bio || '')
      setExperience(String(profile.experience ?? 0))
      setSkillsText((profile.skills || []).join(', '))
      setMessage('Mentor profile successfully save ho gayi.')
    } catch (err) {
      setError(true)
      setMessage(err.message || 'Profile save nahi ho payi. Dobara try karo.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <section className="mentor-profile-editor" style={{
      marginTop: '24px',
      padding: '20px',
      border: '1px solid #ddd',
      borderRadius: '12px'
    }}>
      <h2>Mentor Profile</h2>
      <p>Students ko apne baare mein batayein.</p>

      {loading ? (
        <p>Profile load ho rahi hai...</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label htmlFor="mentor-bio">About / Bio</label>
            <textarea
              id="mentor-bio"
              value={bio}
              onChange={(event) => setBio(event.target.value)}
              maxLength={1000}
              rows={5}
              placeholder="Apna experience aur students ki madad kaise karenge, batayein..."
              style={{ display: 'block', width: '100%', marginTop: '6px', padding: '10px' }}
            />
            <small>{bio.length}/1000 characters</small>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label htmlFor="mentor-experience">Experience (years)</label>
            <input
              id="mentor-experience"
              type="number"
              min="0"
              max="60"
              step="1"
              required
              value={experience}
              onChange={(event) => setExperience(event.target.value)}
              style={{ display: 'block', width: '100%', marginTop: '6px', padding: '10px' }}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label htmlFor="mentor-skills">Skills (comma se alag karein)</label>
            <input
              id="mentor-skills"
              type="text"
              value={skillsText}
              onChange={(event) => setSkillsText(event.target.value)}
              placeholder="JavaScript, React, Node.js"
              style={{ display: 'block', width: '100%', marginTop: '6px', padding: '10px' }}
            />
            <small>Maximum 20 skills; har skill 50 characters tak.</small>
          </div>

          {message && (
            <p role="status" style={{ color: error ? '#b42318' : '#16803c' }}>
              {message}
            </p>
          )}

          <button type="submit" disabled={saving}>
            {saving ? 'Saving...' : 'Save Mentor Profile'}
          </button>
        </form>
      )}
    </section>
  )
}
