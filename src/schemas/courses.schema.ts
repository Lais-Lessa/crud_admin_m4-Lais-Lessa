import { z } from "zod";

export const createCourseSchema = z.object({
  name: z.string(),
  description: z.string(),
});
export const courseSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
});
export const courseUserSchema = z.object({
  courseId: z.number(),
  userId: z.number(),
});

export const courseSchemaResponse = z.object({
  courseId: z.number(),
  courseName: z.string(),
  courseDescription: z.string(),
  userActiveInCourse: z.boolean(),
  userId: z.number(),
  userName: z.string(),
});

export type createCourseSchema = z.infer<typeof createCourseSchema>;
export type CourseSchema = z.infer<typeof courseSchema>;
export type courseSchemaResponse = z.infer<typeof courseSchemaResponse>;
export type courseUserSchema = z.infer<typeof courseUserSchema>;
