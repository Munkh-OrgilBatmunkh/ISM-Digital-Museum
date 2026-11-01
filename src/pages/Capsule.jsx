import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../lib/auth.jsx'
import useLoad from '../lib/useLoad'
import Status from '../components/Status.jsx'
import EntityForm from '../components/EntityForm.jsx'
import LetterCard from '../components/LetterCard.jsx'
import MemoryCard from '../components/MemoryCard.jsx'
import { AdminBar, deleteRow } from '../components/AdminTools.jsx'

const LETTER = [
  {
    key: 'title',
    label: 'Гарчиг (жишээ: Ирээдүйн оюутанд)',
    required: true,
    max: 120,
  },
  {
    key: 'body',
    label: 'Захидал',
    type: 'textarea',
    rows: 10,
    required: true,
    max: 5000,
  },
]
const MEMORY = [
  { key: 'title', label: 'Гарчиг', required: true, max: 120 },
  {
    key: 'description',
    label: 'Товч тайлбар (1–2 өгүүлбэр)',
    type: 'textarea',
    rows: 3,
    required: true,
    max: 400,
  },
  {
    key: 'year',
    label: 'Он',
    type: 'number',
    default: new Date().getFullYear(),
  },
  { key: 'image_url', label: 'Зураг', type: 'image', required: true },
]

export default function Capsule() {
  const { user, isAdmin } = useAuth()
  const [sp, setSp] = useSearchParams()
  const raw = sp.get('q') ?? ''
  const q = raw.replace(/[,()*%]/g, ' ').trim()
  const setQ = (v) => {
    const p = new URLSearchParams(sp)
    v ? p.set('q', v) : p.delete('q')
    setSp(p, { replace: true })
  }
  const [tab, setTab] = useState(
    sp.get('tab') === 'memories' ? 'memories' : 'letters',
  )
  const [n, setN] = useState(0)
  const [edit, setEdit] = useState(null)

  const letters = useLoad(() => {
    let r = supabase
      .from('capsule_letters')
      .select('*, profiles(display_name)')
      .order('created_at', { ascending: false })
    if (q) r = r.or(`title.ilike.*${q}*,body.ilike.*${q}*`)
    return r
  }, [q, n])
  const memories = useLoad(() => {
    let r = supabase
      .from('capsule_memories')
      .select('*, profiles(display_name)')
      .order('created_at', { ascending: false })
    if (q) r = r.or(`title.ilike.*${q}*,description.ilike.*${q}*`)
    return r
  }, [q, n])

  const open = (e) => {
    setEdit(e)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  const refresh = () => {
    setEdit(null)
    setN((x) => x + 1)
  }
  const mine = (r) => user && (user.id === r.author_id || isAdmin)

  return (
    <>
      <div className="pagehead">
        <p className="eyebrow">Digital Time Capsule</p>
        <h1>Ирээдүйн оюутнуудад зориулсан захиа</h1>
        <p className="muted">
          Бүтээлийн түүх болон дурсамжаа хадгалж үлдээгээрэй. Бусдын бичсэн
          захидлыг уншиж, өөрөө ч захидал бичээрэй.
        </p>
        <div className="row">
          {user ? (
            <>
              <button
                className="btn"
                onClick={() => {
                  setTab('letters')
                  open({ kind: 'letter' })
                }}
              >
                ✉ Захидал бичих
              </button>
              <button
                className="btn ghost"
                onClick={() => {
                  setTab('memories')
                  open({ kind: 'memory' })
                }}
              >
                + Дурсамж нэмэх
              </button>
            </>
          ) : (
            <Link className="btn" to="/login" state={{ from: '/capsule' }}>
              Нэвтэрч захидал бичих
            </Link>
          )}
        </div>
      </div>

      {edit && (
        <EntityForm
          key={edit.row?.id ?? edit.kind}
          table={
            edit.kind === 'letter' ? 'capsule_letters' : 'capsule_memories'
          }
          title={
            edit.kind === 'letter'
              ? edit.row
                ? 'Захидал засах'
                : 'Ирээдүйн оюутанд захидал бичих'
              : edit.row
                ? 'Дурсамж засах'
                : 'Шинэ дурсамж нэмэх'
          }
          fields={edit.kind === 'letter' ? LETTER : MEMORY}
          row={edit.row ?? null}
          extra={{ author_id: user.id }}
          onDone={refresh}
          onCancel={() => setEdit(null)}
        />
      )}

      <div className="chips">
        <div className="sbox">
          <input
            value={raw}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Захидал, дурсамж хайх.."
            aria-label="Захидал, дурсамж хайх"
          />
        </div>
        <button
          className={`chip ${tab === 'letters' ? 'on' : ''}`}
          onClick={() => setTab('letters')}
        >
          Захидлууд{letters.data ? ` (${letters.data.length})` : ''}
        </button>
        <button
          className={`chip ${tab === 'memories' ? 'on' : ''}`}
          onClick={() => setTab('memories')}
        >
          Дурсамжууд{memories.data ? ` (${memories.data.length})` : ''}
        </button>
      </div>

      {tab === 'letters' ? (
        <>
          <Status
            s={letters}
            empty={
              q
                ? 'Хайлтад тохирох захидал олдсонгүй.'
                : 'Одоогоор захидал алга. Эхний захидлыг та бичээрэй!'
            }
          />
          <div className="lgrid">
            {letters.data?.map((l) => (
              <div key={l.id}>
                <LetterCard l={l} />
                {mine(l) && (
                  <AdminBar
                    onEdit={() => open({ kind: 'letter', row: l })}
                    onDelete={async () =>
                      (await deleteRow(
                        'capsule_letters',
                        l.id,
                        'Энэ захидлыг',
                      )) && refresh()
                    }
                  />
                )}
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
          <Status
            s={memories}
            empty={
              q
                ? 'Хайлтад тохирох дурсамж олдсонгүй.'
                : 'Одоогоор дурсамж алга. Эхний дурсамжийг та нэмээрэй!'
            }
          />
          <div className="grid3">
            {memories.data?.map((m) => (
              <div key={m.id}>
                <MemoryCard m={m} />
                {mine(m) && (
                  <AdminBar
                    onEdit={() => open({ kind: 'memory', row: m })}
                    onDelete={async () =>
                      (await deleteRow(
                        'capsule_memories',
                        m.id,
                        'Энэ дурсамжийг',
                      )) && refresh()
                    }
                  />
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </>
  )
}
