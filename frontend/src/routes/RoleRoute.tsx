import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import type { UserRole } from '../api/types'

type Props = {
  allowed: UserRole[]
}

/** Allows the nested route tree only when `role` is in `allowed`. */
export function RoleRoute({ allowed }: Props) {
  const { role, isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (!role || !allowed.includes(role)) {
    return <Navigate to="/forbidden" replace />
  }

  return <Outlet />
}
