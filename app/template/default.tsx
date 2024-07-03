import type { ReactNode } from "react";

import { Header } from "~/components/header";
import { useOptionalUser, useProjects } from "~/utils/remix";
import { Link, useLocation } from "@remix-run/react";
import type { Project } from "~/model/api/project";
import { useState } from "react";

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

const JOIN_PATH = "/projects/join";
const CREATE_PATH = "/projects/create";

export default function DefaultTemplate({ children }: Props) {
  const user = useOptionalUser();
  const projects = useProjects();
  const currentPage = useLocation().pathname;
  const [showProjects, setShowProjects] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const projectClassName =
    ![CREATE_PATH, JOIN_PATH].includes(currentPage) && showProjects
      ? selectedClassNames
      : unSelectedClassnames;
  const joinClassName =
    currentPage === JOIN_PATH ? selectedClassNames : unSelectedClassnames;
  const createClassName =
    currentPage === CREATE_PATH ? selectedClassNames : unSelectedClassnames;
  const isLoggedIn = !!user;

  return (
    <div className="flex h-full flex-col">
      <div className="col-span-12 w-full">
        <Header
          isLoggedIn={isLoggedIn}
          loginHref="/login"
          onMenuClick={() => setShowMenu(!showMenu)}
        />
      </div>
      <div className="flex h-full flex-row justify-start md:gap-4">
        {isLoggedIn && (
          <div
            className={`${
              showMenu
                ? "absolute z-20 ease-in-out sm:max-w-full"
                : "translate-x-[-100%] overflow-hidden md:translate-x-0"
            } absolute h-full w-full grow-0 bg-indigo-300 p-4 transition-transform duration-500 ease-in-out md:relative md:block md:w-60 md:translate-x-0`}
          >
            <Link
              to="#"
              className={`inline-block w-full px-4 py-2 font-bold tracking-wide text-white transition-all duration-300 ease-in-out ${projectClassName}`}
              onClick={() => setShowProjects(!showProjects)}
            >
              Projects
            </Link>
            {projects?.length > 0 && (
              <div
                className={`ml-4 ${
                  showProjects ? "my-2 max-h-full" : "my-0 max-h-0"
                }
                overflow-hidden transition-height duration-500 `}
              >
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
              to={JOIN_PATH}
              className={`mt-4 inline-block w-full px-4 py-2 font-bold tracking-wide text-white transition-all duration-300 ease-in-out ${joinClassName}`}
            >
              Join Project
            </Link>
            <Link
              to={CREATE_PATH}
              className={`mt-4 inline-block w-full px-4 py-2 font-bold tracking-wide text-white transition-all duration-300 ease-in-out ${createClassName}`}
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
