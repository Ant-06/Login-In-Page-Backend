"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const mongoose_1 = __importDefault(require("mongoose"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const mongodb_memory_server_1 = require("mongodb-memory-server");
const app_1 = __importDefault(require("../../../app"));
let app = (0, app_1.default)();
let mongod;
beforeAll(async () => {
    mongod = await mongodb_memory_server_1.MongoMemoryServer.create();
    const uri = mongod.getUri();
    process.env.MONGO_URI = uri;
    process.env.JWT_SECRET = 'testsecretkeytestsecretkeytestsecretkeytest';
    await mongoose_1.default.connect(uri);
});
afterAll(async () => {
    await mongoose_1.default.connection.dropDatabase();
    await mongoose_1.default.connection.close();
    await mongod.stop();
});
describe('Auth Endpoints', () => {
    const user = { email: 'test@example.com', password: 'Password123' };
    it('should register a new user', async () => {
        const res = await (0, supertest_1.default)(app).post('/api/auth/register').send(user);
        expect(res.status).toBe(201);
        expect(res.body.success).toBe(true);
    });
    it('should not register duplicate user', async () => {
        const res = await (0, supertest_1.default)(app).post('/api/auth/register').send(user);
        expect(res.status).toBe(409);
        expect(res.body.success).toBe(false);
    });
    it('should login with correct credentials', async () => {
        const res = await (0, supertest_1.default)(app).post('/api/auth/login').send(user);
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data).toHaveProperty('token');
    });
    it('should fail login with wrong password', async () => {
        const res = await (0, supertest_1.default)(app).post('/api/auth/login').send({ email: user.email, password: 'wrong' });
        expect(res.status).toBe(401);
        expect(res.body.success).toBe(false);
    });
    it('should reject login with invalid email format', async () => {
        const res = await (0, supertest_1.default)(app).post('/api/auth/login').send({ email: 'not-an-email', password: 'Password123' });
        expect(res.status).toBe(400);
        expect(res.body.success).toBe(false);
    });
    it('should reject login with missing password', async () => {
        const res = await (0, supertest_1.default)(app).post('/api/auth/login').send({ email: user.email });
        expect(res.status).toBe(400);
        expect(res.body.success).toBe(false);
    });
    it('should reject register with missing required fields', async () => {
        const res = await (0, supertest_1.default)(app).post('/api/auth/register').send({ email: user.email });
        expect(res.status).toBe(400);
        expect(res.body.success).toBe(false);
    });
    it('should access protected route with token', async () => {
        const loginRes = await (0, supertest_1.default)(app).post('/api/auth/login').send(user);
        const token = loginRes.body.data.token;
        const res = await (0, supertest_1.default)(app).get('/api/auth/me').set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data.email).toBe(user.email);
    });
    it('should reject protected route without token', async () => {
        const res = await (0, supertest_1.default)(app).get('/api/auth/me');
        expect(res.status).toBe(401);
        expect(res.body.success).toBe(false);
    });
    it('should reject protected route with invalid token', async () => {
        const res = await (0, supertest_1.default)(app).get('/api/auth/me').set('Authorization', 'Bearer invalid.token.value');
        expect(res.status).toBe(403);
        expect(res.body.success).toBe(false);
    });
    it('should reject protected route with expired token', async () => {
        const expiredToken = jsonwebtoken_1.default.sign({ userId: 'expired-user', email: user.email }, process.env.JWT_SECRET, { expiresIn: '-1h' });
        const res = await (0, supertest_1.default)(app).get('/api/auth/me').set('Authorization', `Bearer ${expiredToken}`);
        expect(res.status).toBe(403);
        expect(res.body.success).toBe(false);
    });
});
//# sourceMappingURL=auth.test.js.map