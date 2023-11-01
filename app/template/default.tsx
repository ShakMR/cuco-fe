import type { ReactNode } from "react";

import { Header } from "~/components/header";
import { useOptionalUser } from "~/utils";
import { Link } from "@remix-run/react";
import type Project from "~/model/api/project";

type Props = {
  children: ReactNode;
  currentPage?: "home" | "projects" | "joinProject";
  projects?: Project[];
};

const selectedClassNames = "border-b border-indigo-500 hover:border-indigo-100";
const unSelectedClassnames = "bg-indigo-500 rounded hover:bg-indigo-400";

const storeNavigationContext = (state: any) => {
  localStorage.setItem("navigationState", state);
};

export default function DefaultTemplate({
  children,
  currentPage = "home",
  projects = [],
}: Props) {
  const user = useOptionalUser();
  const isLoggedIn = !!user;
  const projectClassName =
    currentPage === "projects" ? selectedClassNames : unSelectedClassnames;
  const joinClassName =
    currentPage === "joinProject" ? selectedClassNames : unSelectedClassnames;

  // @ts-ignore
  return (
    <div className="flex h-full flex-col">
      <div className="col-span-12 w-full">
        <Header isLoggedIn={isLoggedIn} loginHref="/login" />
      </div>
      <div className="flex h-full flex-row justify-start gap-4">
        {isLoggedIn && (
          <div className="w-60 grow-0 bg-indigo-300 p-4">
            <Link
              to="/projects"
              className={
                "inline-block w-full px-4 py-2 font-bold tracking-wide text-white transition-all duration-300 ease-in-out " +
                projectClassName
              }
            >
              Projects
            </Link>
            {projects?.length > 0 && (
              <div className="my-2 ml-4">
                {projects.map(({ name, shortName, uuid }) => (
                  <Link
                    key={shortName}
                    to={`/projects/${shortName}`}
                    className={
                      "hover-sh box-border inline-block w-full border-l px-2 py-2 tracking-wide text-indigo-700 transition-all duration-100 ease-in-out hover:translate-x-4 hover:text-white"
                    }
                  >
                    {name}
                  </Link>
                ))}
              </div>
            )}
            <Link
              to="/projects/join"
              className={
                "mt-4 inline-block w-full px-4 py-2 font-bold tracking-wide text-white transition-all duration-300 ease-in-out " +
                joinClassName
              }
            >
              Join Project
            </Link>
            <Link
              to="/projects/create"
              className={
                "mt-4 inline-block w-full px-4 py-2 font-bold tracking-wide text-white transition-all duration-300 ease-in-out " +
                joinClassName
              }
            >
              Create new Project
            </Link>
          </div>
        )}
        <div className="col-start-3 col-end-13 grow p-4">{children}</div>
      </div>
    </div>
  );
}
