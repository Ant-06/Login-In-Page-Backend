import dotenv from "dotenv";
import path from "node:path";
import { z } from "zod";

const nodeEnv = process.env.NODE_ENV || "development";

if (!["development", "test", "staging", "production"].includes(nodeEnv)) {
  console.error(`Invalid NODE_ENV: ${nodeEnv}`);
  process.exit(1);
}

const profilePath = path.resolve(process.cwd(), `.env.${nodeEnv}`);
const fallbackPath = path.resolve(process.cwd(), ".env");

dotenv.config({ path: profilePath });
dotenv.config({ path: fallbackPath });

const envSchema = z.object({
  MONGO_URI: z.string().url(),
  JWT_SECRET: z.string().min(32),
  REFRESH_TOKEN_SECRET: z.string().min(32).optional(),
  PORT: z.coerce.number().int().positive().default(3000),
  ALLOWED_ORIGINS: z
    .string()
    .default("http://localhost:4200"),
  NODE_ENV: z
    .enum(["development", "test", "staging", "production"])
    .default("development"),
});

const parsed = envSchema.safeParse({
  ...process.env,
  NODE_ENV: nodeEnv,
});

if (!parsed.success) {
  console.error("Invalid environment variables:");
  console.error(parsed.error.flatten().fieldErrors);
  process.exit(1);
}

const env = {
  ...parsed.data,
  REFRESH_TOKEN_SECRET:
    parsed.data.REFRESH_TOKEN_SECRET || parsed.data.JWT_SECRET,
};

export default env;