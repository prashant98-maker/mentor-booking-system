const STORAGE_KEY = 'mentor_booking_demo_bookings'

export function getBookings() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []
  } catch {
    return []
  }
}

export function saveBookings(bookings) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings))
}

export function addBooking(slot) {
  const bookings = getBookings()
  const alreadyBooked = bookings.some(
    (booking) =>
      String(booking.slotId) === String(slot.id) &&
      booking.status !== 'Cancelled',
  )

  if (alreadyBooked) {
    return { success: false, message: 'This slot is already booked.' }
  }

  const booking = {
    id: crypto.randomUUID(),
    slotId: slot.id,
    mentorId: slot.mentorId,
    mentorName: slot.mentorName,
    date: slot.date,
    time: slot.time,
    status: 'Booked',
    createdAt: new Date().toISOString(),
  }

  saveBookings([...bookings, booking])
  return { success: true, message: 'Booking saved successfully.', booking }
}

export function cancelBooking(id) {
  const bookings = getBookings()
  saveBookings(
    bookings.map((booking) =>
      booking.id === id ? { ...booking, status: 'Cancelled' } : booking,
    ),
  )
}

export function updateBookingStatus(id, status) {
  const bookings = getBookings()
  saveBookings(
    bookings.map((booking) =>
      booking.id === id ? { ...booking, status } : booking,
    ),
  )
}
