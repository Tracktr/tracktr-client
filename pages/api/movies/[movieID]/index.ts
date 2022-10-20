import retrieveMovieData from "@/utils/retrieveMovieData";
import { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "pages/api/auth/[...nextauth]";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await unstable_getServerSession(req, res, authOptions);
  const { movieID } = req.query;

  const movieData = await retrieveMovieData(movieID, session);

  res.status(200).json({
    ...movieData,
  });
}
