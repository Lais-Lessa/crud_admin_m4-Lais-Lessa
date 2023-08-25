import { z } from "zod";

export const userSchema = z.object({
  id: z.string().optional(),
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
  admin: z.boolean().optional(),
});
export const userResponseSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().email(),
  admin: z.boolean(),
});

export const loginSchema = z.object({
  id: z.string().optional(),
  email: z.string().email(),
  password: z.string(),
});

export const loginResponseSchema = z.object({
  token: z.string(),
});

export type TUserSchema = z.infer<typeof userSchema>;
export type loginSchema = z.infer<typeof loginSchema>;
