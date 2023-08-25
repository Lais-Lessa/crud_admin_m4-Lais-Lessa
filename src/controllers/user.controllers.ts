import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { create, getUsers } from "../services/user.services";
import { TUserSchema, userResponseSchema } from "../schemas/user.schemas";
import { TUser } from "../__tests__/mocks/interfaces";

export const createUser = async (req: Request, res: Response) => {
  const data: TUserSchema = req.body;
  const hashedPassword = await bcrypt.hash(data.password, 10);
  const user: TUserSchema = { ...data, password: hashedPassword };
  const resultQuery = await create(user);

  const userData = resultQuery.rows[0];

  const createdUser = userResponseSchema.parse({
    id: userData.id,
    name: userData.name,
    email: userData.email,
    admin: userData.admin,
  });

  return res.status(201).json(createdUser);
};

export const getUserController = async (req: Request, res: Response) => {
  const users = await getUsers();
  const user = users.map((user: TUser) => ({
    id: user.id,
    name: user.name,
    email: user.email,
    admin: user.admin,
  }));

  return res.status(200).json(user);
};
