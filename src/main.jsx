import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Layout from './components/Layout.jsx'
import { RouterProvider } from 'react-router'
import { route } from './Routes.jsx'
import { useState,useEffect } from 'react'

createRoot(document.getElementById('root')).render(
  

  <StrictMode>
    <RouterProvider router={route}></RouterProvider>
    
  </StrictMode>,
)
