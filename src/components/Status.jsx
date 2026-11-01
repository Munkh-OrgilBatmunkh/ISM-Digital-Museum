export default function Status({ s, empty = 'Үр дүн олдсонгүй.' }) {
  if (s.loading) return <p className="note">Ачаалж байна…</p>
  if (s.error)
    return <p className="note err">Алдаа гарлаа: {s.error.message}</p>
  if (Array.isArray(s.data) && s.data.length === 0)
    return <p className="note">{empty}</p>
  return null
}
