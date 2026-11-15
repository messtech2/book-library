import mongoose from 'mongoose'
import connectDb from './db.js'
import { Book } from './models/book.js'


// Seed the database with initial data
await connectDb()
const books = await Book.find()

// Check if the database is already seeded
if (books.length > 0) {
    console.log('Books already exist in the database. Skipping seeding.')
} else {
    await Book.deleteMany({})
    await Book.insertMany([])
    console.log(`Seeded ${books.length} books`)
}

await mongoose.disconnect()




