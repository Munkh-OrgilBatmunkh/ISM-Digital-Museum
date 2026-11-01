import { Link } from 'react-router-dom'
import { day } from '../lib/format'

export default function LetterCard({ l }) {
  return (
    <Link to={`/capsule/letters/${l.id}`} className="lcard">
      <h3>{l.title}</h3>
      <p className="meta">{l.profiles?.display_name ?? 'Нэргүй'} · {day(l.created_at)}</p>
      <p className="snip">{l.body}</p>
      <span className="more">Бүтнээр нь унших →</span>
    </Link>
  )
}
