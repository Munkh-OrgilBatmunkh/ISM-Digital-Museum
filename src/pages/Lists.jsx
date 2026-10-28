import { Link, useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import useLoad from '../lib/useLoad'
import Status from '../components/Status.jsx'

export function Teachers() {
  const s = useLoad(() => supabase.from('teachers').select('*').order('name'), [])
  return (
    <>
      <h1>Тэнхимийн багш нар</h1>
      <Status s={s} empty="Багшийн мэдээлэл хараахан нэмэгдээгүй байна." />
      <div className="grid">
        {s.data?.map((t) => (
          <div className="card" key={t.id}>
            {t.photo_url ? <img src={t.photo_url} alt={t.name} loading="lazy" /> : <div className="ph">ISM</div>}
            <div className="card-b">
              <h3>{t.name}</h3>
              <p className="meta">{t.position}</p>
              {t.courses && <p className="tags">{t.courses}</p>}
              <p>{t.bio}</p>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

export function Events() {
  const s = useLoad(() => supabase.from('events').select('*').order('event_date', { ascending: false }), [])
  return (
    <>
      <h1>Өдөрлөг ба арга хэмжээ</h1>
      <Status s={s} empty="Арга хэмжээ хараахан нэмэгдээгүй байна." />
      <div className="grid">
        {s.data?.map((e) => (
          <Link to={`/events/${e.id}`} className="card" key={e.id}>
            {e.cover_image_url ? <img src={e.cover_image_url} alt={e.title} loading="lazy" /> : <div className="ph">ISM</div>}
            <div className="card-b"><h3>{e.title}</h3><p className="meta">{e.event_date}</p></div>
          </Link>
        ))}
      </div>
    </>
  )
}

export function EventDetail() {
  const { id } = useParams()
  const ev = useLoad(() => supabase.from('events').select('*').eq('id', id).maybeSingle(), [id])
  const ph = useLoad(() => supabase.from('event_photos').select('*').eq('event_id', id), [id])
  if (ev.loading || ev.error) return <Status s={ev} />
  if (!ev.data) return <p className="note">Арга хэмжээ олдсонгүй.</p>
  return (
    <>
      <h1>{ev.data.title}</h1>
      <p className="meta">{ev.data.event_date}</p>
      <p>{ev.data.description}</p>
      <h2>Зурагт цомог</h2>
      <Status s={ph} empty="Энэ арга хэмжээнд зураг хараахан нэмэгдээгүй байна." />
      <div className="gallery">
        {ph.data?.map((p) => (
          <figure key={p.id}><img src={p.image_url} alt={p.caption ?? ''} loading="lazy" /><figcaption>{p.caption}</figcaption></figure>
        ))}
      </div>
    </>
  )
}
