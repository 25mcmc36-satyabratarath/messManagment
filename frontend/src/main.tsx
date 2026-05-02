import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import { AppProvider } from './context/AppContext.tsx'
import { AuthProvider } from './context/AuthContext.tsx'
import { ToastProvider } from './context/ToastContext.tsx'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <AppProvider>
        <ToastProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </ToastProvider>
      </AppProvider>
    </AuthProvider>
  </StrictMode>,
)
