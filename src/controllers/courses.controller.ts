import { Request, Response } from "express";
import AppError from "../error";
import {
  addUserCourse,
  createCourse,
  deleteCourses,
  getAllCourses,
  getUsersCourses,
  listCourses,
} from "../services/courses.service";
import { courseSchemaResponse } from "../schemas/courses.schema";

export const listCoursesController = async (req: Request, res: Response) => {
  const userId = parseInt(req.params.id, 10);

  if (isNaN(userId)) {
    throw new AppError("Invalid user ID", 400);
  }

  const courses = await listCourses(userId);
  if (courses.rowCount === 0) {
    throw new AppError("No course found", 404);
  }

  const validated = courses.rows.map((course) =>
    courseSchemaResponse.parse(course)
  );

  return res.status(200).json(validated);
};

export const createController = async (req: Request, res: Response) => {
  const { name, description } = req.body;

  const validated = await createCourse(name, description);

  res.status(201).json(validated);
};

export const userCourseController = async (req: Request, res: Response) => {
  const courseId = Number(req.params.courseId);
  const userId = Number(req.params.userId);

  await addUserCourse(courseId, userId);

  return res
    .status(201)
    .json({ message: "User successfully vinculed to course" });
};

export const coursesController = async (req: Request, res: Response) => {
  const courses = await getAllCourses();

  res.status(200).json(courses.rows);
};

export const listUserController = async (req: Request, res: Response) => {
  const courseId = Number(req.params.id);

  const coursesByUser = await getUsersCourses(courseId);

  res.status(200).json(coursesByUser.rows);
};

export const deleteCourseController = async (req: Request, res: Response) => {
  const { courseId, userId } = req.params;

  await deleteCourses(Number(courseId), Number(userId));

  res.status(204).send();
};
