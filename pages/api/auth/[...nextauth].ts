import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { Prisma, PrismaClient } from "@prisma/client";
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const prisma = new PrismaClient();

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

export default NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID || "",
      clientSecret: process.env.GOOGLE_SECRET || "",
    }),
  ],
  secret: process.env.SECRET,
  callbacks: {
    async session({ session, user }) {
      const profileFromDb = await prisma.profile.findUnique<Prisma.ProfileFindUniqueArgs>({
        where: {
          userId: user.id,
        },
      });

      // eslint-disable-next-line no-param-reassign
      if (profileFromDb) session.user.profile = profileFromDb;

      return session;
    },
  },
  events: { createUser: createUserProfile },
});
