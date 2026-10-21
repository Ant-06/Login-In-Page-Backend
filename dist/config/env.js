"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const zod_1 = require("zod");
dotenv_1.default.config();
const envSchema = zod_1.z.object({
    MONGO_URI: zod_1.z.string().url(),
    JWT_SECRET: zod_1.z.string().min(32),
    REFRESH_TOKEN_SECRET: zod_1.z.string().min(32).optional(),
    PORT: zod_1.z.string().optional().default("3000"),
    ALLOWED_ORIGINS: zod_1.z.string().optional().default("http://localhost:4200"),
    NODE_ENV: zod_1.z
        .enum(["development", "test", "production"])
        .optional()
        .default("development"),
});
let env;
try {
    const parsed = envSchema.parse(process.env);
    env = {
        ...parsed,
        REFRESH_TOKEN_SECRET: parsed.REFRESH_TOKEN_SECRET || parsed.JWT_SECRET,
    };
}
catch (e) {
    console.error("❌ Invalid environment variables", e);
    process.exit(1);
}
exports.default = env;
//# sourceMappingURL=env.js.map