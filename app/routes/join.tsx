import type { ActionArgs, LoaderArgs, V2_MetaFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, Link, useActionData, useSearchParams } from "@remix-run/react";
import { useEffect, useRef } from "react";

import { getUserToken } from "~/session.server";
import { safeRedirect, validateEmail } from "~/utils";
import DefaultTemplate from "~/template/default";
import TextField from "~/components/form/TextField";
import { signup } from "~/models/auth";

export const loader = async ({ request }: LoaderArgs) => {
  const token = await getUserToken(request);
  if (token) return redirect("/");
  return json({});
};

export const action = async ({ request }: ActionArgs) => {
  const formData = await request.formData();
  const email = formData.get("email");
  const name = formData.get("name");
  const password = formData.get("password");
  const redirectToLogin = safeRedirect(formData.get("redirectTo"), "/login");

  if (!validateEmail(email)) {
    return json(
      {
        errors: {
          email: "Email is invalid",
          password: null,
          name: null,
        },
      },
      { status: 400 }
    );
  }

  if (typeof name !== "string" || !name || name.length === 0) {
    return json(
      {
        errors: {
          email: null,
          password: null,
          name: "Display name is required",
        },
      },
      { status: 400 }
    );
  }

  if (typeof password !== "string" || password.length === 0) {
    return json(
      {
        errors: {
          email: null,
          password: "Password is required",
          name: null,
        },
      },
      { status: 400 }
    );
  }

  if (password.length < 8) {
    return json(
      {
        errors: {
          email: null,
          password: "Password is too short",
          name: null,
        },
      },
      { status: 400 }
    );
  }

  // const existingUser = await getUserByEmail(email);
  // if (existingUser) {
  //   return json(
  //     {
  //       errors: {
  //         email: "A user already exists with this email",
  //         password: null,
  //         name: null
  //       }
  //     },
  //     { status: 400 }
  //   );
  // }

  const { error } = await signup(email, name, password);

  if (error) {
    return json({
      errors: {
        email: `ERROR CREATING USER - ${error.message}`,
        password: null,
        name: null,
      },
    });
  }

  return redirect(redirectToLogin);
};

export const meta: V2_MetaFunction = () => [{ title: "Sign Up" }];

export default function Join() {
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") ?? undefined;
  const actionData = useActionData<typeof action>();
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (actionData?.errors?.email) {
      emailRef.current?.focus();
    } else if (actionData?.errors?.password) {
      passwordRef.current?.focus();
    } else if (actionData?.errors?.name) {
      nameRef.current?.focus();
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
              name="name"
              inputRef={nameRef}
              label="Display name"
              required
              type="text"
              error={actionData?.errors?.name}
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
              Create Account
            </button>
            <div className="flex items-center justify-center">
              <div className="text-center text-sm text-gray-500">
                Already have an account?{" "}
                <Link
                  className="text-blue-500 underline"
                  to={{
                    pathname: "/login",
                    search: searchParams.toString(),
                  }}
                >
                  Log in
                </Link>
              </div>
            </div>
          </Form>
        </div>
      </div>
    </DefaultTemplate>
  );
}
