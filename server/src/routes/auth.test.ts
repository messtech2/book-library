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
describe('POST /api/auth/register', () => {

 

  it('should return 201 and the body has email,role: member and id', async () => {
        const res = await request(app).post('/api/auth/register').send(validUser);

    expect(res.body).toHaveProperty('email');
    expect(res.body).toHaveProperty('role');
    expect(res.body.role).toBe('member');
    expect(res.body).toHaveProperty('id');
    expect(res.body).not.toHaveProperty('_id');
    expect(res.status).toBe(201);
  });

  it('ignores a role sent in the request body', async () => {
    const res = await request(app).post('/api/auth/register').send({ ...validUser, role: 'admin' });
    expect(res.status).toBe(201);
    expect(res.body.role).toBe('member');
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
describe('POST /api/auth/login', () => {


  it('Set-cookie header containing token= and HttpOnly', async () => {
    await request(app).post('/api/auth/register').send(validUser);    
const res = await request(app).post('/api/auth/login').send(validUser); 
expect(res.headers).toHaveProperty('set-cookie');
expect(res.headers['set-cookie']?.[0]).toMatch(/token=.+/);
expect(res.headers['set-cookie']?.[0]).toMatch(/HttpOnly/);
expect(res.status).toBe(200);                                         

  });
  
  
it('Wrong password gives 401', async () => {
  await request(app).post('/api/auth/register').send(validUser);
  const res = await request(app).post('/api/auth/login').send({ ...validUser, password: 'wrongPassword' });
  expect(res.status).toBe(401);
});
  
  it('Unknown email gives 401 with the same body as the wrong password;', async () => {
    await request(app).post('/api/auth/register').send(validUser);
const wrongPassword = await request(app).post('/api/auth/login').send({ ...validUser, password: 'wrongPassword' });
const unknownEmail = await request(app).post('/api/auth/login').send({ ...validUser, email: 'unknown@example.com' });
expect(wrongPassword.status).toBe(401);
expect(unknownEmail.status).toBe(401);
expect(unknownEmail.body).toEqual(wrongPassword.body);
  });

  it('Bad body gives 400', async () => {
    const res = await request(app).post('/api/auth/login').send({ ...validUser, email: 'invalid-email' });
    expect(res.status).toBe(400);
  });
  



});

//session cookie test
describe('Session cookie', () => {

  it('GET /api/auth/me with no cookie returns 401', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.status).toBe(401);
  });
  it('GET /api/auth/me with a garbage token returns 401', async () => {
    const res = await request(app).get('/api/auth/me').set('Cookie', 'token=garbage');
    expect(res.status).toBe(401);
  });
  it('Log in, then me returns 200 and no passwordHash', async () => {
    const agent = request.agent(app);
    await agent.post('/api/auth/register').send(validUser);
    await agent.post('/api/auth/login').send(validUser);
    const meRes = await agent.get('/api/auth/me');
    expect(meRes.status).toBe(200);
    expect(meRes.body).not.toHaveProperty('passwordHash');
  });
  it('returns 401 on me afetr logout', async () => {
    const agent = request.agent(app);
await agent.post('/api/auth/register').send(validUser);
await agent.post('/api/auth/login').send(validUser);
await agent.post('/api/auth/logout');
const meRes = await agent.get('/api/auth/me');
expect(meRes.status).toBe(401);
  });


});