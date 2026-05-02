import axios, { type AxiosError } from 'axios'
import { clearAuthSnapshot } from '../auth/persistAuth'
import { clearAuthToken, getAuthToken } from './authTokenStore'

const baseURL =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '') ?? ''

export const apiClient = axios.create({
  baseURL: baseURL || undefined,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
})

function isPublicAuthPath(url: string | undefined): boolean {
  if (!url) return false
  return (
    url.includes('/api/users/send-otp') ||
    url.includes('/api/users/verify-otp')
  )
}

apiClient.interceptors.request.use((config) => {
  const path = config.url ?? ''
  const token = getAuthToken()
  // OTP flow uses temp token in the body; a stale session JWT must not be sent.
  if (token && !isPublicAuthPath(path)) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

apiClient.interceptors.response.use(
  (res) => res,
  (error: AxiosError) => {
    const status = error.response?.status
    if (status === 401) {
      const reqUrl = String(error.config?.url ?? '')
      const onLoginPage =
        typeof window !== 'undefined' &&
        window.location.pathname.startsWith('/login')
      const otpAuthFailure =
        onLoginPage &&
        (reqUrl.includes('/api/users/verify-otp') ||
          reqUrl.includes('/api/users/send-otp'))
      // Wrong OTP / send-otp errors: do not wipe session or force redirect.
      if (!otpAuthFailure) {
        clearAuthToken()
        clearAuthSnapshot()
        if (
          typeof window !== 'undefined' &&
          !window.location.pathname.startsWith('/login')
        ) {
          window.location.assign('/login')
        }
      }
    }
    return Promise.reject(error)
  },
)
