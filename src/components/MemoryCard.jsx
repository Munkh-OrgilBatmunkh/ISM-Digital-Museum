import { Link } from 'react-router-dom'

export default function MemoryCard({ m }) {
  return (
    <Link to={`/capsule/memories/${m.id}`} className="xcard">
      <div className="xthumb">{m.image_url ? <img src={m.image_url} alt={m.title} loading="lazy" /> : <div className="ph">ISM</div>}</div>
      <h3>{m.title}</h3>
      <p className="desc">{m.description}</p>
      <p className="meta">{m.profiles?.display_name ?? 'Нэргүй'}{m.year ? ` · ${m.year}` : ''}</p>
    </Link>
  )
}
