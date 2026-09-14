import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ThemeProvider, ToastProvider } from 'pcln-design-system'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <ToastProvider>
        <App />
      </ToastProvider>
    </ThemeProvider>
  </StrictMode>,
)
