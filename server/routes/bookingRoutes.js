import { Router } from 'express'
import mongoose from 'mongoose'
import MentorSlot from '../models/MentorSlot.js'
import Booking from '../models/Booking.js'
import { sendEmail } from '../config/mailer.js'
import { requireAuth, allowRoles } from '../middleware/requireAuth.js'

const SESSION_CANCELLATION_CUTOFF_MINUTES = 60

function getSessionStart(date, time) {
  if (typeof date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(date)) return null
  const dateCheck = new Date(date + 'T00:00:00Z')
  if (!Number.isFinite(dateCheck.getTime()) || dateCheck.toISOString().slice(0, 10) !== date) return null

  const match = typeof time === 'string' && time.match(/^\s*(\d{1,2}):(\d{2})\s*(AM|PM)\b/i)
  if (!match) return null

  let hour = Number(match[1])
  const minute = Number(match[2])
  if (hour < 1 || hour > 12 || minute < 0 || minute > 59) return null

  hour = (hour % 12) + (match[3].toUpperCase() === 'PM' ? 12 : 0)
  const start = new Date(date + 'T' + String(hour).padStart(2, '0') + ':' +
    String(minute).padStart(2, '0') + ':00+05:30')
  return Number.isFinite(start.getTime()) ? start : null
}

const router = Router()
router.use(requireAuth)

router.get('/slots', async (req, res, next) => {
  try {
    const slots = await MentorSlot.find()
      .populate('mentor', 'name email')
      .sort({ date: 1, time: 1 })
      .lean()

    const bookings = await Booking.find({ status: { $ne: 'Cancelled' } }).select('slot').lean()
    const booked = new Set(bookings.map(b => String(b.slot)))

    res.json({
      success: true,
      slots: slots.map(s => ({
        id: String(s._id),
        mentorId: String(s.mentor._id),
        mentorName: s.mentor.name,
        date: s.date,
        time: s.time,
        available: !booked.has(String(s._id)),
      })),
    })
  } catch (error) { next(error) }
})

router.post('/slots', allowRoles('mentor'), async (req, res, next) => {
  try {
    const { date, time } = req.body || {}
    if (typeof date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(date) ||
        typeof time !== 'string' || time.length < 3 || time.length > 60) {
      return res.status(400).json({ success: false, message: 'Enter a valid date and time.' })
    }
    if (date < new Date().toISOString().slice(0, 10)) {
      return res.status(400).json({ success: false, message: 'Past dates are not allowed.' })
    }

    const slot = await MentorSlot.create({ mentor: req.user.id, date, time })
    res.status(201).json({
      success: true,
      slot: { id: String(slot._id), mentorId: req.user.id, mentorName: req.user.name, date, time, available: true },
    })
  } catch (error) {
    if (error?.code === 11000) return res.status(409).json({ success: false, message: 'You already created this slot.' })
    next(error)
  }
})

router.get('/bookings', async (req, res, next) => {
  try {
    const filter = req.user.role === 'mentor'
      ? { mentor: req.user.id }
      : { student: req.user.id }

    const bookings = await Booking.find(filter)
      .populate('student', 'name email')
      .populate('mentor', 'name email')
      .populate('slot', 'date time')
      .sort({ createdAt: -1 })
      .lean()

    res.json({
      success: true,
      bookings: bookings.filter(b => b.slot).map(b => ({
        id: String(b._id),
        slotId: String(b.slot._id),
        studentId: String(b.student._id),
        studentName: b.student.name,
        mentorId: String(b.mentor._id),
        mentorName: b.mentor.name,
        date: b.slot.date,
        time: b.slot.time,
        status: b.status,
        rating: b.rating?.stars ? {
          stars: b.rating.stars,
          review: b.rating.review || '',
          ratedAt: b.rating.ratedAt,
        } : null,
      })),
    })
  } catch (error) { next(error) }
})

router.post('/bookings', allowRoles('student'), async (req, res, next) => {
  try {
    const { slotId } = req.body || {}
    if (!mongoose.isValidObjectId(slotId)) {
      return res.status(400).json({ success: false, message: 'Invalid slot.' })
    }

    const slot = await MentorSlot.findById(slotId)
    if (!slot) return res.status(404).json({ success: false, message: 'Slot not found.' })
    if (String(slot.mentor) === req.user.id) {
      return res.status(400).json({ success: false, message: 'You cannot book your own slot.' })
    }

    const existing = await Booking.findOne({ slot: slotId, status: { $ne: 'Cancelled' } })
    if (existing) return res.status(409).json({ success: false, message: 'This slot is already booked.' })

    const booking = await Booking.create({
      slot: slot._id,
      activeSlot: slot._id,
      student: req.user.id,
      mentor: slot.mentor,
    })

    try {
      const [student, mentor] = await Promise.all([
        (await import('../models/User.js')).default.findById(req.user.id).select('name email').lean(),
        (await import('../models/User.js')).default.findById(slot.mentor).select('name email').lean(),
      ])

      const subject = 'MentorHub booking confirmation'
      const details = `Date: ${slot.date}\nTime: ${slot.time}\nBooking ID: ${booking._id}`

      if (student?.email) {
        await sendEmail({
          to: student.email,
          subject,
          text: `Hi ${student.name || 'Student'}, your mentor session is booked.\n\n${details}`,
        })
      }

      if (mentor?.email) {
        await sendEmail({
          to: mentor.email,
          subject,
          text: `Hi ${mentor.name || 'Mentor'}, a student booked your session.\n\nStudent: ${student?.name || 'Student'}\n${details}`,
        })
      }
    } catch (emailError) {
      console.warn('Booking confirmation email could not be sent.')
    }

    res.status(201).json({ success: true, bookingId: String(booking._id), message: 'Booking created.' })
  } catch (error) {
    if (error?.code === 11000) return res.status(409).json({ success: false, message: 'This slot is already booked.' })
    next(error)
  }
})

