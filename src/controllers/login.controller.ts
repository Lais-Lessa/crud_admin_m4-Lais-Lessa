import { Request, Response } from "express";
import { loginResponseSchema } from "../schemas/user.schemas";

export const loginUserController = (_req: Request, res: Response) => {
  const token = res.locals.token;
  const resToken = loginResponseSchema.parse({ token });

  return res.status(200).json(resToken);
};
