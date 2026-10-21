import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  MONGO_URI: z.string().url(),
  JWT_SECRET: z.string().min(32),
  REFRESH_TOKEN_SECRET: z.string().min(32).optional(),
  PORT: z.string().optional().default("3000"),
  ALLOWED_ORIGINS: z.string().optional().default("http://localhost:4200"),
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .optional()
    .default("development"),
});

type Env = z.infer<typeof envSchema>;

let env: Env;

try {
  const parsed = envSchema.parse(process.env);
  env = {
    ...parsed,
    REFRESH_TOKEN_SECRET: parsed.REFRESH_TOKEN_SECRET || parsed.JWT_SECRET,
  };
} catch (e) {
  console.error("❌ Invalid environment variables", e);
  process.exit(1);
}

export default env;
