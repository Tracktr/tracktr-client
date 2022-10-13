import { NextApiRequest, NextApiResponse } from "next";

async function retrieveTVData(personID: string | string[] | undefined) {
  const url = new URL(`tv/${personID}`, process.env.NEXT_PUBLIC_TMDB_API);
  url.searchParams.append("api_key", process.env.NEXT_PUBLIC_TMDB_KEY || "");
  url.searchParams.append("append_to_response", "credits");

  const res = await fetch(url);
  const json = await res.json();

  return json;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { TVID } = req.query;

  const data = await retrieveTVData(TVID);

  res.status(200).json({
    ...data,
  });
}
