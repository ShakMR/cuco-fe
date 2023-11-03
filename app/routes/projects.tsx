import DefaultTemplate from "~/template/default";
import { Outlet } from "@remix-run/react";
import { useProjects } from "~/utils";

export default function Projects() {
  return (
    <>
      <DefaultTemplate>
        <Outlet />
      </DefaultTemplate>
    </>
  );
}
