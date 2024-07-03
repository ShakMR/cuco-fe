import type { Project } from "~/model/api/project";
import { Button, ButtonLink } from "~/components/button";
import { Toast } from "~/components/toast/Toast";
import { useState } from "react";

const getProjectShareLink = (
  project: WithAllOptionalExcept<Project, "shortName">
): string =>
  `${window.location.protocol}//${window.location.host}/join/project/${project.shortName}`;

const ProjectDetails = ({ name, shortName }: Project) => {
  const [shouldShowToast, setShouldShowToast] = useState<boolean>(false);
  return (
    <div className="row flex justify-between">
      <div className="row flex justify-start gap-4">
        <h1 className="text-3xl font-bold">{name}</h1>
        <sub className="text-lg italic text-gray-500">({shortName})</sub>
      </div>
      <div className="row flex gap-2">
        <Button
          cta="Share Join Link"
          className="text-base"
          onClick={async () => {
            const link = getProjectShareLink({ shortName });
            if (!navigator || !navigator.clipboard) {
              return console.error("Clipboard not available");
            }
            // @ts-ignore
            await navigator.clipboard.writeText(link);
            setShouldShowToast(true);
            setTimeout(() => setShouldShowToast(false), 1000);
          }}
        />
        <ButtonLink
          cta="Config"
          className="text-base"
          href={`${shortName}/config`}
        />
      </div>
      <Toast durationMs={300} text={"Copied"} show={shouldShowToast} />
    </div>
  );
};

export default ProjectDetails;
