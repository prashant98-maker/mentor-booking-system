import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 80,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    maxlength: 254,
  },
  passwordHash: {
    type: String,
    required: true,
    select: false,
  },
  role: {
    type: String,
    enum: ['student', 'mentor'],
    required: true,
  },
  emailVerified: {
    type: Boolean,
    default: true,
  },
  emailVerificationTokenHash: {
    type: String,
    select: false,
  },
  emailVerificationExpires: {
    type: Date,
    select: false,
  },
  emailVerificationConsumedTokenHash: {
    type: String,
    select: false,
  },
  emailVerificationConsumedExpires: {
    type: Date,
    select: false,
  },
  bio: {
    type: String,
    trim: true,
    maxlength: 1000,
    default: '',
  },
  experience: {
    type: Number,
    min: 0,
    max: 60,
    default: 0,
  },
  skills: {
    type: [String],
    default: [],
    validate: {
      validator: (skills) =>
        skills.length <= 20 &&
        skills.every(skill =>
          typeof skill === 'string' &&
          skill.trim().length > 0 &&
          skill.trim().length <= 50
        ),
      message: 'Provide up to 20 valid skills.',
    },
  },
  profilePhoto: {
    type: String,
    default: '',
    select: false,
  },
}, { timestamps: true })

export default mongoose.models.User || mongoose.model('User', userSchema)
