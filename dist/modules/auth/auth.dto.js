"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginSchema = exports.registerSchema = void 0;
const zod_1 = require("zod");
const emailSchema = zod_1.z.string().trim().email();
const passwordSchema = zod_1.z.string().trim().min(1);
exports.registerSchema = zod_1.z.object({
    email: emailSchema,
    password: passwordSchema
});
exports.loginSchema = zod_1.z.object({
    email: emailSchema,
    password: passwordSchema
});
//# sourceMappingURL=auth.dto.js.map