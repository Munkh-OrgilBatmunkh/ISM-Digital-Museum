import { Routes, Route, NavLink, Link, useNavigate } from 'react-router-dom'
import { useAuth } from './lib/auth.jsx'
import { supabase } from './lib/supabase'
import Home from './pages/Home.jsx'
import Exhibits from './pages/Exhibits.jsx'
import ExhibitDetail from './pages/ExhibitDetail.jsx'
import ExhibitForm from './pages/ExhibitForm.jsx'
import { Teachers, Events, EventDetail } from './pages/Lists.jsx'
import Timeline from './pages/Timeline.jsx'
import Login from './pages/Login.jsx'

function Protected({ children }) {
  const { user, ready } = useAuth()
  if (!ready) return <p className="note">Ачаалж байна…</p>
  return user ? children : <Login />
}

export default function App() {
  const { user } = useAuth()
  const nav = useNavigate()
  const logout = async () => {
    await supabase.auth.signOut()
    nav('/')
  }

  return (
    <>
      <header className="top">
        <Link to="/" className="brand">
          ISM Digital Museum
        </Link>
        <nav>
          <NavLink to="/exhibits">Үзмэр</NavLink>
          <NavLink to="/teachers">Багш нар</NavLink>
          <NavLink to="/events">Арга хэмжээ</NavLink>
          <NavLink to="/timeline">Time Machine</NavLink>
        </nav>
        <div className="acct">
          {user ? (
            <>
              <Link className="btn" to="/exhibits/new">
                Бүтээл нэмэх
              </Link>
              <button className="btn ghost" onClick={logout}>
                Гарах
              </button>
            </>
          ) : (
            <Link className="btn" to="/login">
              Нэвтрэх
            </Link>
          )}
        </div>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/exhibits" element={<Exhibits />} />
          <Route
            path="/exhibits/new"
            element={
              <Protected>
                <ExhibitForm />
              </Protected>
            }
          />
          <Route path="/exhibits/:id" element={<ExhibitDetail />} />
          <Route
            path="/exhibits/:id/edit"
            element={
              <Protected>
                <ExhibitForm />
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
        Мэдээллийн Системийн Менежментийн Тэнхим · Internet Programming
      </footer>
    </>
  )
}
