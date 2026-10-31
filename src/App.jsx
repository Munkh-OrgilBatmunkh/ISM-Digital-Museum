import { useState } from 'react'
import {
  Routes,
  Route,
  NavLink,
  Link,
  Navigate,
  useNavigate,
  useLocation,
} from 'react-router-dom'
import { useAuth } from './lib/auth.jsx'
import { supabase } from './lib/supabase'
import Home from './pages/Home.jsx'
import Exhibits from './pages/Exhibits.jsx'
import ExhibitDetail from './pages/ExhibitDetail.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Teachers from './pages/Teachers.jsx'
import Events from './pages/Events.jsx'
import EventDetail from './pages/EventDetail.jsx'
import Timeline from './pages/Timeline.jsx'
import Login from './pages/Login.jsx'

function Protected({ children }) {
  const { user, ready } = useAuth()
  const { pathname, search } = useLocation()
  if (!ready) return <p className="note">Ачаалж байна…</p>
  return user ? (
    children
  ) : (
    <Navigate to="/login" replace state={{ from: pathname + search }} />
  )
}

export default function App() {
  const { user } = useAuth()
  const nav = useNavigate()
  const { pathname } = useLocation()
  const [q, setQ] = useState('')
  const logout = async () => {
    await supabase.auth.signOut()
    nav('/')
  }
  const search = (e) => {
    e.preventDefault()
    nav(`/exhibits?q=${encodeURIComponent(q)}`)
  }

  return (
    <>
      <header className="nav">
        <div className="wrap">
          <Link to="/" className="brand">
            ISM<i>.</i>MUSEUM
          </Link>
          <nav>
            <NavLink to="/exhibits">Үзэсгэлэн</NavLink>
            <NavLink to="/timeline">Time Machine</NavLink>
            <NavLink to="/teachers">Багш нар</NavLink>
            <NavLink to="/events">Арга хэмжээ</NavLink>
            <NavLink to="/my">Миний бүтээл</NavLink>
          </nav>
          <form className="sbox" onSubmit={search} role="search">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Үзмэр хайх.."
              aria-label="Үзмэр хайх"
            />
            <button aria-label="Хайх">⌕</button>
          </form>
          {user ? (
            <button className="btn" onClick={logout}>
              Гарах
            </button>
          ) : (
            <Link className="btn" to="/login">
              Нэвтрэх
            </Link>
          )}
        </div>
      </header>
      <main className={pathname === '/login' ? '' : 'wrap'}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/exhibits" element={<Exhibits />} />
          <Route path="/exhibits/:id" element={<ExhibitDetail />} />
          <Route
            path="/my"
            element={
              <Protected>
                <Dashboard />
              </Protected>
            }
          />
          <Route path="/teachers" element={<Teachers />} />
          <Route path="/events" element={<Events />} />
          <Route path="/events/:id" element={<EventDetail />} />
          <Route path="/timeline" element={<Timeline />} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<p className="note">Хуудас олдсонгүй.</p>} />
        </Routes>
      </main>
      <footer className="foot">
        <div className="wrap">
          <b>ISM DIGITAL MUSEUM</b>
          <span>Мэдээллийн Системийн Менежментийн Тэнхим</span>
        </div>
      </footer>
    </>
  )
}
