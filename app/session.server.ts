import { createCookieSessionStorage, redirect } from "@remix-run/node";
import invariant from "tiny-invariant";

import { getMe } from "~/models/user.server";
import type UserModel from "~/model/api/user";
import type { UserWithToken } from "~/model/api/user";

invariant(process.env.SESSION_SECRET, "SESSION_SECRET must be set");

export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "__session",
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secrets: [process.env.SESSION_SECRET],
    secure: process.env.NODE_ENV === "production",
  },
});

const TOKEN_SESSION_KEY = "token";

export async function getSession(request: Request) {
  const cookie = request.headers.get("Cookie");
  return sessionStorage.getSession(cookie);
}

export async function getUserToken(
  request: Request
): Promise<string | undefined> {
  const session = await getSession(request);
  return session.get(TOKEN_SESSION_KEY);
}

export async function getUser(request: Request): Promise<UserWithToken | null> {
  const token = await getUserToken(request);
  if (token === undefined) return null;

  const user = await getMe(token);

  if (!("error" in user)) {
    return {
      ...user,
      token,
    };
  }

  throw await logout(request);
}

export async function requireToken(
  request: Request,
  redirectTo: string = new URL(request.url).pathname
): Promise<string> {
  const token = await getUserToken(request);
  if (!token) {
    const searchParams = new URLSearchParams([["redirectTo", redirectTo]]);
    throw redirect(`/login?${searchParams}`);
  }
  return token;
}

export async function requireLogin(
  request: Request,
  redirectTo: string = new URL(request.url).pathname
) {
  return !!(await requireToken(request, redirectTo));
}

export async function requireUser(request: Request) {
  const token = await requireToken(request);

  const data = await getMe(token);
  if (!("error" in data)) {
    return {
      ...data,
      token,
    };
  }

  throw await logout(request);
}

export async function createUserSession({
  request,
  token,
  remember,
  redirectTo,
}: {
  request: Request;
  token: string;
  remember: boolean;
  redirectTo: string;
}) {
  const session = await getSession(request);
  session.set(TOKEN_SESSION_KEY, token);
  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await sessionStorage.commitSession(session, {
        maxAge: remember
          ? 300 // 5 minutes
          : 300,
      }),
    },
  });
}

export async function logout(request: Request) {
  const session = await getSession(request);
  return redirect("/", {
    headers: {
      "Set-Cookie": await sessionStorage.destroySession(session),
    },
  });
}
