import { db } from "~/utils/db.server";
import bcrypt from "bcryptjs";
import type { User } from "@prisma/client";
import log, { Color } from "~/utils/log";
import { createCookieSessionStorage, redirect } from "@remix-run/node";
import type { Session } from "@remix-run/node";

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

  const isValidPassword = await bcrypt.compare(password, dbUser.passwordHash);
  if (!isValidPassword) return null as null;

  return {
    id: dbUser.id,
    username: dbUser.username,
  } as LoginFuncReturnUser;
}

const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) {
  throw new Error("SESSION_SECRET must be set");
}
const storage = createCookieSessionStorage({
  cookie: {
    name: "RJ_session",
    secure: process.env.NODE_ENV === "production",
    secrets: [sessionSecret],
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  },
});

export async function createUserSession(userId: string, redirectTo: string) {
  const session = await storage.getSession();
  session.set("userId", userId);
  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await storage.commitSession(session),
    },
  });
}

// getUserSession(request: Request)

export async function getUserSession(request: Request): Promise<Session> {
  const cookieHeader = request.headers.get("Cookie");
  const session = await storage.getSession(cookieHeader);

  return session as Session;
}

// getUserId(request: Request)

export async function getUserId(request: Request): Promise<User["id"] | null> {
  const session = await getUserSession(request);
  const userId = session.get("userId");

  if (!userId || typeof userId !== "string") return null as null;

  return userId as User["id"];
}

// requireUserId(request: Request, redirectTo)

export async function requireUserId(
  request: Request,
  redirectTo: string = new URL(request.url).pathname // by default we redirect to the same site the request came from
) {
  const session = await getUserSession(request);
  const userId = session.get("userId");
  if (!userId || typeof userId !== "string") {
    const searchParams = new URLSearchParams([["redirectTo", redirectTo]]);
    log(searchParams, Color.FgYellow);
    throw redirect(`/login?${searchParams}`);
  }
  return userId;
}
