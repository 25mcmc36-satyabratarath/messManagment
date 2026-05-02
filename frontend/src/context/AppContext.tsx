/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

type AppContextValue = {
  loading: boolean
  setLoading: (v: boolean) => void
  error: string | null
  setError: (v: string | null) => void
}

const AppContext = createContext<AppContextValue | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [loading, setLoadingState] = useState(false)
  const [error, setErrorState] = useState<string | null>(null)

  const setLoading = useCallback((v: boolean) => {
    setLoadingState(v)
  }, [])

  const setError = useCallback((v: string | null) => {
    setErrorState(v)
  }, [])

  const value = useMemo(
    () => ({
      loading,
      setLoading,
      error,
      setError,
    }),
    [loading, setLoading, error, setError],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext)
  if (!ctx) {
    throw new Error('useApp must be used within AppProvider')
  }
  return ctx
}
