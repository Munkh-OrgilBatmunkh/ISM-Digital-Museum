import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import useLoad from '../lib/useLoad'

// ISM Time Machine: арга хэмжээ + үзмэрийг он цагийн дарааллаар нэг шугамд харуулна
export default function Timeline() {
  const [type, setType] = useState('all')
  const [asc, setAsc] = useState(false)
  const ev = useLoad(() => supabase.from('events').select('id,title,event_date,description'), [])
  const ex = useLoad(() => supabase.from('exhibits').select('id,title,description,year_created').eq('status', 'published'), [])

  const groups = useMemo(() => {
    const items = [
      ...(ev.data ?? []).map((e) => ({ kind: 'event', id: e.id, year: Number(e.event_date.slice(0, 4)), title: e.title, text: e.description, to: `/events/${e.id}` })),
      ...(ex.data ?? []).map((e) => ({ kind: 'exhibit', id: e.id, year: e.year_created, title: e.title, text: e.description, to: `/exhibits/${e.id}` })),
    ].filter((i) => type === 'all' || i.kind === type)
    const by = {}
    items.forEach((i) => (by[i.year] ??= []).push(i))
    return Object.entries(by).sort((a, b) => (asc ? a[0] - b[0] : b[0] - a[0]))
  }, [ev.data, ex.data, type, asc])

  return (
    <>
      <h1>ISM Time Machine</h1>
      <div className="filters">
        {[['all', 'Бүгд'], ['event', 'Арга хэмжээ'], ['exhibit', 'Бүтээл']].map(([k, l]) => (
          <button key={k} className={`btn ${type === k ? '' : 'ghost'}`} onClick={() => setType(k)}>{l}</button>
        ))}
        <button className="btn ghost" onClick={() => setAsc(!asc)}>{asc ? 'Эртнээс нь' : 'Сүүлийнхээс нь'}</button>
      </div>
      {!ev.loading && !ex.loading && groups.length === 0 && <p className="note">Энэ шүүлтүүрт тохирох үйл явдал алга.</p>}
      <ol className="tl">
        {groups.map(([year, items]) => (
          <li key={year}>
            <span className="yr">{year}</span>
            {items.map((i) => (
              <Link key={i.kind + i.id} to={i.to} className="tl-item">
                <b>{i.title}</b> <small>{i.kind === 'event' ? 'Арга хэмжээ' : 'Бүтээл'}</small>
                <p>{(i.text ?? '').slice(0, 140)}</p>
              </Link>
            ))}
          </li>
        ))}
      </ol>
    </>
  )
}
