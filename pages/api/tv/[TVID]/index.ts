import { NextApiRequest, NextApiResponse } from "next";

async function retrieveTVData(personID: string | string[] | undefined) {
  const url = new URL(`tv/${personID}`, process.env.NEXT_PUBLIC_TMDB_API);
  url.searchParams.append("api_key", process.env.NEXT_PUBLIC_TMDB_KEY || "");

  const res = await fetch(url);
  const json = await res.json();

  return json;
}

async function retrieveTVCastData(TVID: string | string[] | undefined) {
  const url = new URL(`tv/${TVID}/credits`, process.env.NEXT_PUBLIC_TMDB_API);
  url.searchParams.append("api_key", process.env.NEXT_PUBLIC_TMDB_KEY || "");

  const res = await fetch(url);
  const json = await res.json();

  return { cast: json.cast };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { TVID } = req.query;

  const TVData = await retrieveTVData(TVID);
  const TVCastData = await retrieveTVCastData(TVID);

  res.status(200).json({
    ...TVData,
    ...TVCastData,
  });
}
