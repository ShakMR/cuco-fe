import { Form, Outlet, useActionData, useLoaderData } from "@remix-run/react";
import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { requireToken, requireUser } from "~/session.server";
import { fetchProject } from "~/models/projects.server";
import invariant from "tiny-invariant";
import ExpenseList from "~/components/expense/ExpenseList";
import ProjectDetails from "~/components/project/ProjectDetails";
import { Button } from "~/components/button";
import TextField from "~/components/form/TextField";
import { useRef, useState } from "react";
import { addExpenseToProject } from "~/models/expenses.server";
import { ProjectNotFount } from "~/exceptions/projectNotFount";

export async function loader({ params, request, context }: LoaderArgs) {
  const user = await requireUser(request);
  const token = await requireToken(request);
  invariant(params.shortName, "shortName not found");

  const project = await fetchProject(
    { user, projectShortName: params.shortName, withExpenses: true },
    token
  );

  if (!project || !project.data) {
    throw new Response("Not Found", { status: 404 });
  }

  return json(project);
}

type FormErrors = {
  errors?: {
    concept?: string;
    amount?: string;
  };
  status?: number;
};

export const action = async ({ request }: ActionArgs): Promise<FormErrors> => {
  const user = await requireUser(request);

  const formData = await request.formData();
  const amount = formData.get("amount");
  const concept = formData.get("concept");
  const projectUuid = formData.get("projectUuid")!;

  if (!amount || isNaN(parseFloat(amount.toString()))) {
    return json({ errors: { amount: "Isn't a valid number" }, status: 400 });
  }

  if (!concept) {
    return json({ errors: { concept: "Required" }, status: 400 });
  }

  try {
    await addExpenseToProject(
      {
        project: {
          uuid: projectUuid.toString(),
        },
        expense: {
          amount: parseFloat(amount.toString()),
          concept: concept.toString(),
          currency: "eur",
          paymentType: "debit",
          date: new Date(),
        },
      },
      user.token
    );
    return json({});
  } catch (e) {
    if (e instanceof ProjectNotFount) {
      return json(
        { errors: { concept: "Project not found" } },
        { status: 400 }
      );
    }
    return json({ errors: { concept: "" } });
  }
};

export default function Project() {
  const project = useLoaderData();
  const actionData = useActionData<FormErrors>();

  const [showExpensesForm, setShowExpensesForm] = useState(true);

  return (
    <div className="flex flex-col">
      <div className="mb-2 py-2 pb-6">
        <ProjectDetails {...project.data} />
      </div>
      <Outlet />
      <h2 className="mb-2 text-xl font-bold italic">Expenses</h2>
      <div className="flex flex-row gap-6">
        <div className="grow overflow-scroll">
          <ExpenseList expenses={project.expenses?.data} />
        </div>
        <div className="box-content text-right">
          <Button
            className={`rounded-full text-xl font-light md:hidden`}
            cta="+"
            onClick={() => {
              setShowExpensesForm(!showExpensesForm);
            }}
          />
          <Form method="post">
            <h3 className="font-bold">Add a new expense</h3>
            <div
              className={`${
                showExpensesForm ? "max-h-full p-2" : "max-h-0 p-0"
              } transition-height" flex flex-col gap-8 overflow-hidden text-left duration-500 ease-in-out`}
            >
              <input
                type="hidden"
                value={project.data.uuid}
                name="projectUuid"
              />
              <TextField
                name="concept"
                label="Expense concept"
                placeholder="Random Concept"
                error={actionData?.errors?.concept}
              />
              {/* add currency */}
              <TextField
                name="amount"
                label="Amount"
                type="number"
                placeholder="10.00"
                error={actionData?.errors?.amount}
              />
              <Button cta="Add expense" onClick={() => {}} />
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}
