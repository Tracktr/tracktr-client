import { NextApiRequest, NextApiResponse } from "next";

const retrieveSearchData = async ({ type, query, page }: any) => {
  const url = new URL(`search/${type}`, process.env.NEXT_PUBLIC_TMDB_API);
  url.searchParams.append("api_key", process.env.NEXT_PUBLIC_TMDB_KEY || "");
  url.searchParams.append("query", query);
  url.searchParams.append("page", page);

  const res = await fetch(url);
  const json = await res.json();

  return json;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { type, query, page } = req.query;

  const data = await retrieveSearchData({ type, query, page });

  return res.status(200).json({
    ...data,
  });
}
