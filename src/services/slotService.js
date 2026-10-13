const STORAGE_KEY = 'mentor_booking_demo_slots'

const defaultSlots = [
  { id: 101, mentorId: 1, mentorName: 'Aarav Sharma', date: '2026-10-12', time: '10:00 AM - 10:30 AM' },
  { id: 102, mentorId: 2, mentorName: 'Priya Verma', date: '2026-10-12', time: '11:00 AM - 11:30 AM' },
  { id: 103, mentorId: 3, mentorName: 'Rahul Singh', date: '2026-10-13', time: '02:00 PM - 02:30 PM' },
]

export function getSlots() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) return JSON.parse(saved)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultSlots))
    return defaultSlots
  } catch {
    return defaultSlots
  }
}

export function saveSlots(slots) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(slots))
}

export function addSlot(slot) {
  const slots = getSlots()
  const newSlot = { ...slot, id: Date.now() }
  saveSlots([...slots, newSlot])
  return newSlot
}
