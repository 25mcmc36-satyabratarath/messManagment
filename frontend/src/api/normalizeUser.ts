import type { AuthUser, UserRole } from './types'

/**
 * Maps heterogeneous API user payloads to a consistent AuthUser shape.
 */
export function normalizeUser(
  user: Record<string, unknown> | null | undefined,
  role: UserRole,
): AuthUser | null {
  if (!user || typeof user !== 'object') return null

  const id =
    (typeof user.id === 'number' && user.id) ||
    (typeof user.student_id === 'number' && user.student_id) ||
    (typeof user.staff_id === 'number' && user.staff_id) ||
    0

  const name = typeof user.name === 'string' ? user.name : ''
  const email = typeof user.email === 'string' ? user.email : ''
  const hostel_id =
    typeof user.hostel_id === 'number'
      ? user.hostel_id
      : user.hostel_id === null
        ? null
        : undefined

  const auth: AuthUser = {
    id: id || 0,
    name,
    email,
    hostel_id: hostel_id ?? undefined,
  }

  if (typeof user.student_id === 'number') auth.raw_student_id = user.student_id
  if (typeof user.staff_id === 'number') auth.raw_staff_id = user.staff_id

  if (role === 'STUDENT' && !auth.id && typeof user.student_id === 'number') {
    auth.id = user.student_id
  }

  return auth.id ? auth : null
}
