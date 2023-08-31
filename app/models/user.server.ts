import type { BackendUserResponse } from "~/model/api/user";
import type UserModel from "~/model/api/user";
import { fetchAPI, MethodEnum } from "~/models/api";

export type { User } from "@prisma/client";

async function getUserOnPath(path: string) {
  const { data, error } = await fetchAPI<UserModel>(path, {
    method: MethodEnum.GET,
  });

  if (error) {
    return {
      error: error.originalError,
    };
  }

  return data!;
}

export async function getUserById(id: UserModel["uuid"]) {
  return getUserOnPath(`/users/${id}`);
}

export async function getMe() {
  return getUserOnPath("/users/me");
}

export async function getUserByEmail(email: UserModel["email"]) {
  // return prisma.user.findUnique({ where: { email } });
}

export async function deleteUserByEmail(email: UserModel["email"]) {
  // return prisma.user.delete({ where: { email } });
}

export async function verifyLogin(email: UserModel["email"], password: string) {
  // const userWithPassword = await prisma.user.findUnique({
  //   where: { email },
  //   include: {
  //     password: true,
  //   },
  // });
  //
  // if (!userWithPassword || !userWithPassword.password) {
  //   return null;
  // }
  //
  // const isValid = await bcrypt.compare(
  //   password,
  //   userWithPassword.password.hash
  // );
  //
  // if (!isValid) {
  //   return null;
  // }
  //
  // const { password: _password, ...userWithoutPassword } = userWithPassword;
  //
  // return userWithoutPassword;
}
