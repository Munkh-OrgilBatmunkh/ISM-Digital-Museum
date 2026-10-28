import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function Login() {
  const [mode, setMode] = useState('in')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [msg, setMsg] = useState('')
  const nav = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    setMsg('')
    if (password.length < 6) return setMsg('Нууц үг дор хаяж 6 тэмдэгт байна.')
    if (mode === 'up') {
      const { data, error } = await supabase.auth.signUp({ email, password, options: { data: { display_name: name || email.split('@')[0] } } })
      if (error) return setMsg(error.message)
      return data.session ? nav('/exhibits') : setMsg('Бүртгэл амжилттай. И-мэйлээ баталгаажуулаад нэвтэрнэ үү.')
    }
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    error ? setMsg('И-мэйл эсвэл нууц үг буруу байна.') : nav('/exhibits')
  }

  return (
    <form className="form" onSubmit={submit}>
      <h1>{mode === 'in' ? 'Нэвтрэх' : 'Бүртгүүлэх'}</h1>
      {mode === 'up' && <label>Нэр<input value={name} onChange={(e) => setName(e.target.value)} /></label>}
      <label>И-мэйл<input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} /></label>
      <label>Нууц үг<input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} /></label>
      {msg && <p className="err">{msg}</p>}
      <button className="btn">{mode === 'in' ? 'Нэвтрэх' : 'Бүртгүүлэх'}</button>
      <button type="button" className="btn ghost" onClick={() => setMode(mode === 'in' ? 'up' : 'in')}>
        {mode === 'in' ? 'Бүртгэл үүсгэх' : 'Бүртгэлтэй бол нэвтрэх'}
      </button>
    </form>
  )
}
