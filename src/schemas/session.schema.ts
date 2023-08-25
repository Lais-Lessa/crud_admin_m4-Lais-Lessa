import { z } from "zod";

export const sessionSchema = z.object({
  email: z.string().max(50).email(),
  password: z.string().max(120),
});
