import { z } from 'zod';

const emailSchema = z.string().trim().email();
const passwordSchema = z.string().trim().min(1);

export const registerSchema = z.object({
  email: emailSchema,
  password: passwordSchema
});

export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema
});
