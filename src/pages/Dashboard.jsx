import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { supabase, BUCKET } from '../lib/supabase'
import { useAuth } from '../lib/auth.jsx'
import useLoad from '../lib/useLoad'
import Status from '../components/Status.jsx'

const STATUS = {
  published: 'Нийтлэгдсэн',
  pending: 'Хянагдаж буй',
  hidden: 'Нуугдсан',
}
const empty = {
  title: '',
  description: '',
  category_id: '',
  technology_stack: '',
  year_created: '',
  demo_url: '',
  github_url: '',
  image_url: '',
}

function ExhibitForm({ id, onDone, onCancel }) {
  const { user } = useAuth()
  const [f, setF] = useState(empty)
  const [file, setFile] = useState(null)
  const [errs, setErrs] = useState({})
  const [busy, setBusy] = useState(false)
  const cats = useLoad(
    () => supabase.from('exhibition_categories').select('*').order('name'),
    [],
  )

  useEffect(() => {
    if (!id) return
    supabase
      .from('exhibits')
      .select('*')
      .eq('id', id)
      .maybeSingle()
      .then(({ data }) => data && setF({ ...empty, ...data }))
  }, [id])

  const on = (k) => (e) => setF({ ...f, [k]: e.target.value })
  const err = (k) => errs[k] && <span className="err">{errs[k]}</span>

  const validate = () => {
    const x = {},
      y = Number(f.year_created)
    if (f.title.trim().length < 3) x.title = 'Гарчиг дор хаяж 3 тэмдэгт байна.'
    if (!f.description.trim()) x.description = 'Тайлбар оруулна уу.'
    if (!(y >= 1990 && y <= new Date().getFullYear() + 1))
      x.year_created = 'Он буруу байна.'
    for (const k of ['demo_url', 'github_url'])
      if (f[k] && !/^https?:\/\//.test(f[k])) x[k] = 'https:// -ээр эхэлнэ.'
    if (f.image_url && !/^(\/images\/|https?:\/\/)/.test(f.image_url))
      x.image_url = 'Зам /images/… эсвэл https://… байна.'
    if (
      file &&
      (!file.type.startsWith('image/') || file.size > 5 * 1024 * 1024)
    )
      x.file = 'Зураг (5MB хүртэл) оруулна уу.'
    return x
  }

  const submit = async (e) => {
    e.preventDefault()
    const x = validate()
    setErrs(x)
    if (Object.keys(x).length) return
    setBusy(true)
    let image_url = f.image_url || null
    if (file) {
      const path = `${user.id}/${crypto.randomUUID()}.${file.name.split('.').pop().toLowerCase()}`
      const up = await supabase.storage.from(BUCKET).upload(path, file)
      if (up.error) {
        setBusy(false)
        return setErrs({ form: up.error.message })
      }
      image_url = supabase.storage.from(BUCKET).getPublicUrl(path)
        .data.publicUrl
    }
    const row = {
      title: f.title.trim(),
      description: f.description.trim(),
      category_id: f.category_id || null,
      technology_stack: f.technology_stack.trim(),
      year_created: Number(f.year_created),
      demo_url: f.demo_url || null,
      github_url: f.github_url || null,
      image_url,
    }
    const { error } = id
      ? await supabase.from('exhibits').update(row).eq('id', id)
      : await supabase.from('exhibits').insert({ ...row, creator_id: user.id })
    setBusy(false)
    if (error) return setErrs({ form: error.message })
    if (!id) {
      setF(empty)
      setFile(null)
    }
    onDone()
  }

  return (
    <form className="panel" onSubmit={submit}>
      <h2 style={{ margin: 0 }}>{id ? 'Бүтээл засах' : 'Шинэ бүтээл нэмэх'}</h2>
      <input placeholder="Гарчиг" value={f.title} onChange={on('title')} />
      {err('title')}
      <textarea
        rows="4"
        placeholder="Товч тайлбар"
        value={f.description}
        onChange={on('description')}
      />
      {err('description')}
      <div className="two">
        <select
          value={f.category_id ?? ''}
          onChange={on('category_id')}
          aria-label="Ангилал"
        >
          <option value="">Ангилал сонгох</option>
          {cats.data?.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <input
          type="number"
          placeholder="Он"
          value={f.year_created ?? ''}
          onChange={on('year_created')}
        />
      </div>
      {err('year_created')}
      <input
        placeholder="Технологи (React, Supabase…)"
        value={f.technology_stack ?? ''}
        onChange={on('technology_stack')}
      />
      <div className="two">
        <input
          placeholder="Demo URL"
          value={f.demo_url ?? ''}
          onChange={on('demo_url')}
        />
        <input
          placeholder="GitHub URL"
          value={f.github_url ?? ''}
          onChange={on('github_url')}
        />
      </div>
      {err('demo_url')}
      {err('github_url')}
      <label className="drop">
        ↑ Зураг оруулах (компьютерээс сонгох)
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files[0])}
        />
      </label>
      {err('file')}
      <input
        placeholder="эсвэл локал зураг: /images/laptop.jpg"
        value={f.image_url ?? ''}
        onChange={on('image_url')}
      />
      {err('image_url')}
      {errs.form && <p className="err">{errs.form}</p>}
      <button className="btn block" disabled={busy}>
        {busy ? 'Хадгалж байна…' : 'Хадгалах'}
      </button>
      {id && (
        <button type="button" className="btn ghost block" onClick={onCancel}>
          Цуцлах
        </button>
      )}
    </form>
  )
}

