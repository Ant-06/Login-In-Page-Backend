"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const auth_dto_1 = require("./auth.dto");
const password_1 = require("../../utils/password");
const jwt_1 = require("../../utils/jwt");
const auth_repository_1 = require("./auth.repository");
class AuthService {
    // Registration
    static async register(email, password) {
        // Validate input
        const parsed = auth_dto_1.registerSchema.safeParse({ email, password });
        if (!parsed.success) {
            throw { status: 400, message: 'Invalid registration data' };
        }
        const existing = await (0, auth_repository_1.findUserByEmail)(email.toLowerCase().trim());
        if (existing) {
            throw { status: 409, message: 'User already exists' };
        }
        const hashed = await (0, password_1.hashPassword)(password);
        const user = await (0, auth_repository_1.createUser)(email.toLowerCase().trim(), hashed);
        return { id: user._id.toString(), email: user.email };
    }
    // Login
    static async login(email, password) {
        const parsed = auth_dto_1.loginSchema.safeParse({ email, password });
        if (!parsed.success) {
            throw { status: 400, message: 'Invalid login data' };
        }
        const user = await (0, auth_repository_1.findUserByEmail)(email.toLowerCase().trim());
        if (!user) {
            throw { status: 401, message: 'Invalid email or password' };
        }
        const passwordMatch = await (0, password_1.comparePassword)(password, user.password);
        if (!passwordMatch) {
            throw { status: 401, message: 'Invalid email or password' };
        }
        const token = (0, jwt_1.generateToken)({ userId: user._id.toString(), email: user.email }, '1h');
        return { token, user: { id: user._id.toString(), email: user.email } };
    }
    // Get profile (me)
    static async me(userId) {
        const user = await (0, auth_repository_1.findUserById)(userId);
        if (!user) {
            throw { status: 404, message: 'User not found' };
        }
        return { id: user._id.toString(), email: user.email };
    }
}
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map