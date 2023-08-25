import express from "express";
import validateBody from "../midllewares/validateBody.middleware";
import { createCourseSchema } from "../schemas/courses.schema";
import { validateAdmin } from "../midllewares/validateAdmin.middlewares";
import {
  coursesController,
  createController,
  deleteCourseController,
  listUserController,
  userCourseController,
} from "../controllers/courses.controller";

const router = express.Router();

router.post(
  "/",
  validateBody(createCourseSchema),
  validateAdmin,
  createController
);

router.post("/:courseId/users/:userId", validateAdmin, userCourseController);

router.get("/", coursesController);

router.get("/:id/users/", validateAdmin, listUserController);

router.delete(
  "/:courseId/users/:userId",
  validateAdmin,
  deleteCourseController
);

export default router;
