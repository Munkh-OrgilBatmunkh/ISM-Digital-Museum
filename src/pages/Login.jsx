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
      return data.session ? nav('/my') : setMsg('Бүртгэл амжилттай. И-мэйлээ баталгаажуулаад нэвтэрнэ үү.')
    }
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    error ? setMsg('И-мэйл эсвэл нууц үг буруу байна.') : nav('/my')
  }

  return (
    <div className="split">
      <div className="pic" style={{ backgroundImage: 'linear-gradient(rgba(5,20,51,.55),rgba(5,20,51,.85)),url(/images/compaq.jpg)' }}>
        <h2>“Бүтээл бүр тэнхимийн түүхийн нэг хуудас.”</h2>
      </div>
      <form onSubmit={submit}>
        <div><p className="eyebrow">ISM Creators</p><h1 style={{ fontSize: '2.8rem' }}>{mode === 'in' ? 'Тавтай морил' : 'Бүртгүүлэх'}</h1></div>
        {mode === 'up' && <input placeholder="Нэр" value={name} onChange={(e) => setName(e.target.value)} />}
        <input type="email" required placeholder="И-мэйл" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" required placeholder="Нууц үг" value={password} onChange={(e) => setPassword(e.target.value)} />
        {msg && <p className="err">{msg}</p>}
        <button className="btn block">{mode === 'in' ? 'Нэвтрэх' : 'Бүртгүүлэх'}</button>
        <button type="button" className="linkbtn muted" style={{ textAlign: 'left' }} onClick={() => setMode(mode === 'in' ? 'up' : 'in')}>
          {mode === 'in' ? 'Бүртгэлгүй юу? Бүртгүүлэх' : 'Бүртгэлтэй юу? Нэвтрэх'}
        </button>
      </form>
    </div>
  )
}
