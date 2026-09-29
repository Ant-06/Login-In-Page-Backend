import request from 'supertest';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import { MongoMemoryServer } from 'mongodb-memory-server';
import createApp from '../../../app';

let app = createApp();
let mongod: MongoMemoryServer;

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  process.env.MONGO_URI = uri;
  process.env.JWT_SECRET = 'testsecretkeytestsecretkeytestsecretkeytest';
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongod.stop();
});

describe('Auth Endpoints', () => {
  const user = { email: 'test@example.com', password: 'Password123' };

  it('should register a new user', async () => {
    const res = await request(app).post('/api/auth/register').send(user);
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
  });

  it('should not register duplicate user', async () => {
    const res = await request(app).post('/api/auth/register').send(user);
    expect(res.status).toBe(409);
    expect(res.body.success).toBe(false);
  });

  it('should login with correct credentials', async () => {
    const res = await request(app).post('/api/auth/login').send(user);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('token');
  });

  it('should fail login with wrong password', async () => {
    const res = await request(app).post('/api/auth/login').send({ email: user.email, password: 'wrong' });
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('should reject login with invalid email format', async () => {
    const res = await request(app).post('/api/auth/login').send({ email: 'not-an-email', password: 'Password123' });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('should reject login with missing password', async () => {
    const res = await request(app).post('/api/auth/login').send({ email: user.email });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('should reject register with missing required fields', async () => {
    const res = await request(app).post('/api/auth/register').send({ email: user.email });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('should access protected route with token', async () => {
    const loginRes = await request(app).post('/api/auth/login').send(user);
    const token = loginRes.body.data.token;
    const res = await request(app).get('/api/auth/me').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.email).toBe(user.email);
  });

  it('should reject protected route without token', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('should reject protected route with invalid token', async () => {
    const res = await request(app).get('/api/auth/me').set('Authorization', 'Bearer invalid.token.value');
    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
  });

  it('should reject protected route with expired token', async () => {
    const expiredToken = jwt.sign({ userId: 'expired-user', email: user.email }, process.env.JWT_SECRET!, { expiresIn: '-1h' });
    const res = await request(app).get('/api/auth/me').set('Authorization', `Bearer ${expiredToken}`);
    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
  });
});
