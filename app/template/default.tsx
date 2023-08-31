import { ReactNode } from "react";

import { Header } from "~/components/header";
import { useOptionalUser } from "~/utils";
import { Link } from "@remix-run/react";
import type Project from "~/model/api/project";

type Props = {
  children: ReactNode
  currentPage?: "home" | "projects" | "joinProject"
  projects?: Project[]
}

const selectedClassNames = "border-b border-indigo-500 hover:border-indigo-100";
const unSelectedClassnames = "bg-indigo-500 rounded hover:bg-indigo-400";

const storeNavigationContext = (state: any) => {
  localStorage.setItem('navigationState', state);
}

export default function DefaultTemplate({ children, currentPage = "home", projects = [] }: Props) {
  const user = useOptionalUser();
  const isLoggedIn = !!user;
  const projectClassName = currentPage === "projects" ? selectedClassNames : unSelectedClassnames;
  const joinClassName = currentPage === "joinProject" ? selectedClassNames : unSelectedClassnames;

  // @ts-ignore
  return (
    <div className="flex flex-col h-full">
      <div className="col-span-12 w-full">
        <Header isLoggedIn={isLoggedIn} loginHref="/login" />
      </div>
      <div className="flex flex-row justify-start gap-4 h-full">
        {isLoggedIn && <div className="grow-0 w-60 bg-indigo-300 p-4">
          <Link
            to="/projects"
            className={"px-4 py-2 w-full inline-block text-white font-bold tracking-wide transition-all ease-in-out duration-300 " + projectClassName}
          >
            Projects
          </Link>
          {projects?.length > 0 && <div className="my-2 ml-4">
            {projects.map(({ name, shortName, uuid }) => (
              <Link
                key={shortName}
                to={`/projects/${shortName}`}
                className={"px-2 py-2 w-full inline-block text-indigo-700 tracking-wide transition-all ease-in-out duration-100 hover:text-white border-l box-border hover:translate-x-4 hover-sh"}
              >
                {name}
              </Link>
            ))}
          </div>}
          <Link
            to="/projects/join"
            className={"mt-4 px-4 py-2 w-full inline-block text-white font-bold tracking-wide transition-all ease-in-out duration-300 " + joinClassName}>
            Join Project
          </Link>
        </div>}
        <div className="grow col-start-3 col-end-13 p-4">
          {children}
        </div>
      </div>
    </div>
  );
}
