import { Prisma } from "@prisma/client";
import { prisma } from "utils/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });

  if (!session) return res.status(401).json({ unauthorized: true });

  if (req.method === "GET") {
    const user = await prisma.user.findUnique<Prisma.UserFindUniqueArgs>({
      where: { email: String(session.user?.email) },
    });

    return res.status(200).json({
      user,
      session,
    });
  }

  if (req.method === "POST") {
    const user = await prisma.user.findUnique<Prisma.UserFindUniqueArgs>({
      where: { email: String(session.user?.email) },
    });

    await prisma.profile.upsert({
      create: {
        userId: String(user?.id),
      },
      update: {},
      where: {
        userId: String(user?.id),
      },
    });

    res.status(200).json({
      user,
    });
  }

  return res.status(404);
}
