import TextField from "~/components/form/TextField";
import { Form, useActionData } from "@remix-run/react";
import { useRef } from "react";
import { ActionArgs } from "@remix-run/node";

const action = async ({params, request}: ActionArgs) => {
  const formData = await request.formData();
  const concept = formData.get("concept");
  const amount = formData.get("amount");
  const date = formData.get("date");
  const currency = formData.get("currency");

}

export default function AddNewExpense() {
  const actionData = useActionData<typeof action>();
  const conceptRef = useRef<HTMLInputElement>(null);
  const amountRef = useRef<HTMLInputElement>(null);
  const dateRef = useRef<HTMLInputElement>(null);
  const currencyRef = useRef<HTMLInputElement>(null);

  return (<Form method="post" className="space-y-6">
    <TextField
      name="concept"
      label="Concept"
      inputRef={conceptRef}
      required
      autoFocus={true}
      type="text"
      error={actionData?.errors?.concept}
    />

    <TextField
      name="amount"
      label="Amount"
      inputRef={amountRef}
      min={0}
      type="number"
      error={actionData?.errors?.amount}
    />

    <TextField
      name="date"
      label="Date"
      inputRef={dateRef}
      min={0}
      defaultValue={new Date().toISOString()}
      type="date"
      error={actionData?.errors?.date}
    />

    <TextField
      name="currency"
      label="Currency"
      inputRef={currencyRef}
      type="text"
      autoComplete="transaction-currency"
      defaultValue="EUR"
      error={actionData?.errors?.currency}
    />

  </Form>);
}
