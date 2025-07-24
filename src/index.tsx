import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './styles/global.css'

/**
 * Application entry point with React 18 concurrent features
 * Punto di ingresso applicazione con funzionalità concorrenti React 18
 */

// Ensure the root element exists / Assicura che l'elemento root esista
const rootElement = document.getElementById('root')
if (!rootElement) {
  throw new Error('Root element not found. Make sure you have a div with id="root" in your HTML.')
}

// Create React root with concurrent features / Crea root React con funzionalità concorrenti
const root = ReactDOM.createRoot(rootElement)

// Render the app / Renderizza l'app
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)

// Hot module replacement for development / Sostituzione moduli a caldo per sviluppo
if (import.meta.hot) {
  import.meta.hot.accept()
}