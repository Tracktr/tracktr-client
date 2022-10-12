import { NextApiRequest, NextApiResponse } from "next";

interface Props {
  TVID: string | string[] | undefined;
  seasonID: string | string[] | undefined;
}

async function retrieveSeasonData({ TVID, seasonID }: Props) {
  const url = new URL(`tv/${TVID}/season/${seasonID}`, process.env.NEXT_PUBLIC_TMDB_API);
  url.searchParams.append("api_key", process.env.NEXT_PUBLIC_TMDB_KEY || "");

  const res = await fetch(url);
  const json = await res.json();

  return json;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { TVID, seasonID } = req.query;

  const seasonData = await retrieveSeasonData({ TVID, seasonID });

  res.status(200).json({
    ...seasonData,
  });
}
