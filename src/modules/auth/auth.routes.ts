import { Router } from 'express';
import { AuthController } from './auth.controller';
import { authenticateToken } from '../../middleware/auth.middleware';

const router = Router();

// Registration and login
router.post('/register', AuthController.register);
router.post('/login', AuthController.login);

// Protected routes
router.get('/me', authenticateToken, AuthController.me);
router.get('/dashboard', authenticateToken, AuthController.me); // backward compatible
router.get('/check', authenticateToken, async (req, res) => {
  // req.user set by middleware
  // @ts-ignore
  const user = req.user;
  return res.status(200).json({
    success: true,
    message: 'JWT Token is valid',
    tokenValid: true,
    user: { id: user?.userId, email: user?.email }
  });
});

export default router;
