import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import BookCard from './BookCard'

    const book = {
  id: '1',
  title: 'The Great Gatsby',
  author: 'F. Scott Fitzgerald',
  isbn: '9780743273565',
  genre: 'Classic',
  publishedYear: 1925,
    available: false,
}
describe('BookCard', () => {
  it('should display the book title', () => {
    render(
      <MemoryRouter>
        <BookCard
          book={{
            ...book,
            title: 'The Great Gatsby',
          }}
        />
      </MemoryRouter>
    )

    expect(screen.getByText('The Great Gatsby')).toBeInTheDocument()
  })
  it('shows "Available" when the book is available', () => {
      render(
        <MemoryRouter>
          <BookCard
            book={{
             ...book,
              available: true,
            }}
          />
        </MemoryRouter>
      )
  
      expect(screen.getByText('Available')).toBeInTheDocument()
    })
    it('shows "Checked out" when the book is not available', () => {
    render(
      <MemoryRouter>
        <BookCard
          book={{
            ...book,
            available: false,
          }}
        />
      </MemoryRouter>
    )

    expect(screen.getByText('Checked out')).toBeInTheDocument()
  })
})