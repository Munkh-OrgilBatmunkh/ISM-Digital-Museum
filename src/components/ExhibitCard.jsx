import { Link } from 'react-router-dom'
import Tags from './Tags.jsx'

export default function ExhibitCard({ e }) {
  return (
    <Link to={`/exhibits/${e.id}`} className="xcard">
      <div className="xthumb">{e.image_url ? <img src={e.image_url} alt={e.title} loading="lazy" /> : <div className="ph">ISM</div>}</div>
      <p className="eyebrow" style={{ margin: 0 }}>{e.exhibition_categories?.name ?? 'Ангилалгүй'} · {e.year_created}</p>
      <h3>{e.title}</h3>
      {e.description && <p className="desc">{e.description}</p>}
      {e.profiles?.display_name && <p className="meta">{e.profiles.display_name}</p>}
      <Tags value={e.technology_stack} />
    </Link>
  )
}
