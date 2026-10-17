import dns from 'node:dns'
dns.setServers(['8.8.8.8', '1.1.1.1'])

import 'dotenv/config'
import express from 'express'
import { connectDB } from './config/db.js'

const app = express()
const PORT = process.env.PORT || 10000

app.use(express.json())

app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Mentor Booking System backend is running',
  })
})

async function startServer() {
  try {
    await connectDB()

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Backend server running on port ${PORT}`)
    })
  } catch (error) {
    console.error('Backend startup failed:', error.message)
    process.exit(1)
  }
}

startServer()
