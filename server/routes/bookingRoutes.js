import { Router } from 'express'
import mongoose from 'mongoose'
import MentorSlot from '../models/MentorSlot.js'
import Booking from '../models/Booking.js'
import { requireAuth, allowRoles } from '../middleware/requireAuth.js'

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
      student: req.user.id,
      mentor: slot.mentor,
    })

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

    const booking = await Booking.findOne({ _id: req.params.id, mentor: req.user.id })
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found.' })
    if (booking.status !== 'Booked') {
      return res.status(409).json({ success: false, message: 'Only active bookings can be updated.' })
    }

    booking.status = status
    await booking.save()
    res.json({ success: true, message: `Booking marked ${status.toLowerCase()}.` })
  } catch (error) { next(error) }
})

router.patch('/bookings/:id/cancel', allowRoles('student'), async (req, res, next) => {
  try {
    const booking = await Booking.findOne({ _id: req.params.id, student: req.user.id })
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found.' })
    if (booking.status !== 'Booked') {
      return res.status(409).json({ success: false, message: 'Only active bookings can be cancelled.' })
    }

    booking.status = 'Cancelled'
    await booking.save()
    res.json({ success: true, message: 'Booking cancelled.' })
  } catch (error) { next(error) }
})

export default router
