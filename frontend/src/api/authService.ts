import { apiClient } from './apiClient'
import { normalizeUser } from './normalizeUser'
import type { AuthUser, SendOtpResult, UserRole, VerifyOtpResult } from './types'

export async function sendOtp(
  email: string,
  role: UserRole,
): Promise<SendOtpResult> {
  const res = await apiClient.post<SendOtpResult>('/api/users/send-otp', {
    email,
    role,
  })
  return {
    message: res.data?.message ?? '',
    token: res.data?.token ?? '',
    role: (res.data?.role as UserRole) ?? role,
  }
}

export async function verifyOtp(
  otp: string,
  token: string,
  role: UserRole,
): Promise<{ token: string; role: UserRole; user: AuthUser | null; message: string }> {
  const res = await apiClient.post<VerifyOtpResult>('/api/users/verify-otp', {
    otp,
    token,
    role,
  })
  const data = res.data ?? ({} as VerifyOtpResult)
  const r = (data.role as UserRole) ?? role
  const user = normalizeUser(
    data.user as Record<string, unknown> | undefined,
    r,
  )
  return {
    message: data.message ?? '',
    token: data.token ?? '',
    role: r,
    user,
  }
}

export async function logoutApi(): Promise<string> {
  const res = await apiClient.post<{ message?: string }>('/api/users/logout')
  return res.data?.message ?? 'Logged out'
}
