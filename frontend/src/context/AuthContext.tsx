/* eslint-disable react-refresh/only-export-components -- hooks exported next to provider */
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  clearAuthToken,
  setAuthToken,
  getAuthToken,
  logoutApi,
  sendOtp,
  verifyOtp,
  type AuthUser,
  type UserRole,
} from '../api'
import {
  clearAuthSnapshot,
  persistAuthSnapshot,
  readAuthSnapshot,
} from '../auth/persistAuth'

export type LoginStage = 'otp_sent' | 'logged_in'

export type LoginResult =
  | { stage: 'otp_sent' }
  | { stage: 'logged_in'; role: UserRole }

type OtpSession = {
  token: string
  email: string
  role: UserRole
}

type Session = {
  user: AuthUser | null
  token: string | null
  role: UserRole | null
}

function readInitialSession(): Session {
  const t = getAuthToken()
  const snap = readAuthSnapshot()
  if (t && snap.user && snap.role) {
    setAuthToken(t)
    return {
      token: t,
      user: snap.user,
      role: snap.role,
    }
  }
  if (!t) {
    clearAuthSnapshot()
  }
  return { token: null, user: null, role: null }
}

type AuthContextValue = {
  user: AuthUser | null
  token: string | null
  role: UserRole | null
  otpSession: OtpSession | null
  isAuthenticated: boolean
  /** Step 1: no otp → send OTP. Step 2: pass otp → verify and establish session. */
  login: (
    email: string,
    role: UserRole,
    otp?: string,
  ) => Promise<LoginResult>
  logout: () => Promise<void>
  clearOtpSession: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session>(readInitialSession)
  const [otpSession, setOtpSession] = useState<OtpSession | null>(null)

  const clearOtpSession = useCallback(() => {
    setOtpSession(null)
  }, [])

  const login = useCallback(
    async (email: string, r: UserRole, otp?: string) => {
      if (!otp) {
        const result = await sendOtp(email, r)
        setOtpSession({
          token: result.token,
          email,
          role: result.role ?? r,
        })
        return { stage: 'otp_sent' as const }
      }

      const pending = otpSession
      if (!pending?.token) {
        throw new Error('OTP session expired. Request a new code.')
      }

      const verified = await verifyOtp(otp, pending.token, pending.role)
      if (!verified.token) {
        throw new Error('Login failed: missing token')
      }

      setAuthToken(verified.token)
      setSession({
        token: verified.token,
        role: verified.role,
        user: verified.user,
      })
      if (verified.user) {
        persistAuthSnapshot(verified.user, verified.role)
      }
      setOtpSession(null)
      return { stage: 'logged_in' as const, role: verified.role }
    },
    [otpSession],
  )

  const logout = useCallback(async () => {
    try {
      await logoutApi()
    } catch {
      /* still clear local session */
    } finally {
      clearAuthToken()
      clearAuthSnapshot()
      setSession({ token: null, user: null, role: null })
      setOtpSession(null)
    }
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      user: session.user,
      token: session.token,
      role: session.role,
      otpSession,
      isAuthenticated: Boolean(
        session.token && session.user && session.role,
      ),
      login,
      logout,
      clearOtpSession,
    }),
    [session, otpSession, login, logout, clearOtpSession],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return ctx
}
