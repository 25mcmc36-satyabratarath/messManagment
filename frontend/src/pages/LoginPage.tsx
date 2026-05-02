import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import type { UserRole } from '../api/types'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { Form, type FormFieldConfig } from '../components/Form'
import { Card } from '../components/Card'
import { ErrorBanner } from '../components/ErrorBanner'
import { postLoginPath } from '../routes/dashboardPaths'
import { getErrorMessage } from '../utils/errors'
import styles from './LoginPage.module.css'

const ROLE_OPTIONS: { value: UserRole; label: string }[] = [
  { value: 'STUDENT', label: 'Student' },
  { value: 'MESS_SECRETARY', label: 'Mess secretary' },
  { value: 'CARE_TAKER', label: 'Care taker' },
  { value: 'MESS_SUPERVISOR', label: 'Mess supervisor' },
  { value: 'WARDEN', label: 'Warden' },
]

const emailFields: FormFieldConfig[] = [
  {
    name: 'email',
    label: 'University email',
    type: 'email',
    required: true,
    placeholder: 'you@uohyd.ac.in',
  },
  {
    name: 'role',
    label: 'Role',
    type: 'select',
    required: true,
    options: ROLE_OPTIONS.map((r) => ({ value: r.value, label: r.label })),
  },
]

export function LoginPage() {
  const { login, otpSession, clearOtpSession, isAuthenticated, role } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()
  const location = useLocation()
  const from =
    (location.state as { from?: { pathname?: string } } | null)?.from?.pathname ??
    null

  const [error, setError] = useState<string | null>(null)
  const [otp, setOtp] = useState('')
  const [sending, setSending] = useState(false)
  const [verifying, setVerifying] = useState(false)

  useEffect(() => {
    if (isAuthenticated && role) {
      navigate(postLoginPath(from, role), { replace: true })
    }
  }, [isAuthenticated, role, navigate, from])

  const handleRequestOtp = async (values: Record<string, string>) => {
    setError(null)
    setSending(true)
    try {
      await login(values.email.trim(), values.role as UserRole)
      showToast('OTP sent to your email.', 'success')
    } catch (e) {
      setError(getErrorMessage(e, 'Could not send OTP'))
      clearOtpSession()
    } finally {
      setSending(false)
    }
  }

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!otpSession) {
      setError('Request an OTP first.')
      return
    }
    if (!/^\d{4,8}$/.test(otp.trim())) {
      setError('Enter the OTP you received (digits only).')
      return
    }
    setError(null)
    setVerifying(true)
    try {
      const result = await login(
        otpSession.email,
        otpSession.role,
        otp.trim(),
      )
      if (result.stage === 'logged_in') {
        showToast('Signed in successfully.', 'success')
        navigate(postLoginPath(from, result.role), { replace: true })
      }
    } catch (err) {
      setError(getErrorMessage(err, 'Verification failed'))
    } finally {
      setVerifying(false)
    }
  }

  const resetFlow = () => {
    clearOtpSession()
    setOtp('')
    setError(null)
  }

  return (
    <div className={styles.page}>
      <div className={styles.panel}>
        <h1 className={styles.heading}>Hostel mess</h1>
        <p className={styles.lead}>Sign in with your email and OTP.</p>

        <ErrorBanner message={error} onDismiss={() => setError(null)} />

        <Card title={otpSession ? 'Enter OTP' : 'Request OTP'}>
          {!otpSession ? (
            <Form
              id="login-email"
              fields={emailFields}
              initialValues={{ role: 'STUDENT' }}
              onSubmit={handleRequestOtp}
              submitLabel={sending ? 'Sending…' : 'Send OTP'}
              disabled={sending}
            />
          ) : (
            <form className={styles.otpForm} onSubmit={handleVerify}>
              <p className={styles.hint}>
                We sent a code to <strong>{otpSession.email}</strong> for role{' '}
                <strong>{otpSession.role}</strong>.
              </p>
              <label className={styles.otpLabel} htmlFor="otp-input">
                One-time password
              </label>
              <input
                id="otp-input"
                className={styles.otpInput}
                inputMode="numeric"
                autoComplete="one-time-code"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                placeholder="123456"
                maxLength={8}
                disabled={verifying}
              />
              <div className={styles.otpActions}>
                <button
                  type="submit"
                  className={styles.primary}
                  disabled={verifying}
                >
                  {verifying ? 'Verifying…' : 'Verify & sign in'}
                </button>
                <button
                  type="button"
                  className={styles.secondary}
                  onClick={resetFlow}
                  disabled={verifying}
                >
                  Start over
                </button>
              </div>
            </form>
          )}
        </Card>
      </div>
    </div>
  )
}
