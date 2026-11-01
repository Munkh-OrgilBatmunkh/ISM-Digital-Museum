import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

export default function Carousel({ slides, interval = 4500, emptyText = '' }) {
  const [i, setI] = useState(0)
  const [paused, setPaused] = useState(false)
  const n = slides.length
  const cur = n ? i % n : 0

  useEffect(() => {
    if (n < 2 || paused) return
    const t = setInterval(() => setI((x) => x + 1), interval)
    return () => clearInterval(t)
  }, [n, paused, interval, i])

  if (!n) return <div className="car empty">{emptyText}</div>
  const go = (d) => setI(cur + d + n)
  const kbFocus = (e) => {
    try {
      return e.target.matches(':focus-visible')
    } catch {
      return false
    }
  }

  return (
    <div
      className="car"
      role="region"
      aria-roledescription="carousel"
      aria-label="Онцлох зургууд"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={(e) => kbFocus(e) && setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      {slides.map((s, k) => (
        <Link
          key={s.key}
          to={s.to}
          className={`slide ${k === cur ? 'on' : ''}`}
          aria-hidden={k !== cur}
          tabIndex={k === cur ? 0 : -1}
        >
          <img src={s.image} alt={s.title} />
          <span className="cap">{s.title}</span>
        </Link>
      ))}
      {n > 1 && (
        <>
          <button
            className="cnav prev"
            onClick={() => go(-1)}
            aria-label="Өмнөх зураг"
          >
            ‹
          </button>
          <button
            className="cnav next"
            onClick={() => go(1)}
            aria-label="Дараагийн зураг"
          >
            ›
          </button>
          <div className="dots">
            {slides.map((s, k) => (
              <button
                key={s.key}
                className={k === cur ? 'on' : ''}
                onClick={() => setI(k)}
                aria-label={`${k + 1}-р зураг`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
