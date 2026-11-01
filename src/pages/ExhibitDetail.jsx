import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../lib/auth.jsx'
import useLoad from '../lib/useLoad'
import Status from '../components/Status.jsx'
import EntityForm from '../components/EntityForm.jsx'
import { deleteRow } from '../components/AdminTools.jsx'

const FIELDS = [
  { key: 'image_url', label: 'Зураг', type: 'image', required: true },
  { key: 'caption', label: 'Тайлбар (заавал биш)' },
]

export default function EventDetail() {
  const { id } = useParams()
  const { isAdmin } = useAuth()
  const [n, setN] = useState(0)
  const [adding, setAdding] = useState(false)
  const ev = useLoad(
    () => supabase.from('events').select('*').eq('id', id).maybeSingle(),
    [id],
  )
  const ph = useLoad(
    () => supabase.from('event_photos').select('*').eq('event_id', id),
    [id, n],
  )

  if (ev.loading || ev.error) return <Status s={ev} />
  if (!ev.data) return <p className="note">Арга хэмжээ олдсонгүй.</p>
  const e = ev.data
  return (
    <>
      <p style={{ marginTop: '2rem' }}>
        <Link to="/events" className="muted" style={{ textDecoration: 'none' }}>
          ← Арга хэмжээ рүү буцах
        </Link>
      </p>
      <article className="detail">
        <div className="frame">
          {e.cover_image_url ? (
            <img src={e.cover_image_url} alt={e.title} />
          ) : (
            <div className="xthumb">
              <div className="ph">ISM</div>
            </div>
          )}
        </div>
        <div>
          <p className="eyebrow">{e.event_date.replaceAll('-', '.')}</p>
          <h1>{e.title}</h1>
          <p className="lead">{e.description}</p>
        </div>
      </article>
      <div className="head">
        <h2>Зургийн цомог</h2>
        {isAdmin && (
          <button className="btn" onClick={() => setAdding(true)}>
            + Зураг нэмэх
          </button>
        )}
      </div>
      {adding && (
        <EntityForm
          table="event_photos"
          title="Цомогт зураг нэмэх"
          fields={FIELDS}
          extra={{ event_id: id }}
          onDone={() => {
            setAdding(false)
            setN(n + 1)
          }}
          onCancel={() => setAdding(false)}
        />
      )}
      <Status
        s={ph}
        empty="Энэ арга хэмжээнд зураг хараахан нэмэгдээгүй байна."
      />
      <div className="gal">
        {ph.data?.map((p) => (
          <figure key={p.id}>
            <a
              href={p.image_url}
              target="_blank"
              rel="noreferrer"
              title="Бүтэн хэмжээгээр нээх"
            >
              <img
                src={p.image_url}
                alt={p.caption ?? e.title}
                loading="lazy"
              />
            </a>
            {isAdmin && (
              <button
                className="x"
                onClick={async () =>
                  (await deleteRow('event_photos', p.id, 'Энэ зургийг')) &&
                  setN(n + 1)
                }
              >
                Устгах
              </button>
            )}
          </figure>
        ))}
      </div>
    </>
  )
}
