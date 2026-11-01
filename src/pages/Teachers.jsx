import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../lib/auth.jsx'
import useLoad from '../lib/useLoad'
import Status from '../components/Status.jsx'
import EntityForm from '../components/EntityForm.jsx'
import { AdminBar, duplicateRow, deleteRow } from '../components/AdminTools.jsx'

const RANKS = [
  'Профессор',
  'Дэд профессор',
  'Ахлах багш',
  'Багш',
  'Туслах багш',
]
const FIELDS = [
  { key: 'name', label: 'Нэр', required: true },
  {
    key: 'position',
    label: 'Цол (жишээ: Профессор, Ахлах багш)',
    list: RANKS,
    required: true,
  },
  { key: 'photo_url', label: 'Зураг', type: 'image' },
]

export default function Teachers() {
  const { isAdmin } = useAuth()
  const [n, setN] = useState(0)
  const [edit, setEdit] = useState(null)
  const s = useLoad(
    () => supabase.from('teachers').select('*').order('name'),
    [n],
  )
  const refresh = () => {
    setEdit(null)
    setN((x) => x + 1)
  }

  return (
    <>
      <div className="pagehead">
        <p className="eyebrow">Бидний бахархал</p>
        <h1>Тэнхимийн багш нар</h1>
        <p className="muted">
          Манай тэнхимд хичээл заадаг багш нартай танилцаарай.
        </p>
        {isAdmin && (
          <button className="btn" onClick={() => setEdit({})}>
            + Багш нэмэх
          </button>
        )}
      </div>
      {edit && (
        <EntityForm
          key={edit.id ?? 'new'}
          table="teachers"
          title={edit.id ? 'Багш засах' : 'Шинэ багш нэмэх'}
          fields={FIELDS}
          row={edit.id ? edit : null}
          onDone={refresh}
          onCancel={() => setEdit(null)}
        />
      )}
      <Status s={s} empty="Багшийн мэдээлэл хараахан нэмэгдээгүй байна." />
      <div className="grid4">
        {s.data?.map((t) => (
          <div className="tcard" key={t.id}>
            <div className="xthumb">
              {t.photo_url ? (
                <img src={t.photo_url} alt={t.name} loading="lazy" />
              ) : (
                <div className="ph">
                  {t.name
                    .split(/[ .]+/)
                    .filter(Boolean)
                    .map((w) => w[0])
                    .join('')
                    .slice(0, 2)}
                </div>
              )}
            </div>
            <h3>{t.name}</h3>
            <p className="rank">{t.position}</p>
            {isAdmin && (
              <AdminBar
                onEdit={() => setEdit(t)}
                onDuplicate={async () => {
                  await duplicateRow('teachers', t, 'name')
                  refresh()
                }}
                onDelete={async () =>
                  (await deleteRow('teachers', t.id, 'Энэ багшийг')) &&
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
