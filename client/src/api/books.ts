import type {Book} from '../types/book';
// Sample data for demonstration purposes
const sampleBooks: Book[] = [
    { id: '1', title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', isbn: '9780743273565', genre: 'Fiction', publishedYear: 1925, available: true },
    { id: '2', title: 'To Kill a Mockingbird', author: 'Harper Lee', isbn: '9780061120084', genre: 'Fiction', publishedYear: 1960, available: true },
    { id: '3', title: '1984', author: 'George Orwell', isbn: '9780451524935', genre: 'Dystopian', publishedYear: 1949, available: false },
    { id: '4', title: 'Pride and Prejudice', author: 'Jane Austen', isbn: '9780141439518', genre: 'Romance', publishedYear: 1813, available: true },
    { id: '5', title: 'The Catcher in the Rye', author: 'J.D. Salinger', isbn: '9780316769488', genre: 'Fiction', publishedYear: 1951, available: false },
    { id: '6', title: 'The Hobbit', author: 'J.R.R. Tolkien', isbn: '9780547928227', genre: 'Fantasy', publishedYear: 1937, available: true },
];
export const getBooks = async (): Promise<Book[]> => {
        // Simulate an API call delay
        await new Promise(resolve => setTimeout(resolve, 500));
    
        return sampleBooks;  
        
    };