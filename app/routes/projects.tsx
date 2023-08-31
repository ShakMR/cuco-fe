import DefaultTemplate from "~/template/default";
import { Outlet, useLoaderData } from "@remix-run/react";
import { requireUser } from "~/session.server";
import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { fetchUserProjects } from "~/models/projects.server";
import Project from "~/model/api/project";

export const loader = async ({ params, request }: LoaderArgs) => {
  const user = await requireUser(request);
  const shortNameParam = params.shortName;
  const projects = await fetchUserProjects(user.uuid);

  return json({
    projects: projects.map(({ data: { project } }) => project.data),
  });
};

export default function Projects() {
  const loaderData = useLoaderData<typeof loader>();
  return (
    <>
      <DefaultTemplate currentPage="projects" projects={loaderData.projects}>
        <Outlet />
      </DefaultTemplate>
    </>
  );
}
