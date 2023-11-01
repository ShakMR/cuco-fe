import DefaultTemplate from "~/template/default";
import { Outlet, useLoaderData } from "@remix-run/react";
import { requireToken, requireUser } from "~/session.server";
import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { fetchUserProjects } from "~/models/projects.server";

export const loader = async ({ params, request }: LoaderArgs) => {
  const user = await requireUser(request);
  const token = await requireToken(request);
  const { data } = await fetchUserProjects(user.uuid, token);

  return json({
    projects: data.map(({ data: { project } }) => project.data),
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
