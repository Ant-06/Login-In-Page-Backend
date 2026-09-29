import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { AuthRequest } from '../../middleware/auth.middleware';

export class AuthController {
  static async register(req: Request, res: Response) {
    const { email, password } = req.body ?? {};
    try {
      const user = await AuthService.register(email, password);
      return res.status(201).json({ success: true, message: 'User registered successfully', data: { user } });
    } catch (err: any) {
      const status = err.status || 500;
      const message = err.message || 'Server error';
      return res.status(status).json({ success: false, message, data: null });
    }
  }

  static async login(req: Request, res: Response) {
    const { email, password } = req.body ?? {};
    try {
      const result = await AuthService.login(email, password);
      return res.status(200).json({ success: true, message: 'Login successful', data: result });
    } catch (err: any) {
      const status = err.status || 500;
      const message = err.message || 'Server error';
      return res.status(status).json({ success: false, message, data: null });
    }
  }

  static async me(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, message: 'Access token required', data: null });
      }
      const user = await AuthService.me(req.user.userId);
      return res.status(200).json({ success: true, message: 'User profile', data: user });
    } catch (err: any) {
      const status = err.status || 500;
      const message = err.message || 'Server error';
      return res.status(status).json({ success: false, message, data: null });
    }
  }
}
