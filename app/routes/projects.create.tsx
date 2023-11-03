import { Form, useActionData } from "@remix-run/react";
import { useRef } from "react";
import TextField from "~/components/form/TextField";
import type { ActionArgs } from "@remix-run/node";
import { requireToken, requireUser } from "~/session.server";
import { json, redirect } from "@remix-run/node";
import { createProject, joinUserToProject } from "~/models/projects.server";
import { ProjectNotFount } from "~/exceptions/projectNotFount";

export const action = async ({ request }: ActionArgs) => {
  const user = await requireUser(request);
  const token = await requireToken(request);

  const formData = await request.formData();
  const name = formData.get("name");

  if (typeof name !== "string" || name.length === 0) {
    return json(
      { errors: { name: "Project name is required" } },
      { status: 400 }
    );
  }

  try {
    const project = await createProject({ user, projectName: name }, token);

    return redirect(`/projects/${project.shortName}`);
  } catch (e) {
    console.error(e);
    if (e instanceof ProjectNotFount) {
      return json(
        { errors: { name: "Couldn't create project" } },
        { status: 400 }
      );
    }
    return json({ errors: { name: "" } });
  }
};

export default function CreateProject() {
  const actionData = useActionData<typeof action>();
  const shortNameRef = useRef<HTMLInputElement>(null);
  return (
    <Form method="post" className="container-md space-y-6">
      <TextField
        name="name"
        label="Project name"
        error={actionData?.errors?.name}
        inputRef={shortNameRef}
      />

      <div className="text-right">
        <button
          type="submit"
          className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:bg-blue-400"
        >
          Create new project
        </button>
      </div>
    </Form>
  );
}
