import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import env from '../config/env';

export interface AuthRequest extends Request {
  user?: { userId: string; email: string };
}

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ success: false, message: 'Access token required', tokenValid: false });
  }
  const [type, token] = authHeader.split(' ');
  if (type !== 'Bearer' || !token) {
    return res.status(401).json({ success: false, message: 'Invalid authorization format', tokenValid: false });
  }
  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as { userId: string; email: string };
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ success: false, message: 'Invalid or expired token', tokenValid: false });
  }
};
