import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  MONGO_URI: z.string().url(),
  JWT_SECRET: z.string().min(32),
  PORT: z.string().optional().default('3000'),
  ALLOWED_ORIGINS: z.string().optional().default('http://localhost:4200')
});

type Env = z.infer<typeof envSchema>;

let env: Env;

try {
  env = envSchema.parse(process.env);
} catch (e) {
  console.error('❌ Invalid environment variables', e);
  process.exit(1);
}

export default env;
