import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import useLoad from '../lib/useLoad'
import Status from '../components/Status.jsx'
import ExhibitCard from '../components/ExhibitCard.jsx'
import MemoryCard from '../components/MemoryCard.jsx'
import LetterCard from '../components/LetterCard.jsx'
import Carousel from '../components/Carousel.jsx'

const TILES = [
  ['/exhibits', 'Үзэсгэлэн', 'Оюутнуудын бүтээл, төслүүдийг үзэх'],
  [
    '/capsule',
    'Time Capsule',
    'Ирээдүйн оюутанд захидал бичих, дурсамж үлдээх',
  ],
  ['/timeline', 'Time Machine', 'Тэнхимийн түүхийг он цагаар үзэх'],
  ['/teachers', 'Багш нар', 'Тэнхимийн багш нартай танилцах'],
  ['/events', 'Арга хэмжээ', 'Өдөрлөг, уулзалтын зургууд'],
]

export default function Home() {
  const exhibits = useLoad(
    () =>
      supabase
        .from('exhibits')
        .select('*, exhibition_categories(name), profiles(display_name)')
        .eq('status', 'published')
        .order('created_at', { ascending: false })
        .limit(3),
    [],
  )
  const memories = useLoad(
    () =>
      supabase
        .from('capsule_memories')
        .select('*, profiles(display_name)')
        .order('created_at', { ascending: false })
        .limit(3),
    [],
  )
  const letters = useLoad(
    () =>
      supabase
        .from('capsule_letters')
        .select('*, profiles(display_name)')
        .order('created_at', { ascending: false })
        .limit(3),
    [],
  )
  const evs = useLoad(
    () =>
      supabase
        .from('events')
        .select('id,title,cover_image_url')
        .order('event_date', { ascending: false }),
    [],
  )
  const photos = useLoad(
    () => supabase.from('event_photos').select('id,event_id,image_url'),
    [],
  )
  const counts = useLoad(async () => {
    const c = (t) =>
      supabase.from(t).select('*', { count: 'exact', head: true })
    const [a, b, d, t, e] = await Promise.all([
      c('exhibits'),
      c('capsule_letters'),
      c('capsule_memories'),
      c('teachers'),
      c('events'),
    ])
    return {
      data: { ex: a.count, le: b.count, me: d.count, te: t.count, ev: e.count },
      error: a.error || b.error || d.error || t.error || e.error,
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

  const slides = (evs.data ?? [])
    .flatMap((e) => [
      ...(e.cover_image_url
        ? [
            {
              key: 'c' + e.id,
              image: e.cover_image_url,
              title: e.title,
              to: `/events/${e.id}`,
            },
          ]
        : []),
      ...(photos.data ?? [])
        .filter((p) => p.event_id === e.id)
        .map((p) => ({
          key: 'p' + p.id,
          image: p.image_url,
          title: e.title,
          to: `/events/${e.id}`,
        })),
    ])
    .slice(0, 8)
  const loaded = !evs.loading && !photos.loading

  return (
    <>
      <section className="hero">
        <div>
          <h1>
            Тавтай морил! <span>Тэнхимийн түүх нэг дор.</span>
          </h1>
          <p>
            Оюутнуудын бүтээл, тэнхимийн түүх, багш нар, арга хэмжээг үзэж,
            ирээдүйн оюутнуудад зориулж захидал, дурсамжаа үлдээгээрэй.
          </p>
          <div className="row">
            <Link className="btn" to="/exhibits">
              Үзэсгэлэн үзэх
            </Link>
            <Link className="btn line" to="/capsule">
              Time Capsule →
            </Link>
          </div>
        </div>
        <Carousel
          slides={slides}
          emptyText={
            loaded ? 'Арга хэмжээний зураг нэмэгдмэгц энд харагдана.' : ''
          }
        />
      </section>
      <div className="stats">
        <div>
          <b>{counts.data?.ex ?? '–'}</b>Үзэсгэлэн
        </div>
        <div>
          <b>{counts.data?.le ?? '–'}</b>Захидал
        </div>
        <div>
          <b>{counts.data?.me ?? '–'}</b>Дурсамж
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
        <h2>Шинэ үзэсгэлэнгүүд</h2>
        <Link to="/exhibits">Бүгдийг үзэх →</Link>
      </div>
      <Status
        s={exhibits}
        empty="Одоогоор үзмэр байхгүй байна. Нэвтэрч эхний бүтээлээ нэмээрэй."
      />
      <div className="grid3">
        {exhibits.data?.map((e) => (
          <ExhibitCard key={e.id} e={e} />
        ))}
      </div>

      <div className="head">
        <h2>Time Capsule - дурсамжууд</h2>
        <Link to="/capsule?tab=memories">Бүгдийг үзэх →</Link>
      </div>
      <Status
        s={memories}
        empty="Одоогоор дурсамж алга. Нэвтэрч эхний дурсамжаа нэмээрэй."
      />
      <div className="grid3">
        {memories.data?.map((m) => (
          <MemoryCard key={m.id} m={m} />
        ))}
      </div>

      <div className="head">
        <h2>Time Capsule - захидлууд</h2>
        <Link to="/capsule">Бүгдийг үзэх →</Link>
      </div>
      <Status
        s={letters}
        empty="Одоогоор захидал алга. Ирээдүйн оюутанд эхний захидлыг та бичээрэй."
      />
      <div className="lgrid">
        {letters.data?.map((l) => (
          <LetterCard key={l.id} l={l} />
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
