import { Router } from 'express'
import { timingSafeEqual } from 'node:crypto'
import Booking from '../models/Booking.js'
import { sendEmail } from '../config/mailer.js'

const router = Router()
const REMINDER_WINDOW_MINUTES = 60
const CLAIM_TIMEOUT_MINUTES = 10

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

function hasValidSchedulerSecret(req) {
  const expected = process.env.REMINDER_CRON_SECRET
  const authorization = req.get('authorization') || ''
  const match = authorization.match(/^Bearer ([^\s]+)$/)

  if (!expected || Buffer.byteLength(expected) < 32 || !match) return false

  const suppliedBuffer = Buffer.from(match[1])
  const expectedBuffer = Buffer.from(expected)

  return suppliedBuffer.length === expectedBuffer.length &&
    timingSafeEqual(suppliedBuffer, expectedBuffer)
}

router.post('/session-reminders', async (req, res) => {
  if (!hasValidSchedulerSecret(req)) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized.',
    })
  }

  if (!process.env.SMTP_USER || !process.env.SMTP_APP_PASSWORD) {
    return res.status(503).json({
      success: false,
      message: 'Reminder email service is not configured.',
    })
  }

  let sent = 0
  let failed = 0
  let skipped = 0

  try {
    const now = new Date()
    const staleClaimBefore = new Date(now.getTime() - CLAIM_TIMEOUT_MINUTES * 60_000)

    const bookings = await Booking.find({ status: 'Booked' })
      .select('slot student mentor status reminders')
      .populate('slot', 'date time')
      .populate('student', 'name email')
      .populate('mentor', 'name email')
      .lean()

    for (const booking of bookings) {
      if (!booking.slot || !booking.student || !booking.mentor) {
        skipped++
        continue
      }

      const sessionStart = getSessionStart(booking.slot.date, booking.slot.time)
      if (!sessionStart) {
        skipped++
        continue
      }

      const minutesUntilSession = (sessionStart.getTime() - now.getTime()) / 60_000

      // A frequent scheduler sends on its first run after the 60-minute mark.
      // Past sessions are never sent a reminder.
      if (minutesUntilSession <= 0 || minutesUntilSession > REMINDER_WINDOW_MINUTES) {
        continue
      }

      const details = `Date: ${booking.slot.date}\nTime: ${booking.slot.time}\nBooking ID: ${booking._id}`
      const recipients = [
        { role: 'student', user: booking.student, otherName: booking.mentor.name || 'Mentor' },
        { role: 'mentor', user: booking.mentor, otherName: booking.student.name || 'Student' },
      ]

      for (const recipient of recipients) {
        const role = recipient.role
        const email = recipient.user.email

        if (!email) {
          failed++
          continue
        }

        const sentPath = `reminders.${role}SentAt`
        const claimedPath = `reminders.${role}ClaimedAt`

        // Atomic claim avoids two overlapping scheduler calls sending the same reminder.
        const claim = await Booking.findOneAndUpdate(
          {
            _id: booking._id,
            status: 'Booked',
            [sentPath]: null,
            $or: [
              { [claimedPath]: null },
              { [claimedPath]: { $exists: false } },
              { [claimedPath]: { $lte: staleClaimBefore } },
            ],
          },
          { $set: { [claimedPath]: new Date() } },
          { new: true },
        ).select('_id').lean()

        if (!claim) {
          skipped++
          continue
        }

        // Recheck booking status immediately before sending.
        const stillBooked = await Booking.exists({
          _id: booking._id,
          status: 'Booked',
        })

        if (!stillBooked) {
          await Booking.updateOne(
            { _id: booking._id, [sentPath]: null },
            { $unset: { [claimedPath]: 1 } },
          ).catch(() => {})
          skipped++
          continue
        }

        const isStudent = role === 'student'
        const greeting = recipient.user.name || (isStudent ? 'Student' : 'Mentor')
        const subject = 'Reminder: Your mentor session starts in about 1 hour'
        const text = isStudent
          ? `Hi ${greeting},\n\nThis is a reminder that your mentor session starts in about 1 hour.\nMentor: ${recipient.otherName}\n${details}\n\nMentorHub`
          : `Hi ${greeting},\n\nThis is a reminder that your mentoring session with ${recipient.otherName} starts in about 1 hour.\n${details}\n\nMentorHub`

        try {
          await sendEmail({ to: email, subject, text })
        } catch {
          // Email failed; release the claim so a later run can retry.
          await Booking.updateOne(
            { _id: booking._id, [sentPath]: null },
            { $unset: { [claimedPath]: 1 } },
          ).catch(() => {})
          failed++
          continue
        }

        try {
          await Booking.updateOne(
            { _id: booking._id },
            {
              $set: { [sentPath]: new Date() },
              $unset: { [claimedPath]: 1 },
            },
          )
          sent++
        } catch {
          // Email may already have been delivered. Keep the claim temporarily
          // to reduce the chance of an immediate duplicate on the next run.
          failed++
        }
      }
    }

    return res.status(200).send("OK")
  } catch {
    // Do not expose database, SMTP, or secret-related details to callers.
    return res.status(500).json({
      success: false,
      message: 'Reminder processing failed.',
      sent,
      failed,
      skipped,
    })
  }
})

export default router
