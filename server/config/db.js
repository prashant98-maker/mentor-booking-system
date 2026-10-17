import mongoose from 'mongoose'

export async function connectDB() {
  const uri = process.env.MONGODB_URI

  if (!uri) {
    throw new Error('MONGODB_URI is missing from environment variables')
  }

  await mongoose.connect(uri, {
    dbName: 'mentor_booking_db',
    serverSelectionTimeoutMS: 10000,
  })

  console.log('MongoDB connected: mentor_booking_db')
}
