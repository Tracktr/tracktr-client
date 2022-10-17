import { Prisma, PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });

  if (!session) return res.status(401).json({ unauthorized: true });

  const user = await prisma.user.findFirst<Prisma.UserFindFirstArgs>({
    where: { email: session.user?.email },
  });

  return res.status(200).json({
    user,
    session,
  });
}
