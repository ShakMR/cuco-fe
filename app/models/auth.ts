import type UserModel from "~/model/api/user";
import { fetchAPI, MethodEnum } from "~/models/api";

export async function signup(
  email: UserModel["email"],
  name: string,
  password: string
): Promise<{ error?: Error }> {
  const { error } = await fetchAPI("/signup", {
    body: {
      email,
      name,
      password,
    },
    method: MethodEnum.POST,
  });

  if (error) {
    return { error: error.originalError };
  }

  return {};
}

export async function login(
  email: UserModel["email"],
  password: string
): Promise<{ token: string } | { error: string }> {
  const { data, error } = await fetchAPI<{ token: string }>("/login", {
    body: {
      email,
      password,
    },
    method: MethodEnum.POST,
  });

  if (error) {
    return { error: error.reason };
  }

  return { token: data!.token };
}
