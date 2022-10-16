import { Prisma, PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });

  if (!session) return res.status(401).json({ unauthorized: true });

  if (req.method === "GET") {
    const user = await prisma.user.findUnique<Prisma.UserFindUniqueArgs>({
      where: { email: session.user?.email },
    });

    return res.status(200).json({
      user,
      session,
    });
  }

  if (req.method === "POST") {
    const user = await prisma.user.findUnique<Prisma.UserFindUniqueArgs>({
      where: { email: session.user?.email },
    });

    await prisma.profile.upsert({
      create: {
        profileId: user?.id,
      },
      update: {},
      where: {
        profileId: user?.id,
      },
    });

    res.status(200).json({
      user,
    });
  }

  return res.status(404);
}
