import type { BackendUserResponse } from "~/model/api/user";
import type UserModel from "~/model/api/user";
import { fetchAPI, MethodEnum } from "~/models/api";
import { getUserToken } from "~/session.server";

export type { User } from "@prisma/client";

async function getUserOnPath(path: string, token: string) {
  const { data, error } = await fetchAPI<UserModel>(path, {
    method: MethodEnum.GET,
    authorization: token,
  });

  if (error) {
    return {
      error: error.originalError,
    };
  }

  return data!;
}

export async function getUserById(id: UserModel["uuid"], token: string) {
  return getUserOnPath(`/users/${id}`, token);
}

export async function getMe(token: string) {
  return getUserOnPath("/users/me", token);
}

export async function getUserByEmail(email: UserModel["email"]) {
  // return prisma.user.findUnique({ where: { email } });
}

export async function deleteUserByEmail(email: UserModel["email"]) {
  // return prisma.user.delete({ where: { email } });
}
