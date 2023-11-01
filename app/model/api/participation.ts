import type APIResponse from "~/model/api/apiResponse";
import type { BackendUserResponse } from "~/model/api/user";
import type { SingleProjectResponse } from "~/model/api/project";

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
