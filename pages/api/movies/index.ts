import { NextApiRequest, NextApiResponse } from "next";
import { Session } from "next-auth";
import { getSession } from "next-auth/react";

interface Props {
  type: string | string[] | undefined;
  limiter: string | string[] | undefined;
  sortby?: string | string[] | undefined;
  page?: string | string[] | undefined;
  filter?: string | string[] | undefined;
  session: Session | null;
}

async function retrieveMoviesData({ type, limiter, sortby, page, filter, session }: Props) {
  const url = new URL(`${type}/${limiter}${filter ? `/${filter}` : ""}`, process.env.NEXT_PUBLIC_TMDB_API);
  url.searchParams.append("api_key", process.env.NEXT_PUBLIC_TMDB_KEY || "");
  if (sortby) url.searchParams.append("sort_by", sortby.toString());
  if (page) url.searchParams.append("page", page.toString());
  if (session) url.searchParams.append("language", session.user.profile.language);

  const res = await fetch(url);
  const json = await res.json();

  return json;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });
  const { type, limiter, sortby, page, filter } = req.query;

  const moviesData = await retrieveMoviesData({ type, limiter, sortby, page, filter, session });

  res.status(200).json({
    ...moviesData,
  });
}
