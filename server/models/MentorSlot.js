import mongoose from 'mongoose'

const slotSchema = new mongoose.Schema({
  mentor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
}, { timestamps: true })

slotSchema.index({ mentor: 1, date: 1, time: 1 }, { unique: true })

export default mongoose.models.MentorSlot || mongoose.model('MentorSlot', slotSchema)
