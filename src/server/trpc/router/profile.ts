import { z } from "zod";
import { router, protectedProcedure } from "../trpc";

export const profileRouter = router({
  profileBySession: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.prisma.user.findFirst({
      where: {
        id: ctx.session.user.id,
      },
      include: {
        profile: true,
      },
    });

    const languages = await ctx.prisma.languages.findMany();

    return {
      ...user,
      languages: {
        ...languages,
      },
    };
  }),

  updateProfile: protectedProcedure
    .input(
      z.object({
        adult: z.boolean(),
        language: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.update({
        where: {
          id: ctx.session.user.profile.userId,
        },
        data: {
          profile: {
            update: {
              adult: input.adult,
              language: input.language,
            },
          },
        },
      });

      return user;
    }),
});
