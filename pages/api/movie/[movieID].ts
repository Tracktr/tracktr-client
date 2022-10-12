import { NextApiRequest, NextApiResponse } from "next";

async function retrieveMovieData(movieID: string | string[] | undefined) {
  const url = new URL(`movie/${movieID}`, process.env.NEXT_PUBLIC_TMDB_API);
  url.searchParams.append("api_key", process.env.NEXT_PUBLIC_TMDB_KEY || "");

  const res = await fetch(url);
  const json = await res.json();

  return json;
}

async function retrieveMovieCastData(movieID: string | string[] | undefined) {
  const url = new URL(`movie/${movieID}/credits`, process.env.NEXT_PUBLIC_TMDB_API);
  url.searchParams.append("api_key", process.env.NEXT_PUBLIC_TMDB_KEY || "");

  const res = await fetch(url);
  const json = await res.json();

  return { cast: json.cast };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { movieID } = req.query;

  const movieData = await retrieveMovieData(movieID);
  const castData = await retrieveMovieCastData(movieID);

  res.status(200).json({
    ...movieData,
    ...castData,
  });
}
