import mongoose from 'mongoose';
import {describe, it, expect, beforeAll, beforeEach, afterAll } from 'vitest';
import app from '../app.js';
import { Book } from '../models/book.js';
import request from 'supertest';
import { User } from '../models/user.js';
import { requireRole } from '../middleware/requireRole.js';


const validUser = {
  firstName: 'Test',
  lastName: 'User',
  email: 'test@example.com',
  password: 'password123',
  
};


const loginAs = async (role: 'member' | 'librarian' | 'admin') => {
  const agent = request.agent(app);

  const registerResponse = await agent.post('/api/auth/register').send(validUser);
  if (registerResponse.status !== 201) {
    throw new Error(`register failed with ${registerResponse.status}`);
  }

  await User.updateOne({ email: validUser.email }, { role });

  const loginResponse = await agent.post('/api/auth/login').send({
    email: validUser.email,
    password: validUser.password,
  });
  if (loginResponse.status !== 200) {
    throw new Error(`login failed with ${loginResponse.status}`);
  }

  return agent;
};
const newBook = {
      title: 'Book of  The Year',
      author: 'The Author',
      publishedYear: 2022,
      isbn: '1234567890',
      available: true,

}


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
  await User.deleteMany({})
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
    
    it('no cookies is generated', async ()=>{
          const res = await request(app).post('/api/books').send(newBook);
          expect(res.status).toBe(401);


    })
    it('Returns 403 for a member', async ()=>{
          const agent = await loginAs('member');
          const res = await agent.post('/api/books').send(newBook);
          expect(res.status).toBe(403);


    })
    it('if role is librarian throw 201', async ()=>{
      
        const agent = await loginAs('librarian');
          const res = await agent.post('/api/books').send(newBook);

            expect(res.body.title).toBe('Book of  The Year');
            expect(res.status).toBe(201);


    })
    describe('PUT /api/books/:id', () => {
  const updatedBook = { ...newBook, title: 'End of Year 2026' };

  const getBookId = async () => {
    const book = await Book.findOne({ title: 'Book One' });
    if (!book) throw new Error('Book not found');
    return book.id;
  };

  it('returns 401 without a cookie', async () => {
    const id = await getBookId();
    const res = await request(app).put(`/api/books/${id}`).send(updatedBook);
    expect(res.status).toBe(401);
  });

  it('returns 403 for a member', async () => {
    const id = await getBookId();
    const agent = await loginAs('member');
    const res = await agent.put(`/api/books/${id}`).send(updatedBook);
    expect(res.status).toBe(403);
  });

  it('updates the book for a librarian', async () => {
    const id = await getBookId();
    const agent = await loginAs('librarian');
    const res = await agent.put(`/api/books/${id}`).send(updatedBook);
    expect(res.status).toBe(200);
    expect(res.body.title).toBe('End of Year 2026');
    const saved = await Book.findById(id);
    expect(saved?.title).toBe('End of Year 2026');
  });

  it('returns 404 for an unknown id', async () => {
    const agent = await loginAs('librarian');
    const res = await agent.put('/api/books/000000000000000000000000').send(updatedBook);
    expect(res.status).toBe(404);
  });

  it('returns 400 for an invalid id', async () => {
    const agent = await loginAs('librarian');
    const res = await agent.put('/api/books/invalid-id').send(updatedBook);
    expect(res.status).toBe(400);
  });

  it('returns 400 for an invalid body', async () => {
    const id = await getBookId();
    const agent = await loginAs('librarian');
    const res = await agent.put(`/api/books/${id}`).send({ ...updatedBook, title: '' });
    expect(res.status).toBe(400);
  });
});

  
});
  
    
   


