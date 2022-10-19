import { NextApiRequest, NextApiResponse } from "next";
import { Session, unstable_getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

interface Props {
  personID: string | string[] | undefined;
  session: Session | null;
}

async function retrievePersonData({ personID, session }: Props) {
  const url = new URL(`person/${personID}`, process.env.NEXT_PUBLIC_TMDB_API);
  url.searchParams.append("api_key", process.env.NEXT_PUBLIC_TMDB_KEY || "");
  if (session) url.searchParams.append("language", session.user.profile.language);
  const res = await fetch(url);
  const json = await res.json();

  return json;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await unstable_getServerSession(req, res, authOptions);
  const { personID } = req.query;

  const personData = await retrievePersonData({ personID, session });

  res.status(200).json({
    ...personData,
  });
}
