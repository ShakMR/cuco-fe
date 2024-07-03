import { useLoaderData } from "@remix-run/react";
import type { LoaderArgs } from "@remix-run/node";
import format from "date-fns/format";
import { requireToken } from "~/session.server";
import { fetchProjectParticipants } from "~/models/projects.server";
import { json } from "@remix-run/node";
import type { UserProjectParticipation } from "~/model/api/participation";
import type ApiResponse from "~/model/api/apiResponse";
import { extract, sortByObjectKey } from "~/utils/arrays";

export const loader = async ({ request, params }: LoaderArgs) => {
  const token = await requireToken(request);
  const { shortName } = params;

  if (!shortName) {
    return json({ error: "404" });
  }

  try {
    const participants = await fetchProjectParticipants(shortName!, token);
    return json({ participants });
  } catch (err: any) {
    return json({ error: (err as Error).message });
  }
};

type UPP = Omit<UserProjectParticipation, "joinedOn"> & { joinedOn: string };

export default function ProjectConfig() {
  const data = useLoaderData<{
    participants?: ApiResponse<UPP>[];
    error?: string;
  }>();

  if (data.error && !data.participants) {
    return (
      <div className="text-red-500">Couldn't load details: {data.error}</div>
    );
  }

  const participants = extract<ApiResponse<UPP>, UPP>(
    data.participants!,
    "data"
  );
  const sortedParticipants = sortByObjectKey<UPP>(participants, "joinedOn");

  return (
    <div className="shadow- rounded border-2 p-4 shadow-md shadow-indigo-500">
      <section className="my-4">
        <h3 className="font-bold">Currency</h3>
        <span> Euro</span>
      </section>
      <section className="my-4">
        <h3 className="font-bold">Payment method</h3>
        <span> Debit </span>
      </section>
      <section className="my-4">
        <h3 className="font-bold">Users</h3>
        <div>
          {sortedParticipants.map(({ user, share, joinedOn }) => (
            <div className="row m-5 flex items-center gap-4">
              <div className="t h-10 w-10 rounded-3xl bg-gray-800 p-[0.75rem] text-center text-base/[1rem] text-white">
                <span>{user.data.name[0].toUpperCase()}</span>
              </div>
              <p>{user.data.name}</p>
              <p>{share}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
