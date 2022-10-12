import { NextApiRequest, NextApiResponse } from "next";

interface Props {
  TVID: string | string[] | undefined;
  seasonID: string | string[] | undefined;
  episodeID: string | string[] | undefined;
}

async function retrieveEpisodeData({ TVID, seasonID, episodeID }: Props) {
  const url = new URL(`tv/${TVID}/season/${seasonID}/episode/${episodeID}`, process.env.NEXT_PUBLIC_TMDB_API);
  url.searchParams.append("api_key", process.env.NEXT_PUBLIC_TMDB_KEY || "");

  const res = await fetch(url);
  const json = await res.json();

  return json;
}

async function retrieveEpisodeCastData({ TVID, seasonID, episodeID }: Props) {
  const url = new URL(`tv/${TVID}/season/${seasonID}/episode/${episodeID}/credits`, process.env.NEXT_PUBLIC_TMDB_API);
  url.searchParams.append("api_key", process.env.NEXT_PUBLIC_TMDB_KEY || "");

  const res = await fetch(url);
  const json = await res.json();

  return { cast: json.cast };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { TVID, seasonID, episodeID } = req.query;

  const episodeData = await retrieveEpisodeData({ TVID, seasonID, episodeID });
  const episodeCastData = await retrieveEpisodeCastData({ TVID, seasonID, episodeID });

  res.status(200).json({
    ...episodeData,
    ...episodeCastData,
  });
}
