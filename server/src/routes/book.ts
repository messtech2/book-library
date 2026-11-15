import express  from "express";
import mongoose from "mongoose";
import type { Request, Response } from "express";
import { Book } from "../models/book.js";


const router = express.Router();

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

export const routes = router;