import { Link, useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import useLoad from '../lib/useLoad'
import Status from '../components/Status.jsx'
import { day } from '../lib/format'

export default function CapsuleDetail() {
  const { kind, id } = useParams()
  const table = kind === 'letters' ? 'capsule_letters' : kind === 'memories' ? 'capsule_memories' : null
  const s = useLoad(() => table
    ? supabase.from(table).select('*, profiles(display_name)').eq('id', id).maybeSingle()
    : Promise.resolve({ data: null, error: null }), [table, id])

  if (s.loading || s.error) return <Status s={s} />
  const r = s.data
  if (!r) return <p className="note">Олдсонгүй.</p>
  const who = r.profiles?.display_name ?? 'Нэргүй'
  return (
    <>
      <p style={{ marginTop: '2rem' }}><Link to={`/capsule?tab=${kind}`} className="muted" style={{ textDecoration: 'none' }}>← Time Capsule руу буцах</Link></p>
      {kind === 'letters' ? (
        <article className="letter">
          <p className="eyebrow">Ирээдүйн оюутанд</p>
          <h1>{r.title}</h1>
          <p className="meta">{who} · {day(r.created_at)}</p>
          <div className="body">{r.body}</div>
        </article>
      ) : (
        <article className="detail">
          <div className="frame">{r.image_url ? <img src={r.image_url} alt={r.title} /> : <div className="xthumb"><div className="ph">ISM</div></div>}</div>
          <div>
            <p className="eyebrow">Дурсамж</p>
            <h1>{r.title}</h1>
            <p className="lead">{r.description}</p>
            <p className="meta">{who}{r.year ? ` · ${r.year}` : ''}</p>
          </div>
        </article>
      )}
    </>
  )
}
