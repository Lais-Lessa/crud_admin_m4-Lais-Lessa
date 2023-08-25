import express from "express";
import userRouter from "./users.routes";
import coursesRouter from "./courses.router";
import { loginSchema } from "../schemas/user.schemas";
import { loginUserController } from "../controllers/login.controller";
import validateBody from "../midllewares/validateBody.middleware";
import { validateToken } from "../midllewares/validateToken.middlewares";

const router = express.Router();

router.use("/users", userRouter);

router.post(
  "/login",
  validateBody(loginSchema),
  validateToken,
  loginUserController
);

router.use("/courses", coursesRouter);

export default router;
