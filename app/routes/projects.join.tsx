import { Form, useActionData } from "@remix-run/react";
import type { ActionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import TextField from "~/components/form/TextField";
import { useRef } from "react";
import { requireToken, requireUser } from "~/session.server";
import { joinUserToProject } from "~/models/projects.server";
import { ProjectNotFount } from "~/exceptions/projectNotFount";

export const action = async ({ request }: ActionArgs) => {
  const user = await requireUser(request);

  const formData = await request.formData();
  const shortName = formData.get("shortName");

  if (typeof shortName !== "string" || shortName.length === 0) {
    return json(
      { errors: { shortName: "Project Short name is required" } },
      { status: 400 }
    );
  }

  try {
    await joinUserToProject({ user, projectShortName: shortName }, user.token);

    return redirect(`/projects/${shortName}`);
  } catch (e) {
    if (e instanceof ProjectNotFount) {
      return json(
        { errors: { shortName: "Project not found" } },
        { status: 400 }
      );
    }
    return json({ errors: { shortName: "" } });
  }
};

export default function JoinProjects() {
  const actionData = useActionData<typeof action>();
  const shortNameRef = useRef<HTMLInputElement>(null);
  return (
    <Form method="post" className="container-md space-y-6">
      <TextField
        name="shortName"
        label="Project short name"
        error={actionData?.errors?.shortName}
        inputRef={shortNameRef}
      />

      <div className="text-right">
        <button
          type="submit"
          className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:bg-blue-400"
        >
          Join Project
        </button>
      </div>
    </Form>
  );
}