export default function Dashboard() {
  const { user, role } = useAuth()
  const [sp, setSp] = useSearchParams()
  const editId = sp.get('edit')
  const [n, setN] = useState(0)
  const list = useLoad(
    () =>
      supabase
        .from('exhibits')
        .select(
          'id,title,year_created,image_url,status,exhibition_categories(name)',
        )
        .eq('creator_id', user.id)
        .order('created_at', { ascending: false }),
    [user.id, n],
  )

  const remove = async (id) => {
    if (!confirm('Энэ бүтээлийг устгах уу?')) return
    const { error } = await supabase.from('exhibits').delete().eq('id', id)
    error ? alert(error.message) : setN(n + 1)
  }

  return (
    <>
      <div className="dash-h">
        <div>
          <h1>Миний бүтээлүүд</h1>
        </div>
        <span className="role">{role === 'admin' ? 'Админ' : 'Оюутан'}</span>
      </div>
      <div className="dash">
        <div>
          <Status
            s={list}
            empty="Та хараахан бүтээл нэмээгүй байна. Маягтаар эхний бүтээлээ нэмээрэй."
          />
          {list.data?.map((e) => (
            <div className="item" key={e.id}>
              {e.image_url ? (
                <img src={e.image_url} alt="" />
              ) : (
                <div
                  className="xthumb"
                  style={{ width: 96, height: 68, margin: 0 }}
                >
                  <div className="ph" style={{ fontSize: '1rem' }}>
                    ISM
                  </div>
                </div>
              )}
              <div>
                <h3>{e.title}</h3>
                <p className="muted" style={{ margin: 0 }}>
                  {e.exhibition_categories?.name ?? 'Ангилалгүй'} ·{' '}
                  {e.year_created}
                </p>
              </div>
              <span
                className={`badge ${e.status === 'hidden' ? 'hidden' : ''}`}
              >
                {STATUS[e.status] ?? e.status}
              </span>
              <button className="linkbtn" onClick={() => setSp({ edit: e.id })}>
                Засах
              </button>
              <button className="linkbtn del" onClick={() => remove(e.id)}>
                Устгах
              </button>
            </div>
          ))}
        </div>
        <ExhibitForm
          key={editId ?? 'new'}
          id={editId}
          onDone={() => {
            setSp({})
            setN(n + 1)
          }}
          onCancel={() => setSp({})}
        />
      </div>
    </>
  )
}
