import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import useLoad from '../lib/useLoad'
import { useTimelineItems } from '../lib/timeline'
import Status from '../components/Status.jsx'
import ExhibitCard from '../components/ExhibitCard.jsx'

const FOUNDED = 1993 // тэнхим байгуулагдсан он — өөрийн мэдээллээр солино

export default function Home() {
  const latest = useLoad(() =>
    supabase.from('exhibits').select('*, exhibition_categories(name), profiles(display_name)')
      .eq('status', 'published').order('created_at', { ascending: false }).limit(3), [])
  const counts = useLoad(async () => {
    const c = (t) => supabase.from(t).select('*', { count: 'exact', head: true })
    const [a, b, d] = await Promise.all([c('exhibits'), c('teachers'), c('events')])
    return { data: { ex: a.count, te: b.count, ev: d.count }, error: a.error || b.error || d.error }
  }, [])
  const { items } = useTimelineItems()
  const years = [...new Map(items.sort((a, b) => a.year - b.year).map((i) => [i.year, i])).values()].slice(0, 8)
  const hero = latest.data?.find((e) => e.image_url)

  return (
    <>
      <section className="hero">
        <div>
          <span className="tag">МСМ ТЭНХИМ · EST. {FOUNDED}</span>
          <h1>Тэнхимийн түүх <span>нэг дор!</span></h1>
          <p>Багш нар · Арга хэмжээ · Оюутны бүтээл</p>
          <div className="row">
            <Link className="btn yellow" to="/exhibits">Үзэсгэлэн үзэх</Link>
            <Link className="btn line" to="/timeline">Time Machine →</Link>
          </div>
        </div>
        {hero && <img src={hero.image_url} alt={hero.title} />}
      </section>
      <div className="stats">
        <div><b>{counts.data?.ex ?? '–'}</b>Үзмэр</div>
        <div><b>{counts.data?.te ?? '–'}</b>Багш</div>
        <div><b>{new Date().getFullYear() - FOUNDED}</b>Жил</div>
        <div><b>{counts.data?.ev ?? '–'}</b>Арга хэмжээ</div>
      </div>
      <div className="head"><div><p className="eyebrow" style={{ marginTop: '3rem' }}>Онцлох</p><h2 style={{ margin: 0 }}>Шинэ үзмэрүүд</h2></div><Link to="/exhibits">Бүгдийг үзэх →</Link></div>
      <Status s={latest} empty="Одоогоор үзмэр байхгүй байна. Нэвтэрч эхний бүтээлээ нэмээрэй." />
      <div className="feat" style={{ marginTop: '1.5rem' }}>
        {latest.data?.[0] && <ExhibitCard e={latest.data[0]} big />}
        <div className="side">{latest.data?.slice(1).map((e) => <ExhibitCard key={e.id} e={e} />)}</div>
      </div>
      {years.length > 0 && (
        <>
          <p className="eyebrow" style={{ marginTop: '3.5rem' }}>ISM Time Machine</p>
          <h2 style={{ margin: '0 0 1.2rem' }}>{new Date().getFullYear() - FOUNDED} жилийн аялал</h2>
          <div className="tl-strip">
            {years.map((i) => <Link key={i.year} to="/timeline"><b>{i.year}</b>{i.title}</Link>)}
          </div>
        </>
      )}
    </>
  )
}
