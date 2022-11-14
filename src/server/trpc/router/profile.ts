import { z } from "zod";
import resizeArray from "../../../utils/resizeArray";
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
        location: z.string(),
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
              location: input.location,
            },
          },
        },
      });

      return user;
    }),

  watchHistory: protectedProcedure.query(async ({ ctx }) => {
    const episodes = await ctx.prisma.episodesHistory.findMany({
      where: { user_id: ctx.session.user.profile.userId },
      include: {
        series: true,
      },
    });

    const movies = await ctx.prisma.moviesHistory.findMany({
      where: { user_id: ctx.session.user.profile.userId },
      include: {
        movie: true,
      },
    });

    const sortedHistory = [...episodes, ...movies].sort((a, b) => {
      if (a.datetime < b.datetime) {
        return 1;
      } else {
        return -1;
      }
    });

    return { history: resizeArray(sortedHistory, 10) };
  }),
});
