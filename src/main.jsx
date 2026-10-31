import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import { AuthProvider } from './lib/auth.jsx'
import { envOk } from './lib/supabase'
import './styles.css'

createRoot(document.getElementById('root')).render(
  envOk ? (
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  ) : (
    <div style={{ padding: '2rem', maxWidth: 600, fontFamily: 'sans-serif' }}>
      <h1>.env тохиргоо дутуу байна</h1>
      <p>
        Төслийн үндсэн хавтсанд <code>.env</code> файл үүсгээд{' '}
        <code>VITE_SUPABASE_URL</code> болон <code>VITE_SUPABASE_ANON_KEY</code>
        -г бөглөнө, дараа нь <code>npm run dev</code>-ийг дахин асаана. Vercel
        дээр бол Settings → Environment Variables-д нэмээд дахин Deploy хийнэ.
      </p>
    </div>
  ),
)
