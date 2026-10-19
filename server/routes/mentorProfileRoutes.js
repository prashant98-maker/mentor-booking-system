import { Router } from 'express'
import User from '../models/User.js'
import { requireAuth, allowRoles } from '../middleware/requireAuth.js'

const router = Router()

function publicProfile(user) {
  return {
    id: String(user._id),
    name: user.name,
    role: user.role,
    bio: user.bio || '',
    experience: user.experience || 0,
    skills: user.skills || [],
  }
}

router.get('/', async (req, res, next) => {
  try {
    const mentors = await User.find({ role: 'mentor' })
      .select('name bio experience skills')
      .sort({ name: 1 })
      .lean()

    res.json({ success: true, mentors: mentors.map(publicProfile) })
  } catch (error) {
    next(error)
  }
})

router.get('/me', requireAuth, allowRoles('mentor'), async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.user.id, role: 'mentor' })
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Mentor profile not found.',
      })
    }
    res.json({ success: true, profile: publicProfile(user) })
  } catch (error) {
    next(error)
  }
})

router.put('/me', requireAuth, allowRoles('mentor'), async (req, res, next) => {
  try {
    const { bio, experience, skills } = req.body || {}

    if (
      typeof bio !== 'string' ||
      bio.trim().length > 1000 ||
      !Number.isInteger(experience) ||
      experience < 0 ||
      experience > 60 ||
      !Array.isArray(skills) ||
      skills.length > 20 ||
      !skills.every(skill =>
        typeof skill === 'string' &&
        skill.trim().length > 0 &&
        skill.trim().length <= 50
      )
    ) {
      return res.status(400).json({
        success: false,
        message: 'Enter a valid bio, experience (0–60 years), and up to 20 skills.',
      })
    }

    const cleanSkills = [...new Set(skills.map(skill => skill.trim()))]

    const user = await User.findOneAndUpdate(
      { _id: req.user.id, role: 'mentor' },
      { $set: { bio: bio.trim(), experience, skills: cleanSkills } },
      { new: true, runValidators: true },
    )

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Mentor profile not found.',
      })
    }

    res.json({
      success: true,
      message: 'Mentor profile saved.',
      profile: publicProfile(user),
    })
  } catch (error) {
    next(error)
  }
})

export default router
