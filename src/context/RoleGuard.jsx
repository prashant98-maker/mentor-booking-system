import { Navigate } from 'react-router-dom'
import { useAuth } from './AuthContext'

function RoleGuard({ allowedRole, children }) {
  const { user } = useAuth()

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (user.role !== allowedRole) {
    return (
      <Navigate
        to={user.role === 'mentor' ? '/mentor-dashboard' : '/student-dashboard'}
        replace
      />
    )
  }

  return children
}

export default RoleGuard
