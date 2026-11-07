import { useSearchParams } from 'react-router'
import SearchBar from '../components/SearchBar'
import BookCard from '../components/BookCard'
import { useBooks } from '../hooks/useBooks'
import { useState } from 'react'

export default function BookListPage() {

     const { books, loading, error, reload } = useBooks()
  const [searchParams, setSearchParams] = useSearchParams()
  const [onlyAvailable, setOnlyAvailable] = useState(false)
  const query = searchParams.get('q') ?? ''

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
    <div>
        <h1>Book Library</h1>
  <SearchBar
        query={query}
        onQueryChange={value => setSearchParams(new URLSearchParams({ q: value }), { replace: true }) }
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

    </div>
  )
}
