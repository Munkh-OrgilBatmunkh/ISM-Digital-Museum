import { useState } from 'react'
import { supabase } from '../lib/supabase'
import useLoad from '../lib/useLoad'
import Status from '../components/Status.jsx'
import Tags from '../components/Tags.jsx'

export function Teachers() {
  const s = useLoad(() => supabase.from('teachers').select('*').order('name'), [])
  return (
    <>
      <div className="pagehead"><p className="eyebrow">Хүмүүс</p><h1>Тэнхимийн багш нар</h1></div>
      <Status s={s} empty="Багшийн мэдээлэл хараахан нэмэгдээгүй байна." />
      <div className="grid3" style={{ gridTemplateColumns: 'repeat(auto-fill,minmax(250px,1fr))' }}>
        {s.data?.map((t) => (
          <div className="tcard" key={t.id}>
            <div className="xthumb">{t.photo_url ? <img src={t.photo_url} alt={t.name} loading="lazy" /> : <div className="ph">{t.name.split(/[ .]+/).filter(Boolean).map((w) => w[0]).join('').slice(0, 2)}</div>}</div>
            <h3>{t.name}</h3>
            <p className="muted" style={{ margin: '.2rem 0' }}>{t.position}</p>
            <Tags value={t.courses} />
            {t.bio && <p style={{ fontSize: '.92rem' }}>{t.bio}</p>}
          </div>
        ))}
      </div>
    </>
  )
}

export function Events() {
  const [sel, setSel] = useState(null)
  const ev = useLoad(() => supabase.from('events').select('*').order('event_date', { ascending: false }), [])
  const ph = useLoad(() => supabase.from('event_photos').select('*'), [])
  const cur = ev.data?.find((e) => e.id === sel) ?? ev.data?.[0]
  const photos = ph.data?.filter((p) => p.event_id === cur?.id) ?? []
  const count = (id) => ph.data?.filter((p) => p.event_id === id).length ?? 0

  return (
    <>
      <div className="pagehead"><p className="eyebrow">Дурсамж</p><h1>Өдөрлөг ба арга хэмжээ</h1></div>
      <Status s={ev} empty="Арга хэмжээ хараахан нэмэгдээгүй байна." />
      {cur && (
        <>
          <div className="evhero" style={{ backgroundImage: `url(${cur.cover_image_url ?? photos[0]?.image_url ?? ''})` }}>
            <div><small>{cur.event_date.replaceAll('-', '.')} · {photos.length} ЗУРАГ</small><h2 style={{ margin: '.3rem 0 0' }}>{cur.title}</h2>{cur.description && <p>{cur.description}</p>}</div>
          </div>
          <h2>Зурагт цомог</h2>
          <Status s={ph} />
          {!ph.loading && photos.length === 0 && <p className="note">Энэ арга хэмжээнд зураг хараахан нэмэгдээгүй байна.</p>}
          <div className="gal">{photos.map((p) => <img key={p.id} src={p.image_url} alt={p.caption ?? cur.title} loading="lazy" />)}</div>
          {ev.data.length > 1 && <h2>Бусад арга хэмжээ</h2>}
          {ev.data.filter((e) => e.id !== cur.id).map((e) => (
            <button key={e.id} className="prev" onClick={() => { setSel(e.id); window.scrollTo({ top: 0, behavior: 'smooth' }) }}>
              {e.cover_image_url ? <img src={e.cover_image_url} alt="" /> : <div className="pt" />}
              <div><h3>{e.title}</h3><span className="muted">{count(e.id)} зураг</span></div>
              <time>{e.event_date.replaceAll('-', '.')}</time>
            </button>
          ))}
        </>
      )}
    </>
  )
}
