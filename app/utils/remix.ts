import { useMatches } from "@remix-run/react";
import { useMemo } from "react";
import type UserModel from "~/model/api/user";
import type { ParticipationResponse } from "~/model/api/participation";
import type { Project } from "~/model/api/project";

const DEFAULT_REDIRECT = "/";

/**
 * This should be used any time the redirect path is user-provided
 * (Like the query string on our login/signup pages). This avoids
 * open-redirect vulnerabilities.
 * @param {string} to The redirect destination
 * @param {string} defaultRedirect The redirect to use if the to is unsafe.
 */
export function safeRedirect(
  to: FormDataEntryValue | string | null | undefined,
  defaultRedirect: string = DEFAULT_REDIRECT
) {
  if (!to || typeof to !== "string") {
    return defaultRedirect;
  }

  if (!to.startsWith("/") || to.startsWith("//")) {
    return defaultRedirect;
  }

  return to;
}

/**
 * This base hook is used in other hooks to quickly search for specific data
 * across all loader data using useMatches.
 * @param {string} id The route id
 * @returns {JSON|undefined} The router data or undefined if not found
 */
export function useMatchesData<T = Record<string, unknown>>(
  id: string
): T | undefined {
  const matchingRoutes = useMatches();
  console.log(matchingRoutes);
  const route = useMemo(
    () => matchingRoutes.find((route) => route.id === id),
    [matchingRoutes, id]
  );
  return route?.data as T;
}

function isUser(user: any): user is UserModel {
  return user && typeof user === "object" && typeof user.email === "string";
}

export function useOptionalUser(): UserModel | undefined {
  const data = useMatchesData("root");
  if (!data || !isUser(data.user)) {
    return undefined;
  }
  return data.user;
}

export function useUser(): UserModel {
  const maybeUser = useOptionalUser();
  if (!maybeUser) {
    throw new Error(
      "No user found in root loader, but user is required by useUser. If user is optional, try useOptionalUser instead."
    );
  }
  return maybeUser;
}

export function validateEmail(email: unknown): email is string {
  return typeof email === "string" && email.length > 3 && email.includes("@");
}

export function useProjects(): Project[] {
  const data = useMatchesData("root");
  if (!data || !data.projects) {
    return [];
  }

  return data.projects as Project[];
}
