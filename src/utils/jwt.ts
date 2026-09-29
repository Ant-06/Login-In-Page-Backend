import jwt from 'jsonwebtoken';
import env from '../config/env';

export const generateToken = (payload: object, expiresIn: string = '1h'): string => {
  return (jwt as any).sign(payload, env.JWT_SECRET, { expiresIn });
};

export const verifyToken = (token: string): any => {
  return (jwt as any).verify(token, env.JWT_SECRET);
};
