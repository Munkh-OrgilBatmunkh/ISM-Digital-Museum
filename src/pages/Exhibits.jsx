import { useSearchParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import useLoad from '../lib/useLoad'
import Status from '../components/Status.jsx'
import ExhibitCard from '../components/ExhibitCard.jsx'

export default function Exhibits() {
  const [sp, setSp] = useSearchParams()
  const q = sp.get('q') ?? '', cat = sp.get('cat') ?? '', tech = sp.get('tech') ?? '', year = sp.get('year') ?? ''
  const set = (k, v) => { const n = new URLSearchParams(sp); v ? n.set(k, v) : n.delete(k); setSp(n, { replace: true }) }

  const cats = useLoad(() => supabase.from('exhibition_categories').select('*').order('name'), [])
  const list = useLoad(() => {
    let r = supabase.from('exhibits').select('*, exhibition_categories(name)')
      .eq('status', 'published').order('year_created', { ascending: false })
    if (q.trim()) r = r.ilike('title', `%${q.trim()}%`)
    if (cat) r = r.eq('category_id', cat)
    if (tech.trim()) r = r.ilike('technology_stack', `%${tech.trim()}%`)
    if (year) r = r.eq('year_created', Number(year))
    return r
  }, [q, cat, tech, year])

  return (
    <>
      <h1>Дижитал үзэсгэлэн</h1>
      <div className="filters">
        <input value={q} onChange={(e) => set('q', e.target.value)} placeholder="Нэрээр хайх" aria-label="Нэр" />
        <select value={cat} onChange={(e) => set('cat', e.target.value)} aria-label="Ангилал">
          <option value="">Бүх ангилал</option>
          {cats.data?.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <input value={tech} onChange={(e) => set('tech', e.target.value)} placeholder="Технологи (React…)" aria-label="Технологи" />
        <input type="number" value={year} onChange={(e) => set('year', e.target.value)} placeholder="Он" aria-label="Он" />
      </div>
      <Status s={list} empty="Таны хайлтад тохирох үзмэр олдсонгүй. Шүүлтүүрээ өөрчилж үзнэ үү." />
      <div className="grid">{list.data?.map((e) => <ExhibitCard key={e.id} e={e} />)}</div>
    </>
  )
}
