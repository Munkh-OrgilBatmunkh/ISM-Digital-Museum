export default function Tags({ value }) {
  const list = (value ?? '').split(',').map((t) => t.trim()).filter(Boolean)
  return list.length ? <div className="tags">{list.map((t) => <span key={t}>{t}</span>)}</div> : null
}
