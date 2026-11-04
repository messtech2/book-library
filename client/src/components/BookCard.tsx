import type { Book } from '../types/book'


export default function BookCard(book: Book) {
  return (
<section className="book-card">
    <div className="book-card-content">

      <h2 className="book-title">{book.title}</h2>
      <div className="book-details">
      <p>{book.author}</p>
      <p>{book.genre}</p>
      <p>{book.publishedYear}</p>
      <p>{book.available ? 'Available' : 'Checked out'}</p>
    </div>

        
    </div>
    
  </section>


      
  )
}
