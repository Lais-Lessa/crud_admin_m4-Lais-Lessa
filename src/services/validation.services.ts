import format from "pg-format";
import { client } from "../database";

export const checkExistingEmail = async (email: string) => {
  const query = format(
    `
    SELECT * FROM "users"
    WHERE "email" = %L`,
    email
  );

  const result = await client.query(query);

  return result;
};