router.patch('/bookings/:id/status', allowRoles('mentor'), async (req, res, next) => {
  try {
    const { status } = req.body || {}
    if (!['Completed', 'Cancelled'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid booking status.' })
    }

    const update = { status }
    if (status === 'Cancelled') update.activeSlot = null

    const booking = await Booking.findOneAndUpdate(
      { _id: req.params.id, mentor: req.user.id, status: 'Booked' },
      { $set: update },
      { new: true, runValidators: true }
    )
    if (!booking) {
      const exists = await Booking.exists({ _id: req.params.id, mentor: req.user.id })
      if (!exists) return res.status(404).json({ success: false, message: 'Booking not found.' })
      return res.status(409).json({ success: false, message: 'Only active bookings can be updated.' })
    }

    res.json({ success: true, message: `Booking marked ${status.toLowerCase()}.` })
  } catch (error) { next(error) }
})

router.patch('/bookings/:id/cancel', allowRoles('student'), async (req, res, next) => {
  try {
    const cancellableBooking = await Booking.findOne({
      _id: req.params.id,
      student: req.user.id,
      status: 'Booked',
    }).select('slot').lean()

    if (cancellableBooking) {
      const slot = await MentorSlot.findById(cancellableBooking.slot)
        .select('date time').lean()

      if (!slot) {
        return res.status(400).json({
          success: false,
          message: 'Unable to verify session time. Please contact support.',
        })
      }

      const sessionStart = getSessionStart(slot.date, slot.time)
      if (!sessionStart) {
        return res.status(400).json({
          success: false,
          message: 'Unable to determine session start time. Please contact support.',
        })
      }

      const minutesUntilSession = (sessionStart.getTime() - Date.now()) / 60000
      if (minutesUntilSession <= SESSION_CANCELLATION_CUTOFF_MINUTES) {
        return res.status(409).json({
          success: false,
          message: 'Cancellations close 60 minutes before the session starts.',
        })
      }
    }

    const booking = await Booking.findOneAndUpdate(
      { _id: req.params.id, student: req.user.id, status: 'Booked' },
      { $set: { status: 'Cancelled', activeSlot: null } },
      { new: true, runValidators: true }
    )
    if (!booking) {
      const exists = await Booking.exists({ _id: req.params.id, student: req.user.id })
      if (!exists) return res.status(404).json({ success: false, message: 'Booking not found.' })
      return res.status(409).json({ success: false, message: 'Only active bookings can be cancelled.' })
    }

    res.json({ success: true, message: 'Booking cancelled.' })
  } catch (error) { next(error) }
})

router.patch('/bookings/:id/rating', allowRoles('student'), async (req, res, next) => {
  try {
    const { stars, review = '' } = req.body || {}

    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid booking ID.',
      })
    }

    if (!Number.isInteger(stars) || stars < 1 || stars > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5 stars.',
      })
    }

    if (typeof review !== 'string' || review.length > 500) {
      return res.status(400).json({
        success: false,
        message: 'Review must be 500 characters or fewer.',
      })
    }

    const result = await Booking.updateOne(
      {
        _id: req.params.id,
        student: req.user.id,
        status: 'Completed',
        'rating.stars': { $exists: false },
      },
      {
        $set: {
          rating: {
            stars,
            review: review.trim(),
            ratedAt: new Date(),
          },
        },
      }
    )

    if (result.modifiedCount === 1) {
      return res.json({
        success: true,
        message: 'Rating submitted successfully.',
      })
    }

    const booking = await Booking.findOne({
      _id: req.params.id,
      student: req.user.id,
    }).select('status rating').lean()

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found.',
      })
    }

    if (booking.status !== 'Completed') {
      return res.status(409).json({
        success: false,
        message: 'You can rate only completed sessions.',
      })
    }

    return res.status(409).json({
      success: false,
      message: 'This session has already been rated.',
    })
  } catch (error) {
    next(error)
  }
})
export default router


