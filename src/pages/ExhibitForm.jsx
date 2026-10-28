import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { supabase, BUCKET } from '../lib/supabase'
import { useAuth } from '../lib/auth.jsx'
import useLoad from '../lib/useLoad'

const empty = { title: '', description: '', category_id: '', technology_stack: '', year_created: new Date().getFullYear(), demo_url: '', github_url: '', image_url: '' }

export default function ExhibitForm() {
  const { id } = useParams()
  const { user } = useAuth()
  const nav = useNavigate()
  const [f, setF] = useState(empty)
  const [file, setFile] = useState(null)
  const [errs, setErrs] = useState({})
  const [busy, setBusy] = useState(false)
  const cats = useLoad(() => supabase.from('exhibition_categories').select('*').order('name'), [])

  useEffect(() => {
    if (!id) return
    supabase.from('exhibits').select('*').eq('id', id).maybeSingle().then(({ data }) => data && setF({ ...empty, ...data }))
  }, [id])

  const on = (k) => (e) => setF({ ...f, [k]: e.target.value })

  const validate = () => {
    const x = {}
    if (f.title.trim().length < 3) x.title = 'Нэр дор хаяж 3 тэмдэгт байна.'
    if (!f.description.trim()) x.description = 'Тайлбар оруулна уу.'
    const y = Number(f.year_created)
    if (!(y >= 1990 && y <= new Date().getFullYear() + 1)) x.year_created = 'Он буруу байна.'
    for (const k of ['demo_url', 'github_url']) if (f[k] && !/^https?:\/\//.test(f[k])) x[k] = 'http:// эсвэл https:// -ээр эхэлнэ.'
    if (file && !file.type.startsWith('image/')) x.file = 'Зөвхөн зураг оруулна уу.'
    if (file && file.size > 5 * 1024 * 1024) x.file = 'Зураг 5MB-аас бага байна.'
    return x
  }

  const submit = async (e) => {
    e.preventDefault()
    const x = validate(); setErrs(x)
    if (Object.keys(x).length) return
    setBusy(true)
    let image_url = f.image_url
    if (file) {
      const ext = file.name.split('.').pop().toLowerCase()
      const path = `${user.id}/${crypto.randomUUID()}.${ext}`
      const up = await supabase.storage.from(BUCKET).upload(path, file)
      if (up.error) { setBusy(false); return setErrs({ form: up.error.message }) }
      image_url = supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl
    }
    const row = {
      title: f.title.trim(), description: f.description.trim(), category_id: f.category_id || null,
      technology_stack: f.technology_stack.trim(), year_created: Number(f.year_created),
      demo_url: f.demo_url || null, github_url: f.github_url || null, image_url,
    }
    const { data, error } = id
      ? await supabase.from('exhibits').update(row).eq('id', id).select().single()
      : await supabase.from('exhibits').insert({ ...row, creator_id: user.id }).select().single()
    setBusy(false)
    error ? setErrs({ form: error.message }) : nav(`/exhibits/${data.id}`)
  }

  const field = (k, label, input) => (
    <label>{label}{input}{errs[k] && <span className="err">{errs[k]}</span>}</label>
  )

  return (
    <form className="form" onSubmit={submit}>
      <h1>{id ? 'Үзмэр засах' : 'Шинэ үзмэр нэмэх'}</h1>
      {field('title', 'Нэр', <input value={f.title} onChange={on('title')} />)}
      {field('description', 'Тайлбар', <textarea rows="5" value={f.description} onChange={on('description')} />)}
      {field('category_id', 'Ангилал',
        <select value={f.category_id ?? ''} onChange={on('category_id')}>
          <option value="">— сонгох —</option>
          {cats.data?.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>)}
      {field('technology_stack', 'Ашигласан технологи (таслалаар)', <input value={f.technology_stack} onChange={on('technology_stack')} placeholder="React, Supabase" />)}
      {field('year_created', 'Бүтээсэн он', <input type="number" value={f.year_created} onChange={on('year_created')} />)}
      {field('demo_url', 'Demo холбоос', <input value={f.demo_url ?? ''} onChange={on('demo_url')} />)}
      {field('github_url', 'GitHub холбоос', <input value={f.github_url ?? ''} onChange={on('github_url')} />)}
      {field('file', 'Зураг (Supabase Storage-д хадгална)', <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])} />)}
      {errs.form && <p className="err">{errs.form}</p>}
      <button className="btn" disabled={busy}>{busy ? 'Хадгалж байна…' : 'Хадгалах'}</button>
    </form>
  )
}
