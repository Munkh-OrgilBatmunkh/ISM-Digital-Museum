import { useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../lib/auth.jsx'
import useLoad from '../lib/useLoad'
import Status from '../components/Status.jsx'
import EntityForm from '../components/EntityForm.jsx'
import { AdminBar, duplicateRow, deleteRow } from '../components/AdminTools.jsx'

const FIELDS = [
  { key: 'title', label: 'Гарчиг', required: true },
  { key: 'event_date', label: 'Огноо', type: 'date', required: true },
  {
    key: 'description',
    label: 'Товч тайлбар (1–2 өгүүлбэр)',
    type: 'textarea',
  },
  { key: 'cover_image_url', label: 'Зураг', type: 'image' },
]

export default function Events() {
  const { isAdmin } = useAuth()
  const [n, setN] = useState(0)
  const [edit, setEdit] = useState(null)
  const s = useLoad(
    () =>
      supabase
        .from('events')
        .select('*')
        .order('event_date', { ascending: false }),
    [n],
  )
  const refresh = () => {
    setEdit(null)
    setN((x) => x + 1)
  }

  return (
    <>
      <div className="pagehead">
        <p className="eyebrow">Манай тэнхимийн дурсамжууд</p>
        <h1>Өдөрлөг ба арга хэмжээ</h1>
        <p className="muted">Тэнхимд болсон арга хэмжээнүүд.</p>
        {isAdmin && (
          <button className="btn" onClick={() => setEdit({})}>
            + Арга хэмжээ нэмэх
          </button>
        )}
      </div>
      {edit && (
        <EntityForm
          key={edit.id ?? 'new'}
          table="events"
          title={edit.id ? 'Арга хэмжээ засах' : 'Шинэ арга хэмжээ'}
          fields={FIELDS}
          row={edit.id ? edit : null}
          onDone={refresh}
          onCancel={() => setEdit(null)}
        />
      )}
      <Status s={s} empty="Арга хэмжээ хараахан нэмэгдээгүй байна." />
      <div className="grid3">
        {s.data?.map((e) => (
          <div key={e.id}>
            <Link to={`/events/${e.id}`} className="xcard">
              <div className="xthumb">
                {e.cover_image_url ? (
                  <img src={e.cover_image_url} alt={e.title} loading="lazy" />
                ) : (
                  <div className="ph">ISM</div>
                )}
              </div>
              <p className="eyebrow" style={{ margin: 0 }}>
                {e.event_date.replaceAll('-', '.')}
              </p>
              <h3>{e.title}</h3>
              {e.description && <p className="desc">{e.description}</p>}
            </Link>
            {isAdmin && (
              <AdminBar
                onEdit={() => setEdit(e)}
                onDuplicate={async () => {
                  await duplicateRow('events', e, 'title')
                  refresh()
                }}
                onDelete={async () =>
                  (await deleteRow('events', e.id, 'Энэ арга хэмжээг')) &&
                  refresh()
                }
              />
            )}
          </div>
        ))}
      </div>
    </>
  )
}
