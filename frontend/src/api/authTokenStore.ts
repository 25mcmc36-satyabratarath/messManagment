/**
 * Bridges AuthContext and the Axios instance: interceptors read the latest JWT
 * without importing React. Updated on login, logout, and hydration from storage.
 */
const STORAGE_KEY = 'mess_auth_token'

let memoryToken: string | null = null

export function setAuthToken(token: string | null): void {
  memoryToken = token
  if (token) {
    try {
      localStorage.setItem(STORAGE_KEY, token)
    } catch {
      /* ignore quota / private mode */
    }
  } else {
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch {
      /* ignore */
    }
  }
}

export function getAuthToken(): string | null {
  if (memoryToken) return memoryToken
  try {
    return localStorage.getItem(STORAGE_KEY)
  } catch {
    return null
  }
}

export function clearAuthToken(): void {
  memoryToken = null
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    /* ignore */
  }
}
