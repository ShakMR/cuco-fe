import { ProjectNotFount } from "~/exceptions/projectNotFount";
import type { SingleProjectResponse } from "~/model/api/project";
import { fetchAPI, MethodEnum } from "~/models/api";
import type {
  ParticipationEntry,
  UserParticipationResponse,
  ParticipationResponse,
} from "~/model/api/participation";
import type UserModel from "~/model/api/user";

export async function fetchUserProjects(
  userUuid: string,
  token: string
): Promise<ParticipationResponse> {
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

async function joinUserToProjectByUuid(
  { user, projectUuid }: { user: UserModel; projectUuid: string },
  token: string
) {
  const { data, error } = await fetchAPI<UserParticipationResponse>(
    "/participation",
    {
      method: MethodEnum.POST,
      body: {
        userUuid: user.uuid,
        projectUuid: projectUuid,
      },
      authorization: token,
    }
  );

  if (error) {
    throw new Error(error.reason);
  }

  return data!;
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
): Promise<UserParticipationResponse> {
  const project = await fetchProjectByShortName(
    { shortName: projectShortName },
    token
  );

  if (!project) {
    throw new ProjectNotFount(projectShortName);
  }

  return joinUserToProjectByUuid(
    { user, projectUuid: project.data.uuid },
    token
  );
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

export async function createProject(
  {
    user,
    projectName,
  }: {
    user: UserModel;
    projectName: string;
  },
  token: string
): Promise<SingleProjectResponse["data"]> {
  const { data: newProject, error: newProjectError } = await fetchAPI<
    SingleProjectResponse["data"]
  >("/projects", {
    method: MethodEnum.POST,
    body: {
      name: projectName,
    },
    authorization: token,
  });

  if (newProjectError) {
    throw new Error(newProjectError.reason);
  }

  await joinUserToProjectByUuid({ user, projectUuid: newProject!.uuid }, token);

  return newProject!;
}
