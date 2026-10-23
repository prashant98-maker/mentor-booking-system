import mongoose from 'mongoose'

const bookingSchema = new mongoose.Schema({
  slot: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MentorSlot',
    required: true,
  },
  activeSlot: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MentorSlot',
    default: null,
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  mentor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  status: {
    type: String,
    enum: ['Booked', 'Completed', 'Cancelled'],
    default: 'Booked',
    required: true,
  },
  reminders: {
    studentSentAt: { type: Date, default: null },
    mentorSentAt: { type: Date, default: null },
    studentClaimedAt: { type: Date, default: null },
    mentorClaimedAt: { type: Date, default: null },
  },
  rating: {
    stars: {
      type: Number,
      min: 1,
      max: 5,
    },
    review: {
      type: String,
      maxlength: 500,
      trim: true,
    },
    ratedAt: {
      type: Date,
    },
  },

},{ timestamps: true })

 bookingSchema.index(
  { activeSlot: 1 },
  {
    unique: true,
    partialFilterExpression: { activeSlot: { $type: 'objectId' } },
  }
)

export default mongoose.models.Booking || mongoose.model('Booking', bookingSchema)

