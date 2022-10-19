import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";

async function retrieveMovieData(movieID: string | string[] | undefined, session: any) {
  const url = new URL(`movie/${movieID}`, process.env.NEXT_PUBLIC_TMDB_API);
  url.searchParams.append("api_key", process.env.NEXT_PUBLIC_TMDB_KEY || "");
  url.searchParams.append("append_to_response", "credits");
  if (session) url.searchParams.append("language", session.user.profile.language);

  const res = await fetch(url);
  const json = await res.json();

  return json;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });
  const { movieID } = req.query;

  const movieData = await retrieveMovieData(movieID, session);

  res.status(200).json({
    ...movieData,
  });
}
