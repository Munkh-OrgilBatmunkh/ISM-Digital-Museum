import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import useLoad from '../lib/useLoad'
import Status from '../components/Status.jsx'
import ExhibitCard from '../components/ExhibitCard.jsx'

export default function Home() {
  const [q, setQ] = useState('')
  const nav = useNavigate()
  const latest = useLoad(() =>
    supabase.from('exhibits').select('*, exhibition_categories(name)')
      .eq('status', 'published').order('created_at', { ascending: false }).limit(6), [])

  return (
    <>
      <section className="hero">
        <h1>Тэнхимийн түүх, багш нар, бүтээлүүд — нэг музейд.</h1>
        <form onSubmit={(e) => { e.preventDefault(); nav(`/exhibits?q=${encodeURIComponent(q)}`) }}>
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Үзмэрийн нэрээр хайх…" aria-label="Хайх" />
          <button className="btn">Хайх</button>
        </form>
        <p><Link to="/timeline">ISM Time Machine-ээр он цагаар аялах</Link></p>
      </section>
      <h2>Сүүлд нэмэгдсэн үзмэрүүд</h2>
      <Status s={latest} empty="Одоогоор үзмэр байхгүй байна. Нэвтэрч эхний бүтээлээ нэмээрэй." />
      <div className="grid">{latest.data?.map((e) => <ExhibitCard key={e.id} e={e} />)}</div>
    </>
  )
}
