import { useParams, Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../lib/auth.jsx'
import useLoad from '../lib/useLoad'
import Status from '../components/Status.jsx'

export default function ExhibitDetail() {
  const { id } = useParams()
  const { user, isAdmin } = useAuth()
  const nav = useNavigate()
  const s = useLoad(() =>
    supabase.from('exhibits').select('*, exhibition_categories(name), profiles(display_name)').eq('id', id).maybeSingle(), [id])
  const e = s.data
  const canEdit = user && e && (user.id === e.creator_id || isAdmin)

  const remove = async () => {
    if (!confirm('Энэ үзмэрийг устгах уу?')) return
    const { error } = await supabase.from('exhibits').delete().eq('id', id)
    error ? alert(error.message) : nav('/exhibits')
  }
  const hide = async () => {
    const { error } = await supabase.from('exhibits').update({ status: 'hidden' }).eq('id', id)
    error ? alert(error.message) : nav('/exhibits')
  }

  if (s.loading || s.error) return <Status s={s} />
  if (!e) return <p className="note">Үзмэр олдсонгүй.</p>
  return (
    <>
      <p style={{ marginTop: '2rem' }}><Link to="/exhibits" className="muted" style={{ textDecoration: 'none' }}>← Үзэсгэлэн рүү буцах</Link></p>
      <article className="detail">
        <div className="frame">{e.image_url ? <img src={e.image_url} alt={e.title} /> : <div className="xthumb"><div className="ph">ISM</div></div>}</div>
        <div>
          <p className="eyebrow">Үзмэр</p>
          <h1>{e.title}</h1>
          <p className="lead">{e.description}</p>
          <dl className="rows">
            <div><dt>Зохиогч</dt><dd>{e.profiles?.display_name ?? 'Тодорхойгүй'}</dd></div>
            <div><dt>Он</dt><dd>{e.year_created}</dd></div>
            <div><dt>Ангилал</dt><dd>{e.exhibition_categories?.name ?? 'Ангилалгүй'}</dd></div>
            <div><dt>Технологи</dt><dd>{e.technology_stack}</dd></div>
          </dl>
          <div className="row">
            {e.demo_url && <a className="btn" href={e.demo_url} target="_blank" rel="noreferrer">Demo үзэх</a>}
            {e.github_url && <a className="btn ghost" href={e.github_url} target="_blank" rel="noreferrer">GitHub</a>}
          </div>
          {canEdit && (
            <div className="row" style={{ marginTop: '1.2rem' }}>
              <Link className="btn ghost" to={`/my?edit=${id}`}>Засах</Link>
              <button className="btn ghost" style={{ color: 'var(--bad)' }} onClick={remove}>Устгах</button>
              {isAdmin && <button className="btn ghost" onClick={hide}>Нуух</button>}
            </div>
          )}
        </div>
      </article>
    </>
  )
}
