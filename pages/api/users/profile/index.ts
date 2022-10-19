import { Prisma, PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "pages/api/auth/[...nextauth]";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await unstable_getServerSession(req, res, authOptions);

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
    const body = JSON.parse(req.body);
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
            adult: body.adult,
            language: body.language,
          },
        },
      },
    });

    return res.status(200).json(editProfile);
  }

  return res.status(301);
}
