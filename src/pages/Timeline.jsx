import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../lib/auth.jsx'
import useLoad from '../lib/useLoad'
import Status from '../components/Status.jsx'
import EntityForm from '../components/EntityForm.jsx'
import { AdminBar, duplicateRow, deleteRow } from '../components/AdminTools.jsx'

const FIELDS = [
  { key: 'year', label: 'Он', type: 'number', required: true },
  { key: 'title', label: 'Гарчиг', required: true },
  { key: 'description', label: 'Товч тайлбар', type: 'textarea' },
  { key: 'image_url', label: 'Зураг (заавал биш)', type: 'image' },
]

export default function Timeline() {
  const { isAdmin } = useAuth()
  const [n, setN] = useState(0)
  const [edit, setEdit] = useState(null)
  const s = useLoad(
    () =>
      supabase
        .from('timeline_events')
        .select('*')
        .order('year')
        .order('created_at'),
    [n],
  )
  const refresh = () => {
    setEdit(null)
    setN((x) => x + 1)
  }

  return (
    <>
      <div className="pagehead">
        <p className="eyebrow">ISM Time Machine</p>
        <h1>Тэнхимийн түүх</h1>
        <p className="muted">
          Тэнхимийн чухал үйл явдлуудыг он цагийн дарааллаар доош гүйлгэн
          үзээрэй.
        </p>
        {isAdmin && (
          <button className="btn" onClick={() => setEdit({})}>
            + Үйл явдал нэмэх
          </button>
        )}
      </div>
      {edit && (
        <EntityForm
          key={edit.id ?? 'new'}
          table="timeline_events"
          title={edit.id ? 'Үйл явдал засах' : 'Шинэ үйл явдал'}
          fields={FIELDS}
          row={edit.id ? edit : null}
          onDone={refresh}
          onCancel={() => setEdit(null)}
        />
      )}
      <Status s={s} empty="Түүхэн үйл явдал хараахан нэмэгдээгүй байна." />
      <ol className="tline">
        {s.data?.map((t) => (
          <li key={t.id}>
            <span className="dot" />
            <span className="yr">{t.year}</span>
            <div className="tc">
              {t.image_url && (
                <img src={t.image_url} alt={t.title} loading="lazy" />
              )}
              <h3>{t.title}</h3>
              {t.description && <p>{t.description}</p>}
              {isAdmin && (
                <AdminBar
                  onEdit={() => setEdit(t)}
                  onDuplicate={async () => {
                    await duplicateRow('timeline_events', t, 'title')
                    refresh()
                  }}
                  onDelete={async () =>
                    (await deleteRow(
                      'timeline_events',
                      t.id,
                      'Энэ үйл явдлыг',
                    )) && refresh()
                  }
                />
              )}
            </div>
          </li>
        ))}
      </ol>
    </>
  )
}
