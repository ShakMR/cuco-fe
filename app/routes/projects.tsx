import DefaultTemplate from "~/template/default";
import { Outlet } from "@remix-run/react";

export default function Projects() {
  return (
    <>
      <DefaultTemplate>
        <Outlet />
      </DefaultTemplate>
    </>
  );
}
