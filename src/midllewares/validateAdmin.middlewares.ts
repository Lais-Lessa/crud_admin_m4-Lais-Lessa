import { NextFunction, Request, Response } from "express";
import AppError from "../error";
import jwt, { JsonWebTokenError, Secret } from "jsonwebtoken";
import { Token } from "../interfaces/token.interface";

export const validateAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    throw new AppError("Missing bearer token", 401);
  }

  try {
    const tokenHash = jwt.verify(token, process.env.SECRET_KEY as Secret);
    const decoded = tokenHash as Token;

    if (!decoded.admin) {
      throw new AppError("Insufficient permission", 403);
    }
    return next();
  } catch (error) {
    if (error instanceof JsonWebTokenError) {
      throw new AppError("Invalid token", 401);
    }
    throw error;
  }
};
