import dns from 'node:dns'
dns.setServers(['8.8.8.8', '1.1.1.1'])

import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { connectDB } from './config/db.js'
import authRoutes from './routes/authRoutes.js'
import bookingRoutes from './routes/bookingRoutes.js'
import mentorProfileRoutes from './routes/mentorProfileRoutes.js'
import { requireAuth } from './middleware/requireAuth.js'

const app = express()
const PORT = process.env.PORT || 10000

app.set('trust proxy', 1)

const allowedOrigins = [
  'http://localhost:5173',
  'https://mentor-booking-system.onrender.com',
]

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error('Origin not allowed by CORS'))
    }
  },
}))
app.use(express.json({ limit: '20kb' }))

app.get('/health', (req, res) => {
  res.json({ success: true, message: 'Mentor Booking System backend is running' })
})

app.use('/api/auth', authRoutes)
app.use('/api/mentors', mentorProfileRoutes)
app.use('/api', bookingRoutes)

app.get('/api/auth/me', requireAuth, (req, res) => {
  res.json({ success: true, user: req.user })
})

app.use((err, req, res, next) => {
  console.error('API error:', err.message)
  if (res.headersSent) return next(err)

  res.status(500).json({
    success: false,
    message: 'A server error occurred. Please try again.',
  })
})

async function startServer() {
  try {
    await connectDB()

    if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
      throw new Error('Set JWT_SECRET to a random secret of at least 32 characters in server/.env')
    }

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Backend server running on port ${PORT}`)
    })
  } catch (error) {
    console.error('Backend startup failed:', error.message)
    process.exit(1)
  }
}

startServer()
