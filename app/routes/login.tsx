import type { ActionArgs, LoaderArgs, V2_MetaFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, Link, useActionData, useSearchParams } from "@remix-run/react";
import { useEffect, useRef } from "react";

import { verifyLogin } from "~/models/user.server";
import { createUserSession, getUserToken } from "~/session.server";
import { safeRedirect, validateEmail } from "~/utils";
import DefaultTemplate from "~/template/default";
import TextField from "~/components/form/TextField";
import { login } from "~/models/auth";

export const loader = async ({ request }: LoaderArgs) => {
  const token = await getUserToken(request);
  if (token) return redirect("/home");
  return json({});
};

export const action = async ({ request }: ActionArgs) => {
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");
  const redirectTo = safeRedirect(formData.get("redirectTo"), "/");
  const remember = formData.get("remember");

  if (!validateEmail(email)) {
    return json(
      { errors: { email: "Email is invalid", password: null } },
      { status: 400 }
    );
  }

  if (typeof password !== "string" || password.length === 0) {
    return json(
      { errors: { email: null, password: "Password is required" } },
      { status: 400 }
    );
  }

  if (password.length < 8) {
    return json(
      { errors: { email: null, password: "Password is too short" } },
      { status: 400 }
    );
  }

  const { token, error } = await login(email, password);

  if (!token) {
    return json({ errors: { email: error, password: null } }, { status: 400 });
  }

  return createUserSession({
    redirectTo,
    remember: remember === "on",
    request,
    token,
  });
};

export const meta: V2_MetaFunction = () => [{ title: "Login" }];

export default function LoginPage() {
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "/projects";
  const actionData = useActionData<typeof action>();
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (actionData?.errors?.email) {
      emailRef.current?.focus();
    } else if (actionData?.errors?.password) {
      passwordRef.current?.focus();
    }
  }, [actionData]);

  return (
    <DefaultTemplate>
      <div className="flex min-h-full flex-col justify-center">
        <div className="mx-auto w-full max-w-md px-8">
          <Form method="post" className="space-y-6">
            <TextField
              name="email"
              label="Email address"
              inputRef={emailRef}
              required
              autoFocus={true}
              type="email"
              autoComplete="email"
              error={actionData?.errors?.email}
            />

            <TextField
              name="password"
              label="Password"
              inputRef={passwordRef}
              type="password"
              autoComplete="current-password"
              error={actionData?.errors?.password}
            />

            <input type="hidden" name="redirectTo" value={redirectTo} />
            <button
              type="submit"
              className="w-full rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:bg-blue-400"
            >
              Log in
            </button>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember"
                  name="remember"
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label
                  htmlFor="remember"
                  className="ml-2 block text-sm text-gray-900"
                >
                  Remember me
                </label>
              </div>
              <div className="text-center text-sm text-gray-500">
                Don't have an account?{" "}
                <Link
                  className="text-blue-500 underline"
                  to={{
                    pathname: "/join",
                    search: searchParams.toString(),
                  }}
                >
                  Sign up
                </Link>
              </div>
            </div>
          </Form>
        </div>
      </div>
    </DefaultTemplate>
  );
}
