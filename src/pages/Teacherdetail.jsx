import { Link, useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import useLoad from '../lib/useLoad'
import Status from '../components/Status.jsx'

const initials = (name) =>
  name
    .split(/[ .]+/)
    .filter(Boolean)
    .map((w) => w[0])
    .join('')
    .slice(0, 2)

export default function TeacherDetail() {
  const { id } = useParams()
  const s = useLoad(
    () => supabase.from('teachers').select('*').eq('id', id).maybeSingle(),
    [id],
  )
  if (s.loading || s.error) return <Status s={s} />
  const t = s.data
  if (!t) return <p className="note">Багш олдсонгүй.</p>

  const lessons = (t.courses ?? '')
    .split(/[,;\n]+/)
    .map((x) => x.trim())
    .filter(Boolean)
  const none = <span className="muted">Мэдээлэл оруулаагүй</span>
  return (
    <>
      <p style={{ marginTop: '2rem' }}>
        <Link
          to="/teachers"
          className="muted"
          style={{ textDecoration: 'none' }}
        >
          ← Багш нар руу буцах
        </Link>
      </p>
      <article className="detail tdetail">
        <div className="pframe">
          {t.photo_url ? (
            <img src={t.photo_url} alt={t.name} />
          ) : (
            <div className="ph">{initials(t.name)}</div>
          )}
        </div>
        <div>
          <p className="eyebrow">{t.position}</p>
          <h1>{t.name}</h1>
          <dl className="rows">
            <div>
              <dt>Цол</dt>
              <dd>{t.position || none}</dd>
            </div>
            <div>
              <dt>Боловсролын түвшин</dt>
              <dd>{t.education || none}</dd>
            </div>
            <div>
              <dt>И-мэйл</dt>
              <dd>
                {t.email ? <a href={`mailto:${t.email}`}>{t.email}</a> : none}
              </dd>
            </div>
            <div>
              <dt>Өрөөний дугаар</dt>
              <dd>{t.room || none}</dd>
            </div>
          </dl>
          <h2 style={{ margin: '1.5rem 0 .7rem', fontSize: '1.2rem' }}>
            Заадаг хичээлүүд
          </h2>
          {lessons.length ? (
            <ul className="lessons">
              {lessons.map((l) => (
                <li key={l}>{l}</li>
              ))}
            </ul>
          ) : (
            none
          )}
        </div>
      </article>
    </>
  )
}
