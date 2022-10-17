import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "utils/prisma";
import { getSession } from "next-auth/react";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });
  const { movieID } = req.query;

  if (session) {
    const result = await prisma.moviesHistory.create({
      data: {
        datetime: new Date(),
        user_id: session.user.id,
        movie_id: Number(movieID),
      },
    });

    res.status(201).json(result);
  } else {
    res.status(401).end();
  }
}
