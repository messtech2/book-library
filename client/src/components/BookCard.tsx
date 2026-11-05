import type { Book } from '../types/book'

type BookCardProps = {
  book: Book
}

export default function BookCard({ book }: BookCardProps) {
  const { title, author, genre, publishedYear, available } = book

  return (
    <article className="book-card">
      <div className="book-card-content">
        <h2 className="book-title">{title}</h2>
        <div className="book-details">
          <p>{author}</p>
          <p>{genre}</p>
          <p>{publishedYear}</p>
          <p>{available ? 'Available' : 'Checked out'}</p>
        </div>
      </div>
    </article>
  )
}
