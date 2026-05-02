import type { AuthUser, UserRole } from '../api/types'

const USER_KEY = 'mess_auth_user'
const ROLE_KEY = 'mess_auth_role'

export function persistAuthSnapshot(user: AuthUser, role: UserRole): void {
  try {
    localStorage.setItem(USER_KEY, JSON.stringify(user))
    localStorage.setItem(ROLE_KEY, role)
  } catch {
    /* ignore */
  }
}

export function readAuthSnapshot(): {
  user: AuthUser | null
  role: UserRole | null
} {
  try {
    const raw = localStorage.getItem(USER_KEY)
    const role = localStorage.getItem(ROLE_KEY) as UserRole | null
    if (!raw || !role) return { user: null, role: null }
    const user = JSON.parse(raw) as AuthUser
    if (!user?.id || !user.email) return { user: null, role: null }
    return { user, role }
  } catch {
    return { user: null, role: null }
  }
}

export function clearAuthSnapshot(): void {
  try {
    localStorage.removeItem(USER_KEY)
    localStorage.removeItem(ROLE_KEY)
  } catch {
    /* ignore */
  }
}
