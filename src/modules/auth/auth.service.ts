import { registerSchema, loginSchema } from './auth.dto';
import { hashPassword, comparePassword } from '../../utils/password';
import { generateToken } from '../../utils/jwt';
import { findUserByEmail, createUser, findUserById } from './auth.repository';
import User, { IUser } from './user.model';

export class AuthService {
  // Registration
  static async register(email: string, password: string) {
    // Validate input
    const parsed = registerSchema.safeParse({ email, password });
    if (!parsed.success) {
      throw { status: 400, message: 'Invalid registration data' };
    }
    const existing = await findUserByEmail(email.toLowerCase().trim());
    if (existing) {
      throw { status: 409, message: 'User already exists' };
    }
    const hashed = await hashPassword(password);
    const user = await createUser(email.toLowerCase().trim(), hashed);
    return { id: user._id.toString(), email: user.email };
  }

  // Login
  static async login(email: string, password: string) {
    const parsed = loginSchema.safeParse({ email, password });
    if (!parsed.success) {
      throw { status: 400, message: 'Invalid login data' };
    }
    const user = await findUserByEmail(email.toLowerCase().trim());
    if (!user) {
      throw { status: 401, message: 'Invalid email or password' };
    }
    const passwordMatch = await comparePassword(password, user.password);
    if (!passwordMatch) {
      throw { status: 401, message: 'Invalid email or password' };
    }
    const token = generateToken({ userId: user._id.toString(), email: user.email }, '1h');
    return { token, user: { id: user._id.toString(), email: user.email } };
  }

  // Get profile (me)
  static async me(userId: string) {
    const user = await findUserById(userId);
    if (!user) {
      throw { status: 404, message: 'User not found' };
    }
    return { id: user._id.toString(), email: user.email };
  }
}
