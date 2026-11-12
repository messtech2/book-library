import './App.css'
import { Routes, Route, Link } from 'react-router'
import BookDetailPage from './pages/BookDetailPage'
import BookListPage from './pages/BookListPage'

function App() {
 

  return (
    <section className="app">
    <header>
     <h2 className="logo"><Link  to="/">Book Library</Link> </h2> 
    </header>
    <Routes>
      <Route path="/books/:id" element={<BookDetailPage  />} />
      <Route path="/" element={<BookListPage />} />
      <Route path="*" element={<p>Page not found. <Link to="/">Go home</Link></p>} />
    </Routes>

    
    </section>
  )
}

export default App
