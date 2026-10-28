import { Link } from 'react-router-dom'

export default function ExhibitCard({ e }) {
  return (
    <Link to={`/exhibits/${e.id}`} className="card">
      {e.image_url ? <img src={e.image_url} alt={e.title} loading="lazy" /> : <div className="ph">ISM</div>}
      <div className="card-b">
        <h3>{e.title}</h3>
        <p className="meta">{e.year_created} · {e.exhibition_categories?.name ?? 'Ангилалгүй'}</p>
        {e.technology_stack && <p className="tags">{e.technology_stack}</p>}
      </div>
    </Link>
  )
}
