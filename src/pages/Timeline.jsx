import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTimelineItems } from '../lib/timeline'

// ISM Time Machine: слайдер/жилээр сонгоход тухайн оны арга хэмжээ, бүтээлүүд харагдана
export default function Timeline() {
  const { items, loading } = useTimelineItems()
  const [idx, setIdx] = useState(null)
  const years = [...new Set(items.map((i) => i.year))].sort((a, b) => a - b)
  const i = Math.min(idx ?? years.length - 1, years.length - 1)
  const year = years[i]
  const cur = items.filter((x) => x.year === year)
  const lead = cur.find((x) => x.image) ?? cur[0]

  return (
    <>
      <div className="pagehead"><p className="eyebrow">ISM Time Machine</p><h1>Цаг хугацаагаар аялах</h1></div>
      {!loading && years.length === 0 && <p className="note">Түүхэн мэдээлэл хараахан нэмэгдээгүй байна. Үзмэр эсвэл арга хэмжээ нэмсний дараа энд харагдана.</p>}
      {lead && (
        <>
          <div className={`tm ${lead.image ? 'img' : ''}`} style={lead.image ? { backgroundImage: `url(${lead.image})` } : undefined}>
            <div><div className="yr">{year}</div><h2>{lead.title}</h2><p>{(lead.text ?? '').slice(0, 160)}</p></div>
          </div>
          <div className="track">
            {years.map((y, k) => <button key={y} className={k === i ? 'on' : ''} onClick={() => setIdx(k)}><i />{y}</button>)}
          </div>
          {years.length > 1 && <input type="range" min="0" max={years.length - 1} value={i} onChange={(e) => setIdx(Number(e.target.value))} aria-label="Он сонгох" />}
          <h2>{year} онд</h2>
          <div className="grid3">
            {cur.map((x) => (
              <Link key={x.kind + x.id} to={x.to} className="xcard">
                <p className="eyebrow">{x.kind === 'event' ? 'Арга хэмжээ' : 'Бүтээл'}</p>
                <h3>{x.title}</h3>
                <p className="muted">{(x.text ?? '').slice(0, 120)}</p>
              </Link>
            ))}
          </div>
        </>
      )}
    </>
  )
}
