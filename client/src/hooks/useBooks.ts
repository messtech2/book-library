import type { Book } from '../types/book';
import { useQuery } from '@tanstack/react-query'



const fetchBooks = async (): Promise<Book[]> => {
  const response = await fetch('/api/books');
  if (!response.ok) {
    throw new Error('Failed to fetch books');
  }
  return response.json() as Promise<Book[]>;
  
}

export const useBooks = () => {
  const { data, isLoading, isError, error, refetch } = useQuery<Book[]>({
    queryKey: ['books'],
    queryFn: fetchBooks,
    retry: false, 
  })

  return { books: data ?? [], loading: isLoading, error: isError ? error : null, reload: () => { void refetch()}, }
}
   

