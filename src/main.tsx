import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ReduxProvider } from './store/ReduxProvider'
import { ToastProvider } from './contexts/ToastContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ReduxProvider>
      <ToastProvider>
        <App />
      </ToastProvider>
    </ReduxProvider>
  </StrictMode>,
)
