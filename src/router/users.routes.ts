import express from "express";
import validateBody from "../midllewares/validateBody.middleware";
import { userSchema } from "../schemas/user.schemas";
import { createUser, getUserController } from "../controllers/user.controllers";
import { validateEmailExist } from "../midllewares/validateEmail.middlewares";
import { validateAdmin } from "../midllewares/validateAdmin.middlewares";
import { listCoursesController } from "../controllers/courses.controller";

const userRouter = express.Router();

userRouter.post("/", validateBody(userSchema), validateEmailExist, createUser);

userRouter.get("/:id/courses", validateAdmin, listCoursesController);

userRouter.get("/", validateAdmin, getUserController);

export default userRouter;
