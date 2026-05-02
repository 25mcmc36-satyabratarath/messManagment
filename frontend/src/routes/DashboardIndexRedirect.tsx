import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { dashboardHomeByRole } from './dashboardPaths'

/** Sends `/dashboard` to the correct home for the signed-in role. */
export function DashboardIndexRedirect() {
  const { isAuthenticated, role } = useAuth()
  if (!isAuthenticated || !role) {
    return <Navigate to="/login" replace />
  }
  return <Navigate to={dashboardHomeByRole[role]} replace />
}
