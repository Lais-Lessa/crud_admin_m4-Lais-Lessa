import format from "pg-format";
import { client } from "../database";
import AppError from "../error";
import { CourseSchema } from "../schemas/courses.schema";
import { QueryResult } from "pg";

export const userCourses = async (userId: number) => {
  const queryUsers = format(
    `SELECT * FROM "users" 
      WHERE "id" = %L`,
    userId
  );

  const result = await client.query(queryUsers);

  if (result.rowCount === 0) {
    throw new AppError("User/course not found", 404);
  }
  return result;
};

export const listCourses = async (userId: number) => {
  await userCourses(userId);

  const query = format(
    `
      SELECT
        u."id" AS "userId",
        u."name" AS "userName",
        c."id" AS "courseId",
        c."name" AS "courseName",
        c."description" AS "courseDescription",
        uc."active" AS "userActiveInCourse"
      FROM
        "users" u
        JOIN "userCourses" uc ON u."id" = uc."userId"
        JOIN "courses" c ON uc."courseId" = c."id"
      WHERE
        u."id" = %L;
    `,
    userId
  );

  const result = await client.query(query);
  return result;
};

export const createCourse = async (
  name: string,
  description: string
): Promise<CourseSchema> => {
  const query = format(
    "INSERT INTO courses (name, description) VALUES (%L, %L) RETURNING *",
    name,
    description
  );

  const result = await client.query(query);

  return result.rows[0];
};

export const courseExist = async (courseId: number) => {
  const query = format('SELECT * FROM "courses" WHERE "id" = %L', courseId);

  const result = await client.query(query);

  if (result.rowCount === 0) {
    throw new AppError("User/course not found", 404);
  }

  return result;
};

export const userExist = async (userId: number) => {
  const query = format('SELECT * FROM "users" WHERE "id" = %L', userId);
  const result = await client.query(query);

  if (result.rowCount === 0) {
    throw new AppError("User/course not found", 404);
  }
  return result;
};

export const addUserCourse = async (
  courseId: number,
  userId: number
): Promise<QueryResult> => {
  await courseExist(courseId);
  await userExist(userId);

  const query = format(
    `
      INSERT INTO "userCourses" ("userId", "courseId", active)
      VALUES (%L, %L, %L)
      RETURNING *;
      `,
    userId,
    courseId,
    true
  );
  const result = await client.query(query);

  return result;
};

export const getAllCourses = async () => {
  const query = `
  SELECT * FROM "courses"
  `;
  const result = await client.query(query);

  return result;
};

export const getUsersCourses = async (courseId: number) => {
  await courseExist(courseId);

  const query = format(
    `
  SELECT "users"."id" AS "userId",
  "users"."name" AS "userName",
  "courses"."id" AS "courseId",
  "courses"."name" AS "courseName",
  "courses"."description" AS "courseDescription",
  "userCourses"."active" AS "userActiveInCourse"
  FROM "userCourses"
  JOIN "users" ON "userCourses"."userId" = "users"."id"
  JOIN "courses" ON "userCourses"."courseId" = "courses"."id"
  WHERE "userCourses"."courseId" = %L
  `,
    courseId
  );

  const resultQuery = await client.query(query);

  return resultQuery;
};

export const deleteCourses = async (courseId: number, userId: number) => {
  await courseExist(courseId);
  await userExist(userId);

  const query = format(
    `
    UPDATE "userCourses"
    SET "active" = false
    WHERE "userId" = %L 
    AND "courseId" = %L
    RETURNING *;
    `,
    userId,
    courseId
  );

  const result = await client.query(query);

  return result;
};
