import mongoose from 'mongoose'

const bookingSchema = new mongoose.Schema({
  slot: { type: mongoose.Schema.Types.ObjectId, ref: 'MentorSlot', required: true, unique: true },
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  mentor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  status: { type: String, enum: ['Booked', 'Completed', 'Cancelled'], default: 'Booked' },
}, { timestamps: true })

export default mongoose.models.Booking || mongoose.model('Booking', bookingSchema)
