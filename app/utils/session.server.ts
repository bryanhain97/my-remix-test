import { db } from "~/utils/db.server";
import bcrypt from "bcryptjs";
import type { User } from "@prisma/client";

export type LoginFuncArgs = {
  username: User["username"];
  password: string;
};
export type LoginFuncReturnUser = {
  id: User["id"];
  username: User["username"];
};

export async function login({
  username,
  password,
}: LoginFuncArgs): Promise<LoginFuncReturnUser | null> {
  const dbUser = await db.user.findUnique({ where: { username } });
  if (!dbUser) return null as null;

  const isValidPassword = bcrypt.compare(password, dbUser.passwordHash);
  if (!isValidPassword) return null as null;

  return {
    id: dbUser.id,
    username: dbUser.username,
  } as LoginFuncReturnUser;
}
