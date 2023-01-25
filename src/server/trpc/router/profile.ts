import { z } from "zod";
import paginate from "../../../utils/paginate";
import { router, protectedProcedure, publicProcedure } from "../trpc";

export const profileRouter = router({
  profileBySession: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.prisma.user.findFirst({
      where: {
        id: ctx.session.user.id,
      },
      include: {
        profile: true,
        following: {
          include: {
            profile: true,
          },
        },
        followers: {
          include: {
            profile: true,
          },
        },
      },
    });

    return {
      ...user,
    };
  }),

  usernameSearch: protectedProcedure.input(z.object({ query: z.string() })).query(async ({ ctx, input }) => {
    const result = await ctx.prisma.profile.findMany({
      where: {
        OR: [
          {
            username: {
              search: input.query,
            },
          },
          {
            username: {
              contains: input.query,
            },
          },
        ],
        NOT: [{ username: ctx.session.user.profile?.username }],
      },
      include: {
        user: {
          include: {
            followers: {
              where: {
                id: ctx.session.user.profile.userId,
              },
            },
          },
        },
      },
      take: 6,
    });

    return {
      results: result,
    };
  }),

  profileByUsername: publicProcedure.input(z.object({ user: z.string() })).query(async ({ ctx, input }) => {
    const userResult = await ctx.prisma.user.findFirstOrThrow({
      where: {
        profile: {
          username: input.user,
          private: false,
        },
      },
      select: {
        id: true,
        name: true,
        image: true,
        email: false,
        emailVerified: false,
        accounts: false,
        sessions: false,
        profile: true,
        EpisodesHistory: {
          take: 6,
          include: {
            series: true,
            season: true,
            episode: true,
          },
          orderBy: {
            datetime: "desc",
          },
        },
        MoviesHistory: {
          take: 6,
          include: {
            movie: true,
          },
          orderBy: {
            datetime: "desc",
          },
        },
        Watchlist: {
          take: 6,
          include: {
            WatchlistItem: {
              include: {
                series: true,
                movies: true,
              },
            },
          },
        },
        MoviesReviews: {
          take: 1,
          orderBy: {
            created: "desc",
          },
          include: {
            Movies: true,
          },
        },
        SeriesReviews: {
          take: 1,
          orderBy: {
            created: "desc",
          },
          include: {
            Series: true,
          },
        },
        followers: true,
        following: true,
      },
    });

    return {
      ...userResult,
    };
  }),

  updateProfile: protectedProcedure
    .input(
      z.object({
        adult: z.boolean(),
        private: z.boolean(),
        language: z.string(),
        region: z.string(),
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
              private: input.private,
              language: input.language,
              region: input.region,
            },
          },
        },
      });

      return user;
    }),

  deleteProfile: protectedProcedure.mutation(async ({ ctx }) => {
    const user = await ctx.prisma.user.delete({
      where: {
        id: ctx.session.user.profile.userId,
      },
    });

    return user;
  }),

  watchHistory: protectedProcedure
    .input(
      z.object({
        pageSize: z.number(),
        page: z.number(),
        orderBy: z.object({
          field: z.string(),
          order: z.string(),
        }),
        filter: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      let episodes = await ctx.prisma.episodesHistory.findMany({
        where: { user_id: ctx.session.user.profile.userId },
        include: {
          series: true,
          season: true,
          episode: true,
        },
      });

      let movies = await ctx.prisma.moviesHistory.findMany({
        where: { user_id: ctx.session.user.profile.userId },
        include: {
          movie: true,
        },
      });

      if (input.filter === "movies") {
        episodes = [];
      }
      if (input.filter === "episodes") {
        movies = [];
      }

      const sortedHistory = [...episodes, ...movies].sort((a: any, b: any) => {
        if (input.orderBy.field === "title") {
          const aField = a[a.series ? "series" : "movie"][a.series ? "name" : "title"];
          const bField = b[b.series ? "series" : "movie"][b.series ? "name" : "title"];

          return aField.localeCompare(bField);
        }

        if (input.orderBy.field === "date") {
          const aField = a[a.series ? "episode" : "movie"][a.series ? "air_date" : "release_date"];
          const bField = b[b.series ? "episode" : "movie"][b.series ? "air_date" : "release_date"];

          if (input.orderBy.order === "asc") {
            if (aField > bField) {
              return 1;
            } else {
              return -1;
            }
          } else if (input.orderBy.order === "desc") {
            if (aField < bField) {
              return 1;
            } else {
              return -1;
            }
          }
        }

        if (input.orderBy.order === "asc") {
          if (a[input.orderBy.field] > b[input.orderBy.field]) {
            return 1;
          } else {
            return -1;
          }
        } else if (input.orderBy.order === "desc") {
          if (a[input.orderBy.field] < b[input.orderBy.field]) {
            return 1;
          } else {
            return -1;
          }
        }
        return 0;
      });

      return {
        history: paginate(sortedHistory, input.pageSize, input.page),
        pagesAmount: Math.ceil(sortedHistory.length / input.pageSize),
      };
    }),
});
