import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import BookListPage from './BookListPage'
import { useBooks } from '../hooks/useBooks'
import userEvent from '@testing-library/user-event'

vi.mock('../hooks/useBooks')
//Partial<ReturnType<typeof useBooks>> means that the overrides parameter
//  can be an object that contains any subset of the properties returned
//  by the useBooks hook. This allows us to override only the specific
//  properties we want to change for a particular test, while keeping 
// the rest of the properties at their default values.
const mockUseBooks = (overrides: Partial<ReturnType<typeof useBooks>> = {}) => {
  vi.mocked(useBooks).mockReturnValue({
    books: [],
    loading: false,
    error: null,
    reload: vi.fn(),
    ...overrides,
  })
}

 
describe('BookListPage', () => {
  it('shows Loading... while loading', () => {
      mockUseBooks({ loading: true })
    render(
      <MemoryRouter>
        <BookListPage />
          
        
      </MemoryRouter>
    )

    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })
  it('error: shows the error message and a Retry button, and clicking it calls reload once', async () => {
    
    const reload =  vi.fn()
   
      mockUseBooks({ error: new Error('Failed to fetch books'), reload })
//render the page should come first before clicking the Retry button, 
// otherwise the button won't be in the document yet
      render(
          <MemoryRouter>
              <BookListPage />
          </MemoryRouter>
        )
        //simulate a user clicking the Retry button
     const user = userEvent.setup()

     expect(screen.getByText('Failed to fetch books')).toBeInTheDocument()

      await user.click(screen.getByRole('button', { name: 'Retry' }))
      expect(reload).toHaveBeenCalledTimes(1)


  
    })
    it('empty: shows “No books yet” when the book list is empty', () => {
        mockUseBooks({ books: [] })
    render(
      <MemoryRouter>
        <BookListPage />
      </MemoryRouter>
    )

    expect(screen.getByText('No books yet.')).toBeInTheDocument()
  })
  it('search: with three books, typing “orwell” in the search box leaves only the matching book on the page', async () => {
    mockUseBooks({ books: [ { id: '1', title: '1984', author: 'George Orwell', isbn: '9780451524935', genre: 'Dystopian', publishedYear: 1949, available: false },
               { id: '2', title: 'Pride and Prejudice', author: 'Jane Austen', isbn: '9780141439518', genre: 'Romance', publishedYear: 1813, available: true }, 
               { id: '3', title: 'The Hobbit', author: 'J.R.R. Tolkien', isbn: '9780547928227', genre: 'Fantasy', publishedYear: 1937, available: true}
] })

     const user = userEvent.setup()

     render(
       <MemoryRouter>
         <BookListPage />
      </MemoryRouter>
     )
await user.type(screen.getByLabelText('Search'), 'orwell')


    expect(screen.getByText('1984')).toBeInTheDocument()
    expect(screen.queryByText('The Hobbit')).not.toBeInTheDocument()
  })

})