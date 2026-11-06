import { useEffect, useState } from 'react';
import books from '../data/books';
import type { Book } from '../types/book';

const SHOULD_FAIL = false // flip to true to test the error state

const fetchBooks = async (): Promise<Book[]> => {
  await new Promise((resolve) => setTimeout(resolve, 800))
  if (SHOULD_FAIL) throw new Error('Failed to fetch books')
  return books
}

export const useBooks = () => {
  const [data, setData] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    let ignore = false
    fetchBooks()
      .then((result) => { if (!ignore) setData(result) })
      .catch((err: Error) => { if (!ignore) setError(err) })
      .finally(() => { if (!ignore) setLoading(false) })
    return () => { ignore = true }
  }, [attempt])

  const reload = () => {
    setLoading(true)
    setError(null)
    setAttempt((a) => a + 1)
  }

  return { books: data, loading, error, reload }
}