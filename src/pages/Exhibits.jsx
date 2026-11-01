import { Link, useSearchParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../lib/auth.jsx'
import useLoad from '../lib/useLoad'
import Status from '../components/Status.jsx'
import ExhibitCard from '../components/ExhibitCard.jsx'

export default function Exhibits() {
  const { user } = useAuth()
  const [sp, setSp] = useSearchParams()
  const raw = sp.get('q') ?? '',
    cat = sp.get('cat') ?? ''
  const q = raw.replace(/[,()*%]/g, ' ').trim()
  const set = (k, v) => {
    const n = new URLSearchParams(sp)
    v ? n.set(k, v) : n.delete(k)
    setSp(n, { replace: true })
  }

  const cats = useLoad(
    () => supabase.from('exhibition_categories').select('*').order('name'),
    [],
  )
  const list = useLoad(() => {
    let r = supabase
      .from('exhibits')
      .select('*, exhibition_categories(name), profiles(display_name)')
      .eq('status', 'published')
      .order('year_created', { ascending: false })
    if (q)
      r = r.or(
        `title.ilike.*${q}*,technology_stack.ilike.*${q}*${/^\d{4}$/.test(q) ? `,year_created.eq.${q}` : ''}`,
      )
    if (cat) r = r.eq('category_id', cat)
    return r
  }, [q, cat])

  return (
    <>
      <div className="pagehead">
        <p className="eyebrow">Цуглуулга</p>
        <h1>Дижитал үзэсгэлэн</h1>
        <p className="muted">
          Оюутнуудын бүтээсэн төсөл, судалгаа, түүхэн үзэсгэлэнгүүд
        </p>
        {user && (
          <Link className="btn" to="/my">
            + Бүтээл нэмэх
          </Link>
        )}
      </div>
      <div className="chips">
        <div className="sbox">
          <input
            value={raw}
            onChange={(e) => set('q', e.target.value)}
            placeholder="Нэр, он, технологиор хайх…"
            aria-label="Хайх"
          />
        </div>
        <button
          className={`chip ${cat ? '' : 'on'}`}
          onClick={() => set('cat', '')}
        >
          Бүгд
        </button>
        {cats.data?.map((c) => (
          <button
            key={c.id}
            className={`chip ${cat === c.id ? 'on' : ''}`}
            onClick={() => set('cat', c.id)}
          >
            {c.name}
          </button>
        ))}
      </div>
      <Status
        s={list}
        empty="Таны хайлтад тохирох үзмэр олдсонгүй. Хайлт эсвэл ангиллаа өөрчилж үзнэ үү."
      />
      <div className="grid3">
        {list.data?.map((e) => (
          <ExhibitCard key={e.id} e={e} />
        ))}
      </div>
    </>
  )
}
