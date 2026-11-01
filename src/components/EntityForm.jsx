import { useState } from 'react'
import { supabase, BUCKET } from '../lib/supabase'
import { useAuth } from '../lib/auth.jsx'

export default function EntityForm({
  table,
  title,
  fields,
  row,
  extra,
  onDone,
  onCancel,
}) {
  const { user } = useAuth()
  const [v, setV] = useState(() =>
    Object.fromEntries(
      fields.map((f) => [f.key, row?.[f.key] ?? f.default ?? '']),
    ),
  )
  const [file, setFile] = useState(null)
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)
  const img = fields.find((f) => f.type === 'image')?.key
  const set = (k) => (e) => setV({ ...v, [k]: e.target.value })

  const submit = async (e) => {
    e.preventDefault()
    setErr('')
    for (const f of fields) {
      if (
        f.required &&
        !String(v[f.key]).trim() &&
        !(f.type === 'image' && file)
      )
        return setErr(`«${f.label}» заавал бөглөнө.`)
    }
    if (img && v[img] && !/^(\/images\/|https?:\/\/)/.test(v[img]))
      return setErr('Зургийн зам /images/… эсвэл https://… гэж эхэлнэ.')
    if (
      file &&
      (!file.type.startsWith('image/') || file.size > 5 * 1024 * 1024)
    )
      return setErr('5MB-аас бага зураг сонгоно уу.')
    setBusy(true)
    const out = {}
    for (const f of fields) {
      const s = String(v[f.key]).trim()
      out[f.key] = s === '' ? null : f.type === 'number' ? Number(s) : s
    }
    if (file) {
      const path = `${user.id}/${crypto.randomUUID()}.${file.name.split('.').pop().toLowerCase()}`
      const up = await supabase.storage.from(BUCKET).upload(path, file)
      if (up.error) {
        setBusy(false)
        return setErr(up.error.message)
      }
      out[img] = supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl
    }
    const { error } = row?.id
      ? await supabase.from(table).update(out).eq('id', row.id)
      : await supabase.from(table).insert({ ...out, ...extra })
    setBusy(false)
    error ? setErr(error.message) : onDone()
  }

  return (
    <form className="panel" onSubmit={submit}>
      <h2 style={{ margin: 0 }}>{title}</h2>
      {fields.map((f) =>
        f.type === 'image' ? (
          <div key={f.key} style={{ display: 'grid', gap: '.5rem' }}>
            <label className="drop">
              ↑ {f.label}: компьютерээс сонгох
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setFile(e.target.files[0])}
              />
            </label>
            <input
              placeholder="эсвэл локал зам: /images/зураг.jpg"
              value={v[f.key]}
              onChange={set(f.key)}
              aria-label="Локал зургийн зам"
            />
          </div>
        ) : (
          <label key={f.key} className="fld">
            <span>{f.label}</span>
            {f.type === 'textarea' ? (
              <textarea
                rows={f.rows ?? 3}
                maxLength={f.max}
                value={v[f.key]}
                onChange={set(f.key)}
              />
            ) : (
              <input
                type={
                  f.type === 'number' || f.type === 'date' ? f.type : 'text'
                }
                list={f.list ? `dl-${f.key}` : undefined}
                maxLength={f.max}
                value={v[f.key]}
                onChange={set(f.key)}
              />
            )}
            {f.list && (
              <datalist id={`dl-${f.key}`}>
                {f.list.map((o) => (
                  <option key={o} value={o} />
                ))}
              </datalist>
            )}
          </label>
        ),
      )}
      {err && <p className="err">{err}</p>}
      <div className="row">
        <button className="btn" disabled={busy}>
          {busy ? 'Хадгалж байна…' : 'Хадгалах'}
        </button>
        <button type="button" className="btn ghost" onClick={onCancel}>
          Цуцлах
        </button>
      </div>
    </form>
  )
}
