import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { Prisma } from "@prisma/client";
import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "../../../server/db/client";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const createUserProfile = async ({ user }: any) => {
  const { id } = user;

  try {
    await prisma.profile.create({
      data: {
        userId: id,
      },
    });
  } catch (error) {
    console.log(`❌ Unable to create Profile in Database`);
  }
};

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID || "",
      clientSecret: process.env.GOOGLE_SECRET || "",
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async session({ session, user }) {
      const profileFromDb = await prisma.profile.findFirst<Prisma.ProfileFindFirstArgs>({
        where: {
          userId: user.id,
        },
      });

      // eslint-disable-next-line no-param-reassign
      if (profileFromDb && session.user) session.user.profile = profileFromDb;
      if (session.user) session.user.id = user.id;

      return session;
    },
  },
  events: { createUser: createUserProfile },
};

export default NextAuth(authOptions);
