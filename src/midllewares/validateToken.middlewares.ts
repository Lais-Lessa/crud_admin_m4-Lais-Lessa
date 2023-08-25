import { NextFunction, Request, Response } from "express";
import { loginSchema } from "../schemas/user.schemas";
import { checkExistingEmail } from "../services/validation.services";
import AppError from "../error";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const validateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const validateData: loginSchema = req.body;

  const userFind = await checkExistingEmail(validateData.email);
  const user = userFind.rows[0];
  if (!user) {
    throw new AppError("Wrong email/password", 401);
  }

  const matchPassword = await bcrypt.compare(
    validateData.password,
    user.password
  );

  if (!matchPassword) {
    throw new AppError("Wrong email/password", 401);
  }

  const secretKey = process.env.SECRET_KEY;

  if (!secretKey) {
    throw new AppError("Internal server error", 500);
  }

  const token = jwt.sign({ userId: user.id }, secretKey, {
    expiresIn: process.env.EXPIRES_IN,
  });

  res.locals.token = token;
  return next();
};
