import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "pages/api/auth/[...nextauth]";
import retrieveMovieData from "@/utils/retrieveMovieData";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session: any = await unstable_getServerSession(req, res, authOptions);
  const { movieID } = req.query;

  if (session == null) {
    res.status(401).end();
  } else {
    const movie = await retrieveMovieData(movieID, undefined);

    const newMovie = await prisma.movies.upsert({
      where: { id: Number(movieID) },
      update: {},
      create: { id: Number(movieID), title: movie.title, poster: movie.poster_path },
    });

    if (newMovie !== null) {
      const result = await prisma.moviesHistory.create({
        data: { datetime: new Date(), user_id: session.user.id, movie_id: Number(movieID) },
      });

      res.status(201).json(result);
    } else {
      res.status(500).end();
    }
  }
}
