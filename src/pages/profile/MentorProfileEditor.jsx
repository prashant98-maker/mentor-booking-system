import { useEffect, useState } from 'react'
import {
  fetchMyMentorProfile,
  saveMyMentorProfile,
} from '../../services/databaseService'

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

    if (
      bio.trim().length > 1000 ||
      skills.length > 20 ||
      skills.some((skill) => skill.length > 50)
    ) {
      setError(true)
      setMessage(
        'Bio max 1000 characters aur skills max 20 (har skill 50 characters tak) rakho.',
      )
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

  const fieldStyle = {
    display: 'block',
    width: '100%',
    boxSizing: 'border-box',
    marginTop: '9px',
    padding: '13px 14px',
    border: '1px solid #cbd5e1',
    borderRadius: '10px',
    background: '#f8fafc',
    color: '#172033',
    fontSize: '16px',
    lineHeight: 1.5,
    outlineColor: '#2563eb',
    fontFamily: 'inherit',
  }

  const labelStyle = {
    display: 'block',
    color: '#172033',
    fontSize: '15px',
    fontWeight: 700,
    marginBottom: '5px',
  }

  return (
    <section
      className="mentor-profile-editor"
      style={{
        marginTop: '28px',
        padding: 'clamp(20px, 4vw, 34px)',
        border: '1px solid #e2e8f0',
        borderTop: '5px solid #2563eb',
        borderRadius: '20px',
        background: '#ffffff',
        boxShadow: '0 14px 36px rgba(15, 23, 42, 0.09)',
        color: '#172033',
        maxWidth: '760px',
        width: '100%',
        boxSizing: 'border-box',
      }}
    >
      <div style={{ marginBottom: '26px' }}>
        <span
          style={{
            display: 'inline-block',
            padding: '6px 10px',
            borderRadius: '7px',
            background: '#eff6ff',
            color: '#1d4ed8',
            fontSize: '12px',
            fontWeight: 800,
            letterSpacing: '1px',
          }}
        >
          MENTOR WORKSPACE
        </span>
        <h2
          style={{
            margin: '14px 0 8px',
            fontSize: 'clamp(25px, 4vw, 32px)',
            lineHeight: 1.2,
            color: '#0f172a',
          }}
        >
          Edit Your Profile
        </h2>
        <p style={{ margin: 0, color: '#64748b', lineHeight: 1.7 }}>
          Apni skills aur experience share karein, taaki students aapko behtar
          jaan sakein.
        </p>
      </div>

      {loading ? (
        <p role="status" style={{ color: '#475569' }}>
          Profile load ho rahi hai...
        </p>
      ) : (
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '23px' }}>
            <label htmlFor="mentor-bio" style={labelStyle}>
              About / Bio
            </label>
            <textarea
              id="mentor-bio"
              value={bio}
              onChange={(event) => setBio(event.target.value)}
              maxLength={1000}
              rows={5}
              placeholder="Apna experience aur students ki madad kaise karenge, batayein..."
              style={{ ...fieldStyle, resize: 'vertical', minHeight: '140px' }}
            />
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                gap: '12px',
                marginTop: '7px',
                color: '#64748b',
                fontSize: '12px',
              }}
            >
              <span>Apne baare mein saaf aur simple likhein.</span>
              <span>{bio.length}/1000</span>
            </div>
          </div>

          <div style={{ marginBottom: '23px' }}>
            <label htmlFor="mentor-experience" style={labelStyle}>
              Experience (years)
            </label>
            <input
              id="mentor-experience"
              type="number"
              min="0"
              max="60"
              step="1"
              required
              value={experience}
              onChange={(event) => setExperience(event.target.value)}
              style={fieldStyle}
            />
            <small style={{ display: 'block', marginTop: '7px', color: '#64748b' }}>
              0 se 60 saal ke beech enter karein.
            </small>
          </div>

          <div style={{ marginBottom: '25px' }}>
            <label htmlFor="mentor-skills" style={labelStyle}>
              Skills
            </label>
            <input
              id="mentor-skills"
              type="text"
              value={skillsText}
              onChange={(event) => setSkillsText(event.target.value)}
              placeholder="JavaScript, React, Node.js"
              style={fieldStyle}
            />
            <small style={{ display: 'block', marginTop: '7px', color: '#64748b' }}>
              Comma se alag karein. Maximum 20 skills, har skill 50 characters tak.
            </small>
          </div>

          {message && (
            <div
              role={error ? 'alert' : 'status'}
              style={{
                marginBottom: '18px',
                padding: '13px 15px',
                borderRadius: '10px',
                border: `1px solid ${error ? '#fecaca' : '#bbf7d0'}`,
                background: error ? '#fef2f2' : '#f0fdf4',
                color: error ? '#b91c1c' : '#166534',
                lineHeight: 1.6,
                fontWeight: 600,
              }}
            >
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={saving || loading}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              width: '100%',
              minHeight: '54px',
              padding: '14px 20px',
              border: 'none',
              borderRadius: '12px',
              background: saving
                ? '#64748b'
                : 'linear-gradient(135deg, #2563eb, #1d4ed8)',
              color: '#ffffff',
              fontSize: '16px',
              fontWeight: 800,
              letterSpacing: '0.2px',
              cursor: saving || loading ? 'wait' : 'pointer',
              boxShadow: '0 7px 16px rgba(37, 99, 235, 0.25)',
              opacity: saving || loading ? 0.8 : 1,
            }}
          >
            {saving ? 'Saving profile...' : 'Save Mentor Profile'}
            {!saving && <span aria-hidden="true">→</span>}
          </button>

          <p
            style={{
              margin: '12px 0 0',
              textAlign: 'center',
              color: '#64748b',
              fontSize: '12px',
            }}
          >
            Your profile changes are saved to the shared database.
          </p>
        </form>
      )}
    </section>
  )
}