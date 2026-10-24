import { Router } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import rateLimit from 'express-rate-limit'
import { randomBytes, createHash } from 'node:crypto'
import User from '../models/User.js'
import { sendEmail } from '../config/mailer.js'

const router = Router()

const authLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
})

const verificationLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
})

const resendVerificationLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
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

function hashVerificationToken(token) {
  return createHash('sha256').update(token).digest('hex')
}

router.post('/resend-verification', resendVerificationLimit, async (req, res, next) => {
  let user

  try {
    const { email } = req.body || {}

    if (
      typeof email !== 'string' ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
    ) {
      return res.status(400).json({
        success: false,
        message: 'Enter a valid email address.',
      })
    }

    user = await User.findOne({
      email: email.trim().toLowerCase(),
      emailVerified: false,
    })

    console.log('[ResendVerification] Unverified account found:', Boolean(user))

    // Do not reveal whether an account exists.
    if (!user) {
      return res.json({
        success: true,
        message: 'If an unverified account exists, a new verification link will be sent.',
      })
    }

    const frontendUrl = (process.env.FRONTEND_URL || process.env.CLIENT_ORIGIN)

    if (!frontendUrl) {
      return res.status(503).json({
        success: false,
        message: 'Email service is temporarily unavailable.',
      })
    }

    const verificationToken = randomBytes(32).toString('hex')

    user.emailVerificationTokenHash = hashVerificationToken(verificationToken)
    user.emailVerificationExpires = new Date(Date.now() + 30 * 60 * 1000)
    user.emailVerificationConsumedTokenHash = undefined
    user.emailVerificationConsumedExpires = undefined
    await user.save()

    const verificationUrl = new URL('/verify-email', frontendUrl)
    verificationUrl.searchParams.set('token', verificationToken)

    try {
      await sendEmail({
        to: user.email,
        subject: 'Your new MentorHub verification link',
        text: `Verify your MentorHub email within 30 minutes using this link: ${verificationUrl.toString()}`,
        html: `<p>Here is your new MentorHub verification link.</p><p>Please verify your email within 30 minutes:</p><p><a href="${verificationUrl.toString()}">Verify email</a></p><p>If you did not request this email, you can ignore it.</p>`,
      })
    } catch (emailError) {
      user.emailVerificationTokenHash = undefined
      user.emailVerificationExpires = undefined
      await user.save()

      console.error('Resend verification email failed:', {
      code: emailError?.code,
      responseCode: emailError?.responseCode,
      command: emailError?.command,
      message: emailError?.message,
     })
      return res.status(503).json({
        success: false,
        message: 'Email service is temporarily unavailable. Please try again later.',
      })
    }

    return res.json({
      success: true,
      message: 'If an unverified account exists, a new verification link will be sent.',
    })
  } catch (error) {
    next(error)
  }
})

router.post('/signup', authLimit, async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body || {}

    if (
      typeof name !== 'string' || name.trim().length < 2 ||
      name.trim().length > 80 ||
      typeof email !== 'string' ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) ||
      typeof password !== 'string' ||
      password.length < 8 ||
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

    const verificationToken = randomBytes(32).toString('hex')
    const verificationTokenHash = hashVerificationToken(verificationToken)
    const verificationExpires = new Date(Date.now() + 30 * 60 * 1000)
    const passwordHash = await bcrypt.hash(password, 12)

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      passwordHash,
      role,
      emailVerified: false,
      emailVerificationTokenHash: verificationTokenHash,
      emailVerificationExpires: verificationExpires,
    })

    const frontendUrl = (process.env.FRONTEND_URL || process.env.CLIENT_ORIGIN)
    if (!frontendUrl) {
      await User.deleteOne({ _id: user._id })
      return res.status(500).json({
        success: false,
        message: 'Email verification is not configured. Please try again later.',
      })
    }

    const verificationUrl = new URL('/verify-email', frontendUrl)
    verificationUrl.searchParams.set('token', verificationToken)

    try {
      await sendEmail({
        to: normalizedEmail,
        subject: 'Verify your MentorHub email',
        text: `Welcome to MentorHub. Verify your email within 30 minutes using this link: ${verificationUrl.toString()}`,
        html: `<p>Welcome to MentorHub!</p><p>Please verify your email within 30 minutes:</p><p><a href="${verificationUrl.toString()}">Verify email</a></p><p>If you did not create this account, you can ignore this email.</p>`,
      })
    } catch (emailError) {
      // Keep the account so verification can be retried later.
      console.error('Verification email failed:', { code: emailError?.code, responseCode: emailError?.responseCode, command: emailError?.command, message: emailError?.message })
      return res.status(503).json({
        success: false,
        message: 'Verification email could not be sent. Please try signing up again later.',
      })
    }

    return res.status(201).json({
      success: true,
      message: 'Account created. Check your email for the verification link.',
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

router.get('/verify-email', verificationLimit, async (req, res, next) => {
  try {
    const token = req.query?.token

    if (typeof token !== 'string' || !/^[a-f0-9]{64}$/i.test(token)) {
      return res.status(400).json({
        success: false,
        message: 'This verification link is invalid or has expired.',
      })
    }

    const tokenHash = hashVerificationToken(token)
    const now = new Date()

    const user = await User.findOne({
      emailVerificationTokenHash: tokenHash,
      emailVerificationExpires: { $gt: now },
      emailVerified: false,
    }).select(
      '+emailVerificationTokenHash +emailVerificationExpires ' +
      '+emailVerificationConsumedTokenHash +emailVerificationConsumedExpires',
    )

    if (user) {
      user.emailVerified = true
      user.emailVerificationConsumedTokenHash = tokenHash
      user.emailVerificationConsumedExpires = new Date(
        now.getTime() + 24 * 60 * 60 * 1000,
      )
      user.emailVerificationTokenHash = undefined
      user.emailVerificationExpires = undefined
      await user.save()

      return res.json({
        success: true,
        message: 'Email verified successfully. You can now log in.',
      })
    }

    const alreadyVerified = await User.findOne({
      emailVerificationConsumedTokenHash: tokenHash,
      emailVerificationConsumedExpires: { $gt: now },
      emailVerified: true,
    }).select(
      '+emailVerificationConsumedTokenHash +emailVerificationConsumedExpires',
    )

    if (alreadyVerified) {
      return res.json({
        success: true,
        message: 'Email verified successfully. You can now log in.',
      })
    }

    return res.status(400).json({
      success: false,
      message: 'This verification link is invalid or has expired.',
    })
  } catch (error) {
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

    // Existing accounts without this field remain usable.
    if (user.emailVerified === false) {
      return res.status(403).json({
        success: false,
        message: 'Please verify your email before logging in.',
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






