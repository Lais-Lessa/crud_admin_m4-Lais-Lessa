import { NextFunction, Request, Response } from "express";
import AppError from "../error";
import { checkExistingEmail } from "../services/validation.services";

export const validateEmailExist = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { email } = req.body;

  const existingUsers = await checkExistingEmail(email);

  if (existingUsers.rowCount > 0) {
    throw new AppError("Email already registered", 409);
  }

  return next();
};
