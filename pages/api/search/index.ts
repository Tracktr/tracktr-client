import { NextApiRequest, NextApiResponse } from "next";
import { Session, unstable_getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

interface Props {
  type: any;
  query: any;
  page: any;
  session: Session | null;
}

const retrieveSearchData = async ({ type, query, page, session }: Props) => {
  const url = new URL(`search/${type}`, process.env.NEXT_PUBLIC_TMDB_API);
  url.searchParams.append("api_key", process.env.NEXT_PUBLIC_TMDB_KEY || "");
  url.searchParams.append("query", query);
  url.searchParams.append("page", page);
  if (session) url.searchParams.append("language", session.user.profile.language);
  if (session) url.searchParams.append("include_adult", session.user.profile.adult.toString());

  const res = await fetch(url);
  const json = await res.json();

  return json;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await unstable_getServerSession(req, res, authOptions);
  const { type, query, page } = req.query;

  const data = await retrieveSearchData({ type, query, page, session });

  return res.status(200).json({
    ...data,
  });
}
