import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import authRoutes from './modules/auth/auth.routes';
import errorMiddleware from './middleware/error.middleware';

const createApp = (): Application => {
  const app = express();
  // CORS with allowed origins from env
  const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:4200'];
  app.use(cors({ origin: allowedOrigins }));
  app.use(express.json());

  // routes
  app.use('/api/auth', authRoutes);

  // error handling
  app.use(errorMiddleware);

  // health route
  app.get('/', (req: Request, res: Response) => {
    res.json({ success: true, message: 'Angular Login API is running' });
  });

  return app;
};

export default createApp;
