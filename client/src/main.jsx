import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from './routers'
import './index.css'
import { AlertManagerProvider } from './components/AlertManager'

ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
    <AlertManagerProvider>
      <RouterProvider />
    </AlertManagerProvider>
  // </React.StrictMode>,
)
