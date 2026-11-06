import { DEPT } from '../data/department'
import { HERO_ART } from '../data/heroArt'

export function DeptHero() {
  const img = `linear-gradient(to top, rgba(12,31,74,.88), rgba(12,31,74,.45) 40%, rgba(12,31,74,.08)), url(${DEPT.heroImage}), url("${HERO_ART}")`
  return (
    <section className="dhero" style={{ backgroundImage: img }}>
      <div className="in">
        <p className="eyebrow">ISM Time Machine</p>
        <h1>{DEPT.name}</h1>
      </div>
    </section>
  )
}

export function Overview() {
  return (
    <section className="about">
      <div className="mv">
        <div className="mcard">
          <p className="eyebrow">Эрхэм зорилго</p>
          <p className="mtext">{DEPT.mission}</p>
        </div>
        <div className="mcard">
          <p className="eyebrow">Алсын хараа</p>
          <p className="mtext">{DEPT.vision}</p>
        </div>
      </div>
      <div className="motto">
        <small>Уриа</small>
        <p>{DEPT.motto}</p>
      </div>

      <h2>Хөтөлбөрүүд</h2>
      <div className="progs">
        {DEPT.programs.map((p) => {
          const body = (
            <>
              <span className="lvl">{p.level}</span>
              <b>{p.title}</b>
              {p.url && <span className="go">Дэлгэрэнгүй →</span>}
            </>
          )
          return p.url ? (
            <a
              key={p.title}
              className="prog"
              href={p.url}
              target="_blank"
              rel="noreferrer noopener"
            >
              {body}
            </a>
          ) : (
            <div key={p.title} className="prog">
              {body}
            </div>
          )
        })}
      </div>

      <h2>Судалгааны ажлын тэргүүлэх чиглэл</h2>
      <ol className="research">
        {DEPT.research.map((r) => (
          <li key={r}>{r}</li>
        ))}
      </ol>
    </section>
  )
}

export function Contact() {
  const c = DEPT.contact
  return (
    <section className="contact">
      <h2 style={{ margin: '0 0 .5rem' }}>Холбоо барих</h2>
      <dl className="rows">
        <div>
          <dt>Тэнхимийн хаяг</dt>
          <dd>{c.address}</dd>
        </div>
        <div>
          <dt>Э-мэйл хаяг</dt>
          <dd>
            <a href={`mailto:${c.email}`}>{c.email}</a>
          </dd>
        </div>
        <div>
          <dt>IG хуудас</dt>
          <dd>
            <a
              href={`https://www.instagram.com/${c.instagram}/`}
              target="_blank"
              rel="noreferrer noopener"
            >
              {c.instagram}
            </a>
          </dd>
        </div>
        <div>
          <dt>FB хуудас</dt>
          <dd>{c.facebook}</dd>
        </div>
      </dl>
    </section>
  )
}
