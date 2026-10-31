import { useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../lib/auth.jsx'

// Supabase-ийн англи алдааг ойлгомжтой Монгол мессеж болгоно
function explain(m = '') {
  const t = m.toLowerCase()
  if (t.includes('invalid login')) return 'И-мэйл эсвэл нууц үг буруу байна.'
  if (t.includes('not confirmed'))
    return 'И-мэйл хаяг баталгаажаагүй байна. Ирсэн и-мэйлийн баталгаажуулах линкийг дарна уу.'
  if (t.includes('rate limit') || t.includes('too many'))
    return 'Хэт олон оролдлого хийлээ. Хэдэн минутын дараа дахин оролдоно уу.'
  if (t.includes('already registered'))
    return 'Энэ и-мэйл бүртгэлтэй байна. Нэвтэрнэ үү.'
  if (t.includes('database error'))
    return 'Бүртгэл үүсгэхэд өгөгдлийн сангийн алдаа гарлаа. schema.sql зөв ажилласан эсэхийг шалгана уу.'
  if (t.includes('password')) return 'Нууц үг дор хаяж 6 тэмдэгт байна.'
  if (t.includes('invalid email') || t.includes('valid email'))
    return 'И-мэйл хаяг буруу байна.'
  if (t.includes('fetch') || t.includes('network'))
    return 'Supabase-тэй холбогдож чадсангүй. .env доторх URL, түлхүүрийг шалгана уу.'
  return m
}

export default function Login() {
  const { user } = useAuth()
  const from = useLocation().state?.from ?? '/'
  const [mode, setMode] = useState('in')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [msg, setMsg] = useState(null) // { text, ok }
  const [busy, setBusy] = useState(false)

  // Нэвтэрсэн бол шууд буцаана (нэвтэрсний дараа ч энэ ажиллана)
  if (user) return <Navigate to={from} replace />

  const submit = async (e) => {
    e.preventDefault()
    setMsg(null)
    const mail = email.trim()
    if (password.length < 6)
      return setMsg({ text: 'Нууц үг дор хаяж 6 тэмдэгт байна.' })
    setBusy(true)
    try {
      if (mode === 'up') {
        const { data, error } = await supabase.auth.signUp({
          email: mail,
          password,
          options: {
            data: { display_name: name.trim() || mail.split('@')[0] },
            emailRedirectTo: window.location.origin,
          },
        })
        if (error) return setMsg({ text: explain(error.message) })
        if (data.user && data.user.identities?.length === 0)
          return setMsg({ text: 'Энэ и-мэйл бүртгэлтэй байна. Нэвтэрнэ үү.' })
        if (!data.session) {
          setMode('in')
          return setMsg({
            ok: true,
            text: 'Бүртгэл амжилттай. И-мэйлээ шалгаад баталгаажуулах линкийг дараад нэвтэрнэ үү.',
          })
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: mail,
          password,
        })
        if (error) return setMsg({ text: explain(error.message) })
      }
    } catch (err) {
      setMsg({ text: explain(String(err?.message ?? err)) })
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="split">
      <div
        className="pic"
        style={{
          backgroundImage:
            'linear-gradient(rgba(12,31,74,.55),rgba(12,31,74,.85)),url(/images/compaq.jpg)',
        }}
      >
        <h2>“Бүтээл бүр тэнхимийн түүхийн нэг хуудас.”</h2>
      </div>
      <form onSubmit={submit}>
        <div>
          <p className="eyebrow">ISM Creators</p>
          <h1>{mode === 'in' ? 'Тавтай морил' : 'Бүртгүүлэх'}</h1>
        </div>
        {mode === 'up' && (
          <input
            placeholder="Нэр"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
          />
        )}
        <input
          type="email"
          required
          placeholder="И-мэйл"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
        />
        <input
          type="password"
          required
          placeholder="Нууц үг (6+ тэмдэгт)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete={mode === 'in' ? 'current-password' : 'new-password'}
        />
        {msg && (
          <p className={msg.ok ? 'note' : 'err'} role="alert">
            {msg.text}
          </p>
        )}
        <button className="btn block" disabled={busy}>
          {busy ? 'Түр хүлээнэ үү…' : mode === 'in' ? 'Нэвтрэх' : 'Бүртгүүлэх'}
        </button>
        <button
          type="button"
          className="linkbtn"
          style={{ textAlign: 'left' }}
          onClick={() => {
            setMode(mode === 'in' ? 'up' : 'in')
            setMsg(null)
          }}
        >
          {mode === 'in'
            ? 'Бүртгэлгүй юу? Бүртгүүлэх'
            : 'Бүртгэлтэй юу? Нэвтрэх'}
        </button>
      </form>
    </div>
  )
}
