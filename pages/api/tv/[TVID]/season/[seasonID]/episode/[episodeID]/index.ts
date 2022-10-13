import { NextApiRequest, NextApiResponse } from "next";

interface Props {
  TVID: string | string[] | undefined;
  seasonID: string | string[] | undefined;
  episodeID: string | string[] | undefined;
}

async function retrieveEpisodeData({ TVID, seasonID, episodeID }: Props) {
  const url = new URL(`tv/${TVID}/season/${seasonID}/episode/${episodeID}`, process.env.NEXT_PUBLIC_TMDB_API);
  url.searchParams.append("api_key", process.env.NEXT_PUBLIC_TMDB_KEY || "");
  url.searchParams.append("append_to_response", "credits");

  const res = await fetch(url);
  const json = await res.json();

  return json;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { TVID, seasonID, episodeID } = req.query;

  const data = await retrieveEpisodeData({ TVID, seasonID, episodeID });

  res.status(200).json({
    ...data,
  });
}
