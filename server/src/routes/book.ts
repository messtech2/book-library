import express  from "express";
import mongoose from "mongoose";
import type { Request, Response } from "express";
import { Book } from "../models/book.js";
import { requireRole } from "../middleware/requireRole.js";
import { requireAuth } from "../middleware/requireAuth.js";
import { z } from "zod";



const bookSchema = z.object({
  title: z.string().min(1),
  author: z.string().min(1),
  genre: z.string().optional(),
  publishedYear: z.number().int(),
  isbn: z.string().optional(),
  available: z.boolean(),
});

const router = express.Router();


router.post('/books', requireAuth, requireRole('librarian', 'admin'), async (req: Request, res: Response) => {
  const parsedBody = bookSchema.safeParse(req.body);

  if (!parsedBody.success) {
    return res.status(400).json({ error: 'Invalid book data', issues: parsedBody.error.issues });
  }

  try {
    const book = new Book(parsedBody.data);
    await book.save();
    res.status(201).json(book);
  } catch (error) {
    console.error('Error creating book:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


//Get all books
router.get("/books", async (_req: Request, res: Response) => {
    try {
  const books = await Book.find();
  res.status(200).json(books);
} catch (error) {
    console.error("Error fetching books:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

//Get a book by ID
router.get("/books/:id", async (req: Request, res: Response) => {
    try {

  const { id } = req.params;
  if(!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ error: "Invalid book ID" });
  }

  const book = await Book.findById(id);

  if (!book) {
    return res.status(404).json({ error: "Book not found" });
  }
  
  res.status(200).json(book);

} catch (error) {
    console.error("Error fetching book:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


router.put("/books/:id", requireAuth, requireRole('librarian','admin') , async (req: Request, res: Response) => {
  
    const { id } = req.params;
    if(!mongoose.isValidObjectId(id)){
      return res.status(400).json({error: 'Invalid book ID'})
    }

    const parsedBody = bookSchema.safeParse(req.body);

      if (!parsedBody.success) {
    return res.status(400).json({ error: 'Invalid book data', issues: parsedBody.error.issues });
  }

    try {

       const book = await Book.findByIdAndUpdate(id, parsedBody.data,{
      returnDocument: 'after',           
      runValidators: true  
  }) 
   

  if (!book) {
    return res.status(404).json({ error: "Book not found" });
  }
  
  res.status(200).json(book);

} catch (error) {
    console.error('Error updating book:', error);
    res.status(500).json({ error: "Internal server error" });
  }
});




export const routes = router;