import './App.css'
import { Routes, Route, Link } from 'react-router'
import BookDetailPage from './pages/BookDetailPage'
import BookListPage from './pages/BookListPage'
import LoginPage from './pages/LoginPage'
import { useMe } from './hooks/useMe'
import { useLogout } from './hooks/useLogout'
import RegisterPage from './pages/RegisterPage'

function App() {
  const { user, loading } = useMe()
  const  logout  = useLogout()


  return (
    <section className="app">
    <header>
     <h2 className="logo"><Link  to="/">Book Library</Link> </h2> 
    <div className="user-info">
  {!loading && !user && <Link to="/login">Sign in</Link>}
  {user && (
    <>
      <span>Welcome, {user.firstName}  </span>
      <button type="button" onClick={() => logout.mutate()} disabled={logout.isPending}>
        Sign out
      </button>
    </>
  )}
</div>
    </header>
    <Routes>
      <Route path="/books/:id" element={<BookDetailPage  />} />
      <Route path="/" element={<BookListPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="*" element={<p>Page not found. <Link to="/">Go home</Link></p>} />
    </Routes>

    
    </section>
  )
}

export default App
