import type { Project } from "~/model/api/project";
import { Button } from "~/components/button";

const getProjectShareLink = (
  project: WithAllOptionalExcept<Project, "shortName">
): string =>
  `${window.location.protocol}//${window.location.host}/join/project/${project.shortName}`;

const ProjectDetails = ({ name, shortName }: Project) => {
  return (
    <div className="row flex justify-between">
      <div className="row flex justify-start gap-4">
        <h1 className="text-3xl font-bold">{name}</h1>
        <sub className="text-lg italic text-gray-500">({shortName})</sub>
      </div>
      <div>
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
            alert("copied");
          }}
        />
      </div>
    </div>
  );
};

export default ProjectDetails;
