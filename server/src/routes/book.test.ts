import mongoose from 'mongoose';
import {describe, it, expect, beforeAll, beforeEach, afterAll } from 'vitest';
import app from '../app.js';
import { Book } from '../models/book.js';
import request from 'supertest';


describe('books API', () => {
    beforeAll(async () => {
    const mongoUrl = process.env.MONGO_URL_TEST;
        if (!mongoUrl) {
            throw new Error('MONGO_URL_TEST is not defined');
        }
  await mongoose.connect(mongoUrl);

});

beforeEach(async () => {
  await Book.deleteMany({});
  await Book.insertMany([
    {
      title: 'Book One',
      author: 'Author One',
        publishedYear: 2020,
        isbn: '1234567890',
        available: true,
    },
    {
      title: 'Book Two',
      author: 'Author Two',
        publishedYear: 2021,
        isbn: '0987654321',
        available: false,
    },
  ]);
});

afterAll(async () => {
    await mongoose.disconnect();
    });

  it('should return 200 and two books', async () => {
    const res = await request(app).get('/api/books');
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(2);
    expect(res.body[0]).toHaveProperty('id');
    expect(res.body[0]).not.toHaveProperty('_id');
    expect(res.body[1]).toHaveProperty('id');
    expect(res.body[1]).not.toHaveProperty('_id');
  });
  
  
  it('should return 200 and the right title', async () => {
      const book = await Book.findOne({ title: 'Book One' });
      if (!book) throw new Error('Book not found');
      const res = await request(app).get(`/api/books/${book.id}`);
      expect(res.body.title).toBe('Book One');
      expect(res.body.id).toBe(book.id);
      expect(res.status).toBe(200);
    });
    
    
    it('should return 400 for an invalid id', async () => {
        const res = await request(app).get('/api/books/invalid-id');
        expect(res.status).toBe(400);
    });
    
        it('should return 404 for a non-existent id', async () => {
        const res = await request(app).get('/api/books/000000000000000000000000');
        expect(res.status).toBe(404);
    });
    
    
   
});

