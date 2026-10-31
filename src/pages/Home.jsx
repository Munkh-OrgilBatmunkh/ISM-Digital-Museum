import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import useLoad from '../lib/useLoad'
import Status from '../components/Status.jsx'
import ExhibitCard from '../components/ExhibitCard.jsx'
import Carousel from '../components/Carousel.jsx'

const TILES = [
  ['/exhibits', 'Үзэсгэлэн', 'Оюутнуудын бүтээл, төслүүдийг үзэх'],
  ['/teachers', 'Багш нар', 'Тэнхимийн багш нартай танилцах'],
  ['/events', 'Арга хэмжээ', 'Өдөрлөг, уулзалтын зургууд'],
  ['/timeline', 'Time Machine', 'Тэнхимийн түүхийг он цагаар үзэх'],
]

// Өгөгдөл байхгүй үед харуулах локал зургууд (public/images/)
const FALLBACK = [
  {
    key: 'f1',
    image: '/images/dashboard.jpg',
    title: 'Оюутны бүтээлүүд',
    to: '/exhibits',
  },
  {
    key: 'f2',
    image: '/images/compaq.jpg',
    title: 'Тэнхимийн түүх',
    to: '/timeline',
  },
  {
    key: 'f3',
    image: '/images/ecotrack.jpg',
    title: 'Арга хэмжээ',
    to: '/events',
  },
]

export default function Home() {
  const latest = useLoad(
    () =>
      supabase
        .from('exhibits')
        .select('*, exhibition_categories(name), profiles(display_name)')
        .eq('status', 'published')
        .order('created_at', { ascending: false })
        .limit(3),
    [],
  )
  const counts = useLoad(async () => {
    const c = (t) =>
      supabase.from(t).select('*', { count: 'exact', head: true })
    const [a, b, d] = await Promise.all([
      c('exhibits'),
      c('teachers'),
      c('events'),
    ])
    return {
      data: { ex: a.count, te: b.count, ev: d.count },
      error: a.error || b.error || d.error,
    }
  }, [])
  const years = useLoad(
    () =>
      supabase
        .from('timeline_events')
        .select('id,year,title')
        .order('year')
        .limit(8),
    [],
  )
  const evs = useLoad(
    () =>
      supabase
        .from('events')
        .select('id,title,cover_image_url')
        .not('cover_image_url', 'is', null)
        .order('event_date', { ascending: false })
        .limit(3),
    [],
  )
  const slides = [
    ...(latest.data ?? [])
      .filter((e) => e.image_url)
      .map((e) => ({
        key: 'x' + e.id,
        image: e.image_url,
        title: e.title,
        to: `/exhibits/${e.id}`,
      })),
    ...(evs.data ?? []).map((e) => ({
      key: 'e' + e.id,
      image: e.cover_image_url,
      title: e.title,
      to: `/events/${e.id}`,
    })),
  ]
  const loaded = !latest.loading && !evs.loading
  const list =
    loaded || slides.length
      ? [...slides, ...FALLBACK.slice(0, Math.max(0, 3 - slides.length))]
      : []

  return (
    <>
      <section className="hero">
        <div>
          <h1>
            Тавтай морил! <span>Тэнхимийн түүх нэг дор.</span>
          </h1>
          <p>
            Энд тэнхимийн багш нар, түүхэн үйл явдал, арга хэмжээ, оюутнуудын
            бүтээлийг нэг дороос үзнэ.
          </p>
          <div className="row">
            <Link className="btn" to="/exhibits">
              Үзэсгэлэн үзэх
            </Link>
            <Link className="btn line" to="/timeline">
              Time Machine →
            </Link>
          </div>
        </div>
        <Carousel slides={list} />
      </section>
      <div className="stats">
        <div>
          <b>{counts.data?.ex ?? '–'}</b>Үзмэр
        </div>
        <div>
          <b>{counts.data?.te ?? '–'}</b>Багш
        </div>
        <div>
          <b>{counts.data?.ev ?? '–'}</b>Арга хэмжээ
        </div>
      </div>
      <h2>Эндээс эхлээрэй</h2>
      <div className="tiles">
        {TILES.map(([to, t, d]) => (
          <Link key={to} to={to} className="tile">
            <b>{t}</b>
            <span>{d}</span>
          </Link>
        ))}
      </div>
      <div className="head">
        <h2>Шинэ үзмэрүүд</h2>
        <Link to="/exhibits">Бүгдийг үзэх →</Link>
      </div>
      <Status
        s={latest}
        empty="Одоогоор үзмэр байхгүй байна. Нэвтэрч эхний бүтээлээ нэмээрэй."
      />
      <div className="grid3">
        {latest.data?.map((e) => (
          <ExhibitCard key={e.id} e={e} />
        ))}
      </div>
      {years.data?.length > 0 && (
        <>
          <div className="head">
            <h2>Time Machine</h2>
            <Link to="/timeline">Бүгдийг үзэх →</Link>
          </div>
          <div className="tl-strip">
            {years.data.map((t) => (
              <Link key={t.id} to="/timeline">
                <b>{t.year}</b>
                {t.title}
              </Link>
            ))}
          </div>
        </>
      )}
    </>
  )
}
