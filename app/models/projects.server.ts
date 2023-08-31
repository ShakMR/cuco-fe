import type { User } from "@prisma/client";
import { ProjectNotFount } from "~/exceptions/projectNotFount";
import type Project from "~/model/api/project";
import type { SingleProjectResponse } from "~/model/api/project";

type ProjectParticipation = {
  project: SingleProjectResponse, share: number
}

export async function fetchUserProjects(userUuid: string): Promise<{
  data: ProjectParticipation[], // TODO change this for a proper participation response
  meta?: any
}[]> {
  const res = await fetch(`http://localhost:3000/api/participations/user/${userUuid}`);

  if (!res.ok && res.status !== 404) {
    const data = await res.json();
    throw new Error(data.error);
  }

  if (res.status === 404) {
    return { data: [], meta: null };
  }

  const participation = await res.json();
  return participation.data.participation;
}

export async function fetchProjectByShortName(shortName: string, includeExpenses: boolean = false): Promise<SingleProjectResponse> {
  const res = await fetch(`http://localhost:3000/api/projects/search?shortName=${shortName}&includeExpenses=${includeExpenses}`);

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.errors);
  }

  const responseBody = await res.json();

  console.log(responseBody);
  return responseBody.data[0];
}

export async function joinUserToProject({ user, projectShortName }: { user: User, projectShortName: string }) {
  const project = await fetchProjectByShortName(projectShortName);
  if (!project) {
    throw new ProjectNotFount(projectShortName);
  }

  const res = await fetch(`http://localhost:3000/api/participations/`, {
    method: "POST",
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      userUuid: user.externalId,
      projectUuid: project.data.uuid
    })
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.errors);
  }

  return res.json();
}

export async function fetchProject({ user, projectShortName }: { user: User, projectShortName: string }) {
  // TODO: use JWT token to authenticate user against server.
  console.log("LOGGED USER", user);
  return fetchProjectByShortName(projectShortName);
}
