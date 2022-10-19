import { NextApiRequest, NextApiResponse } from "next";
import { Session } from "next-auth";
import { getSession } from "next-auth/react";

interface Props {
  TVID: string | string[] | undefined;
  seasonID: string | string[] | undefined;
  session: Session | null;
}

async function retrieveSeasonData({ TVID, seasonID, session }: Props) {
  const url = new URL(`tv/${TVID}/season/${seasonID}`, process.env.NEXT_PUBLIC_TMDB_API);
  url.searchParams.append("api_key", process.env.NEXT_PUBLIC_TMDB_KEY || "");
  url.searchParams.append("append_to_response", "credits");
  if (session) url.searchParams.append("language", session.user.profile.language);

  const res = await fetch(url);
  const json = await res.json();

  return json;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });
  const { TVID, seasonID } = req.query;

  const data = await retrieveSeasonData({ TVID, seasonID, session });

  res.status(200).json({
    ...data,
  });
}
