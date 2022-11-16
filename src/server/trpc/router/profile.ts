import { z } from "zod";
import paginate from "../../../utils/paginate";
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

  watchHistory: protectedProcedure
    .input(
      z.object({
        pageSize: z.number(),
        page: z.number(),
      })
    )
    .query(async ({ ctx, input }) => {
      const episodes = await ctx.prisma.episodesHistory.findMany({
        where: { user_id: ctx.session.user.profile.userId },
        include: {
          series: true,
        },
        orderBy: {
          datetime: "desc",
        },
      });

      const movies = await ctx.prisma.moviesHistory.findMany({
        where: { user_id: ctx.session.user.profile.userId },
        include: {
          movie: true,
        },
        orderBy: {
          datetime: "desc",
        },
      });

      const sortedHistory = [...episodes, ...movies].sort((a, b) => {
        if (a.datetime < b.datetime) {
          return 1;
        } else {
          return -1;
        }
      });

      return {
        history: paginate(sortedHistory, input.pageSize, input.page),
        pagesAmount: Math.ceil(sortedHistory.length / input.pageSize),
      };
    }),
});
