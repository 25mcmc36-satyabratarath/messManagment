import type { UserRole } from '../api/types'

export const dashboardHomeByRole: Record<UserRole, string> = {
  STUDENT: '/dashboard/student/mess-card',
  CARE_TAKER: '/dashboard/caretaker/students',
  MESS_SECRETARY: '/dashboard/secretary/overview',
  MESS_SUPERVISOR: '/dashboard/supervisor/ration-items',
  WARDEN: '/dashboard/warden/staff',
}

const FIRST_SEGMENT_TO_ROLE: Record<string, UserRole> = {
  student: 'STUDENT',
  caretaker: 'CARE_TAKER',
  secretary: 'MESS_SECRETARY',
  supervisor: 'MESS_SUPERVISOR',
  warden: 'WARDEN',
}

/**
 * True when `pathname` is under `/dashboard/...` for the given role.
 * Used so post-login redirect never sends a user to another role's routes (403).
 */
export function dashboardPathBelongsToRole(
  pathname: string,
  role: UserRole,
): boolean {
  const path = pathname.replace(/\/$/, '') || '/'
  if (path === '/dashboard') return true
  const parts = path.split('/').filter(Boolean)
  if (parts[0] !== 'dashboard' || parts.length < 2) return false
  const dashRole = FIRST_SEGMENT_TO_ROLE[parts[1]]
  return dashRole === role
}

/** Where to go after login: deep link only if it matches this role, else role home. */
export function postLoginPath(
  fromPathname: string | null | undefined,
  role: UserRole,
): string {
  if (fromPathname && dashboardPathBelongsToRole(fromPathname, role)) {
    return fromPathname
  }
  return dashboardHomeByRole[role]
}
