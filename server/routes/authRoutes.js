import { Router } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import rateLimit from 'express-rate-limit'
import User from '../models/User.js'

const router = Router()
const authLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
})

function createToken(user) {
  const secret = process.env.JWT_SECRET
  if (!secret || secret.length < 32) {
    throw new Error('JWT_SECRET must contain at least 32 characters')
  }

  return jwt.sign(
    { sub: user._id.toString(), role: user.role },
    secret,
    { expiresIn: '1d' },
  )
}

function publicUser(user) {
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
  }
}

router.post('/signup', authLimit, async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body || {}

    if (
      typeof name !== 'string' || name.trim().length < 2 ||
      typeof email !== 'string' ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) ||
      typeof password !== 'string' || password.length < 8 ||
      password.length > 72 ||
      !['student', 'mentor'].includes(role)
    ) {
      return res.status(400).json({
        success: false,
        message: 'Enter a valid name, email, password (8–72 characters), and role.',
      })
    }

    const normalizedEmail = email.trim().toLowerCase()
    const existing = await User.findOne({ email: normalizedEmail })

    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email already exists.',
      })
    }

    const passwordHash = await bcrypt.hash(password, 12)
    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      passwordHash,
      role,
    })

    return res.status(201).json({
      success: true,
      message: 'Account created successfully.',
      token: createToken(user),
      user: publicUser(user),
    })
  } catch (error) {
    if (error?.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email already exists.',
      })
    }
    next(error)
  }
})

router.post('/login', authLimit, async (req, res, next) => {
  try {
    const { email, password } = req.body || {}

    if (
      typeof email !== 'string' ||
      typeof password !== 'string' ||
      password.length > 72
    ) {
      return res.status(400).json({
        success: false,
        message: 'Enter your email and password.',
      })
    }

    const user = await User.findOne({
      email: email.trim().toLowerCase(),
    }).select('+passwordHash')

    const valid = user && await bcrypt.compare(password, user.passwordHash)

    if (!valid) {
      return res.status(401).json({
        success: false,
        message: 'Email or password is incorrect.',
      })
    }

    return res.json({
      success: true,
      message: 'Login successful.',
      token: createToken(user),
      user: publicUser(user),
    })
  } catch (error) {
    next(error)
  }
})

export default router
