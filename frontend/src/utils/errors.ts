import axios from 'axios'

/** Extracts a user-visible message from API or thrown errors. */
export function getErrorMessage(err: unknown, fallback = 'Something went wrong'): string {
  if (axios.isAxiosError(err)) {
    const data = err.response?.data as { message?: string; error?: string } | undefined
    const msg = data?.message ?? data?.error
    if (typeof msg === 'string' && msg.trim()) return msg
    if (err.message) return err.message
    return fallback
  }
  if (err instanceof Error && err.message) return err.message
  return fallback
}
