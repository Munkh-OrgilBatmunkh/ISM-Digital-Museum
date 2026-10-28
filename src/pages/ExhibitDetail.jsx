import { useParams, Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../lib/auth.jsx'
import useLoad from '../lib/useLoad'
import Status from '../components/Status.jsx'

export default function ExhibitDetail() {
  const { id } = useParams()
  const { user, isAdmin } = useAuth()
  const nav = useNavigate()
  const s = useLoad(
    () =>
      supabase
        .from('exhibits')
        .select('*, exhibition_categories(name), profiles(display_name)')
        .eq('id', id)
        .maybeSingle(),
    [id],
  )
  const e = s.data
  const canEdit = user && e && (user.id === e.creator_id || isAdmin)

  const remove = async () => {
    if (!confirm('Энэ үзмэрийг устгах уу?')) return
    const { error } = await supabase.from('exhibits').delete().eq('id', id)
    error ? alert(error.message) : nav('/exhibits')
  }
  const hide = async () => {
    const { error } = await supabase
      .from('exhibits')
      .update({ status: 'hidden' })
      .eq('id', id)
    error ? alert(error.message) : nav('/exhibits')
  }

  if (s.loading || s.error) return <Status s={s} />
  if (!e) return <p className="note">Үзмэр олдсонгүй.</p>
  return (
    <article className="detail">
      {e.image_url && <img src={e.image_url} alt={e.title} />}
      <div>
        <h1>{e.title}</h1>
        <p className="meta">
          {e.year_created} · {e.exhibition_categories?.name ?? 'Ангилалгүй'} ·
          Зохиогч: {e.profiles?.display_name ?? 'Тодорхойгүй'}
        </p>
        <p>{e.description}</p>
        {e.technology_stack && (
          <p className="tags">Технологи: {e.technology_stack}</p>
        )}
        <p className="links">
          {e.demo_url && (
            <a href={e.demo_url} target="_blank" rel="noreferrer">
              Demo
            </a>
          )}
          {e.github_url && (
            <a href={e.github_url} target="_blank" rel="noreferrer">
              GitHub
            </a>
          )}
        </p>
        {canEdit && (
          <p className="row">
            <Link className="btn" to={`/exhibits/${id}/edit`}>
              Засах
            </Link>
            <button className="btn danger" onClick={remove}>
              Устгах
            </button>
            {isAdmin && (
              <button className="btn ghost" onClick={hide}>
                Нуух
              </button>
            )}
          </p>
        )}
      </div>
    </article>
  )
}
