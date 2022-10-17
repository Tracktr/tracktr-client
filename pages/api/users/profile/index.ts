import { Prisma, PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });

  if (!session) return res.status(401).json({ unauthorized: true });

  if (req.method === "GET") {
    const user = await prisma.user.findFirst<Prisma.UserFindFirstArgs>({
      where: { email: session.user?.email },
      include: {
        profile: true,
      },
    });

    return res.status(200).json({
      user,
    });
  }

  if (req.method === "POST") {
    const user = await prisma.user.findFirst<Prisma.UserFindFirstArgs>({
      where: { email: session.user?.email },
    });

    const editProfile = await prisma.user.update({
      where: {
        id: user?.id,
      },
      data: {
        profile: {
          update: {
            // eslint-disable-next-line no-unneeded-ternary
            adult: req.body.adult.toLowerCase() === "true" ? true : false,
          },
        },
      },
    });

    return res.status(200).json(editProfile);
  }

  return res.status(301);
}
