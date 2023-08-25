import { NextFunction, Request, Response } from "express";
import "express-async-errors";
import AppError from "../error";
import { z } from "zod";

const error = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ message: err.message });
  }
  if (error instanceof z.ZodError) {
    return res.status(400).json(error.flatten().fieldErrors);
  }
  console.log(err);
  return res.status(500).json({ message: "Internal Server Error" });
};

export default { error };
