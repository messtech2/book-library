import mongoose from 'mongoose';
import {describe, it, expect, beforeAll, beforeEach, afterAll } from 'vitest';
import app from '../app.js';
import { User } from '../models/user.js';
import request from 'supertest';



const validUser = {
  firstName: 'Test',
  lastName: 'User',
  email: 'test@example.com',
  password: 'password123',
  
};
describe('POST /api/auth/register', () => {

    beforeAll(async () => {
    const mongoUrl = process.env.MONGO_URL_TEST;
        if (!mongoUrl) {
            throw new Error('MONGO_URL_TEST is not defined');
        }
  await mongoose.connect(mongoUrl);

});

beforeEach(async () => {
  await User.deleteMany({});
 
});

afterAll(async () => {
    await mongoose.disconnect();
    });

  it('should return 201 and the body has email,role: member and id', async () => {
    const res = await request(app).post('/api/auth/register').send(validUser);

    expect(res.body).toHaveProperty('email');
    expect(res.body).toHaveProperty('role');
    expect(res.body.role).toBe('member');
    expect(res.body).toHaveProperty('id');
    expect(res.body).not.toHaveProperty('_id');
    expect(res.status).toBe(201);
  });
  
  
  it('The response never contains passwordHash or password', async () => {
    const res = await request(app).post('/api/auth/register').send(validUser);
    expect(res.body).not.toHaveProperty('passwordHash');
    expect(res.body).not.toHaveProperty('password');
    expect(res.status).toBe(201);
  });
  
  it('should return 400 for an invalid request body email', async () => {
    const res = await request(app).post('/api/auth/register').send({ ...validUser, email: 'invalid-email' });
    expect(res.status).toBe(400);
  });
  it('should return 400 for an invalid request body password', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ ...validUser, password: 'short' });
    expect(res.status).toBe(400);
  });
  

  it('should store a bcrypt hash, not the plain password', async () => {
  await request(app).post('/api/auth/register').send(validUser);
  const user = await User.findOne({ email: validUser.email });
  expect(user).not.toBeNull();
  // 1. the stored passwordHash must NOT equal validUser.password
  expect(user?.passwordHash).not.toBe(validUser.password);
  // 2. the stored passwordHash must start with "$2"
  expect(user?.passwordHash).toMatch(/^\$2[aby]\$/);
});

  it('should return 409 for an existing user', async () => {
    await request(app).post('/api/auth/register').send(validUser);//creats a user
    // Attempt to register the same user again
    const res = await request(app).post('/api/auth/register').send({ ...validUser, email: 'TEST@example.com' });
    expect(res.status).toBe(409);
    
    
    
  });
});