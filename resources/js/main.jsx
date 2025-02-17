// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import React from 'react'
import '../css/index.css'
import App from './components/App.jsx'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
