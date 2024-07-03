import type APIResponse from "~/model/api/apiResponse";
import type { Project, SingleProjectResponse } from "~/model/api/project";
import type { BackendUserResponse } from "~/model/api/user";

export type ParticipationEntry = {
  data: {
    project: SingleProjectResponse;
  };
  share: number;
  joinedOn: Date;
};

export type UserParticipationResponse = APIResponse<{
  user: BackendUserResponse;
  participation: ParticipationEntry[];
}>;

export type ProjectParticipation = {
  data: SingleProjectResponse;
  participants: APIResponse<UserProjectParticipation>[];
  meta: any;
};

export type UserProjectParticipation = {
  user: BackendUserResponse;
  share: number;
  joinedOn: Date;
};

export type ParticipationResponse = {
  data: ParticipationEntry[];
  meta: any;
};
