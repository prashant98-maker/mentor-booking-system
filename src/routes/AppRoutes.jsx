import { Navigate, Route, Routes } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout'
import Home from '../pages/home/Home'
import Mentors from '../pages/mentors/Mentors'
import MentorDetails from '../pages/mentors/MentorDetails'
import Bookings from '../pages/bookings/Bookings'
import MentorDashboard from '../pages/mentor/MentorDashboard'
import Availability from '../pages/mentor/Availability'
import MentorSessions from '../pages/mentor/MentorSessions'
import Login from '../pages/auth/Login'
import Signup from '../pages/auth/Signup'
import StudentDashboard from '../pages/student/StudentDashboard'
import Profile from '../pages/profile/Profile'
import RoleGuard from '../context/RoleGuard'

function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route
          path="/student-dashboard"
          element={
            <RoleGuard allowedRole="student">
              <StudentDashboard />
            </RoleGuard>
          }
        />

        <Route
          path="/mentor-dashboard"
          element={
            <RoleGuard allowedRole="mentor">
              <MentorDashboard />
            </RoleGuard>
          }
        />

        <Route
          path="/mentor-availability"
          element={
            <RoleGuard allowedRole="mentor">
              <Availability />
            </RoleGuard>
          }
        />

        <Route
          path="/mentor-sessions"
          element={
            <RoleGuard allowedRole="mentor">
              <MentorSessions />
            </RoleGuard>
          }
        />

        <Route
          path="/mentors"
          element={
            <RoleGuard allowedRole="student">
              <Mentors />
            </RoleGuard>
          }
        />

        <Route
          path="/bookings"
          element={
            <RoleGuard allowedRole="student">
              <Bookings />
            </RoleGuard>
          }
        />

        <Route path="/profile" element={<Profile />} />
        <Route path="/mentors/:id" element={<RoleGuard allowedRole="student"><MentorDetails /></RoleGuard>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}

export default AppRoutes

