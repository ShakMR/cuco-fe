import { Outlet, useLoaderData } from "@remix-run/react";
import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { requireToken, requireUser } from "~/session.server";
import { fetchProject } from "~/models/projects.server";
import invariant from "tiny-invariant";
import ExpenseList from "~/components/expense/ExpenseList";
import ProjectDetails from "~/components/project/ProjectDetails";
import { ButtonLink } from "~/components/button";

export async function loader({ params, request, context }: LoaderArgs) {
  const user = await requireUser(request);
  const token = await requireToken(request);
  invariant(params.shortName, "shortName not found");

  const project = await fetchProject(
    { user, projectShortName: params.shortName },
    token
  );

  if (!project || !project.data) {
    throw new Response("Not Found", { status: 404 });
  }

  return json(project);
}

export default function Project() {
  const project = useLoaderData();
  return (
    <div className="flex flex-col">
      <div className="mb-2 px-6 py-2">
        <ProjectDetails project={project.data} />
      </div>
      <h2 className="mb-2 text-xl font-bold italic">Expenses</h2>
      <div className="flex flex-row gap-6">
        <div className="grow">
          <ExpenseList expenses={project.expenses?.data} />
        </div>
        <div className="box-content">
          <ButtonLink
            className="rounded-full text-xl font-light"
            cta="+"
            href="#"
          />
          <Outlet />
        </div>
      </div>
    </div>
  );
}
