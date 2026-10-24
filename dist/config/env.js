"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const node_path_1 = __importDefault(require("node:path"));
const zod_1 = require("zod");
const nodeEnv = process.env.NODE_ENV || "development";
if (!["development", "test", "staging", "production"].includes(nodeEnv)) {
    console.error(`Invalid NODE_ENV: ${nodeEnv}`);
    process.exit(1);
}
const profilePath = node_path_1.default.resolve(process.cwd(), `.env.${nodeEnv}`);
const fallbackPath = node_path_1.default.resolve(process.cwd(), ".env");
dotenv_1.default.config({ path: profilePath });
dotenv_1.default.config({ path: fallbackPath });
const envSchema = zod_1.z.object({
    MONGO_URI: zod_1.z.string().url(),
    JWT_SECRET: zod_1.z.string().min(32),
    REFRESH_TOKEN_SECRET: zod_1.z.string().min(32).optional(),
    PORT: zod_1.z.coerce.number().int().positive().default(3000),
    ALLOWED_ORIGINS: zod_1.z
        .string()
        .default("http://localhost:4200"),
    NODE_ENV: zod_1.z
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
    REFRESH_TOKEN_SECRET: parsed.data.REFRESH_TOKEN_SECRET || parsed.data.JWT_SECRET,
};
exports.default = env;
//# sourceMappingURL=env.js.map