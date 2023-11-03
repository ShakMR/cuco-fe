import type APIResponse from "~/model/api/apiResponse";

export enum UserType {
  ghost = "ghost",
  user = "user",
}

type UserModel = {
  uuid: string;
  name: string;
  email: string;
  type: UserType;
};

export type BackendUserResponse = APIResponse<UserModel>;

export type UserWithToken = UserModel & {
  token: string;
};

export default UserModel;
