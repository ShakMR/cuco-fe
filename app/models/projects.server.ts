import { ProjectNotFount } from "~/exceptions/projectNotFount";
import type { SingleProjectResponse } from "~/model/api/project";
import { fetchAPI, MethodEnum } from "~/models/api";
import type {
  ParticipationEntry,
  UserParticipationResponse,
} from "~/model/api/participation";
import type UserModel from "~/model/api/user";

type ProjectParticipation = ParticipationEntry;

export async function fetchUserProjects(
  userUuid: string,
  token: string
): Promise<{
  data: ProjectParticipation[]; // TODO change this for a proper participation response
  meta?: any;
}> {
  console.log("UUID", userUuid);
  const res = await fetchAPI(`/participation/user/${userUuid}`, {
    authorization: token,
  });

  if (res.error) {
    throw new Error(res.error.reason);
  }

  // how to deal with 404?

  const participation = res as UserParticipationResponse;
  return {
    data: participation.data.participation,
    meta: participation.meta,
  };
}

type FetchProjectByShortNameParams = {
  shortName: string;
};

export async function fetchProjectByShortName(
  { shortName }: FetchProjectByShortNameParams,
  token: string
): Promise<SingleProjectResponse> {
  const res = await fetchAPI(`/projects/search?shortName=${shortName}`, {
    authorization: token,
  });

  if (res.error) {
    throw new Error(res.error.reason);
  }

  return (res.data as SingleProjectResponse[])[0];
}

export async function joinUserToProject(
  {
    user,
    projectShortName,
  }: {
    user: UserModel;
    projectShortName: string;
  },
  token: string
) {
  const project = await fetchProjectByShortName(
    { shortName: projectShortName },
    token
  );

  if (!project) {
    throw new ProjectNotFount(projectShortName);
  }

  const { data, error } = await fetchAPI("/participation", {
    method: MethodEnum.POST,
    body: {
      userUuid: user.uuid,
      projectUuid: project.data.uuid,
    },
    authorization: token,
  });

  if (error) {
    throw new Error(error.reason);
  }

  return data;
}

export async function fetchProject(
  {
    user,
    projectShortName,
  }: {
    user: UserModel;
    projectShortName: string;
  },
  token: string
) {
  // TODO: use JWT token to authenticate user against server.
  console.log("LOGGED USER", user);
  return fetchProjectByShortName({ shortName: projectShortName }, token);
}
