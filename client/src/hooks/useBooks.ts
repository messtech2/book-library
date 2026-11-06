import books from '../data/books';
import type { Book } from '../types/book';
import { useQuery } from '@tanstack/react-query'


const SHOULD_FAIL = false // flip to true to test the error state

const fetchBooks = async (): Promise<Book[]> => {
  await new Promise((resolve) => setTimeout(resolve, 800))
  if (SHOULD_FAIL) throw new Error('Failed to fetch books')
  return books
}

export const useBooks = () => {
  const { data, isLoading, isError, error, refetch } = useQuery<Book[]>({
    queryKey: ['books'],
    queryFn: fetchBooks,
    retry: false, // Disable automatic retries
  })

  return { books: data ?? [], loading: isLoading, error: isError ? error : null, reload: () => { void refetch()}, }
}
   

