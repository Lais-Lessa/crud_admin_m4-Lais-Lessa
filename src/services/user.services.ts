import format from "pg-format";
import { TUserSchema } from "../schemas/user.schemas";
import { client } from "../database";
import { QueryResult } from "pg";

export const create = async (payload: TUserSchema): Promise<QueryResult> => {
  const query = format(
    `
    INSERT INTO users (name, email, password, admin )
    VALUES (%L, %L, %L, %L)
    RETURNING *;
    `,
    payload.name,
    payload.email,
    payload.password,
    payload.admin
  );
  const result = await client.query(query);

  return result;
};

export const getUsers = async () => {
  const query = format(`
    SELECT id, name, email, admin
    FROM "users"
    `);

  const users = await client.query(query);

  return users.rows;
};
