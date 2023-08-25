import { NextFunction, Request, Response } from "express";
import { z, ZodError } from "zod";

const validateBody =
  (schema: z.ZodTypeAny) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedBody = schema.parse(req.body);

      req.body = validatedBody;

      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json(error.flatten().fieldErrors);
      }
    }
  };

export default validateBody;
