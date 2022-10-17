import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "utils/prisma";
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const createUserProfile = async ({ user }: any) => {
  const { id } = user;

  try {
    await prisma.profile.create({
      data: {
        userId: id,
      },
    });
  } catch (error) {
    // eslint-disable-next-line no-console
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
  events: { createUser: createUserProfile },
});
