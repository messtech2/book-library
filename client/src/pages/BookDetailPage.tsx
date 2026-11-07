import { Link,  useParams } from 'react-router'
import { useBooks } from '../hooks/useBooks'

export default function BookDetailPage() {
  const { id } = useParams()
  const { books, loading, error, reload } = useBooks()
  const book = books.find((b) => b.id === id)

  return (
    <div>
      <Link to='/'>Back to library</Link>

      {loading && <p>Loading...</p>}

      {book && (
        <article>
          <h1 className="book-title">{book.title}</h1>
          <div className="book-details">
            <p>Author: {book.author}</p>
            <p>ISBN: {book.isbn}</p>
            <p>Genre: {book.genre}</p>
            <p>Published: {book.publishedYear}</p>
            <p>Status: {book.available ? 'Available' : 'Checked out'}</p>
          </div>
        </article>
      )}

      {!book && error && (
        <div>
          <p>{error.message}</p>
          <button onClick={reload}>Retry</button>
        </div>
      )}

      {!book && !loading && !error && <p>Book not found</p>}
    </div>
  )
}
