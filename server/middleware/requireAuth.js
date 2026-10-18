import jwt from 'jsonwebtoken'
import User from '../models/User.js'

export async function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization || ''
    const [scheme, token] = header.split(' ')

    if (scheme !== 'Bearer' || !token) {
      return res.status(401).json({
        success: false,
        message: 'Please log in to continue.',
      })
    }

    const secret = process.env.JWT_SECRET
    if (!secret || secret.length < 32) {
      return res.status(500).json({
        success: false,
        message: 'Authentication is not configured on the server.',
      })
    }

    const payload = jwt.verify(token, secret)
    const user = await User.findById(payload.sub)

    if (!user || user.role !== payload.role) {
      return res.status(401).json({
        success: false,
        message: 'Your session is invalid. Please log in again.',
      })
    }

    req.user = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
    }
    next()
  } catch {
    return res.status(401).json({
      success: false,
      message: 'Your session is invalid or has expired.',
    })
  }
}

export function allowRoles(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to access this resource.',
      })
    }
    next()
  }
}
