import { useState } from 'react'
import './App.css'
import BookCard from './components/BookCard'
import SearchBar from './components/SearchBar'
import { useBooks } from './hooks/useBooks'

function App() {
  const { books, loading, error, reload } = useBooks()
  const [query, setQuery] = useState('')
  const [onlyAvailable, setOnlyAvailable] = useState(false)

  const normalizedQuery = query.trim().toLowerCase()
  const visibleBooks = books.filter((book) => {
    const matchesQuery =
      book.title.toLowerCase().includes(normalizedQuery) ||
      book.author.toLowerCase().includes(normalizedQuery)
    const matchesAvailability = !onlyAvailable || book.available
    return matchesQuery && matchesAvailability
  })

  const isEmpty = !loading && !error && books.length === 0
  const noMatches = books.length > 0 && visibleBooks.length === 0

  return (
    <section className="app">
      <h1>Book Library</h1>

      <SearchBar
        query={query}
        onQueryChange={setQuery}
        onlyAvailable={onlyAvailable}
        onOnlyAvailableChange={setOnlyAvailable}
      />

      {loading && <p>Loading...</p>}

      {error && (
        <div>
          <p>{error.message}</p>
          <button onClick={reload}>Retry</button>
        </div>
      )}

      {isEmpty && <p>No books yet.</p>}

      {noMatches && <p>No books match "{query}"</p>}

      {visibleBooks.length > 0 && (
        <div className="book-list">
          {visibleBooks.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      )}
    </section>
  )
}

export default App
