import { z } from "zod";
import getDateXDaysAgo from "../../../utils/getDateXAgo";
import paginate from "../../../utils/paginate";
import { router, protectedProcedure, publicProcedure } from "../trpc";

interface IStatItem {
  date: string;
  count: number;
}

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
              language: input.language,
              region: input.region,
            },
          },
        },
      });

      return user;
    }),

  stats: protectedProcedure.query(async ({ ctx }) => {
    const items: {
      date: string;
      count: number;
    }[] = [];
    let episodeCounter = 0;
    let movieCounter = 0;

    for (let i = 0; i < 14; i++) {
      const gte = new Date(getDateXDaysAgo(i).setHours(0, 0, 0, 0));
      const lt = new Date(getDateXDaysAgo(i - 1).setHours(0, 0, 0, 0));

      await ctx.prisma.episodesHistory
        .count({
          where: {
            user_id: ctx.session.user.profile.userId,
            datetime: {
              gte,
              lt,
            },
          },
        })
        .then((res) => {
          if (res > 0) episodeCounter += res;
          items.push({
            date: gte.toLocaleString("en-UK", {
              month: "short",
              day: "numeric",
            }),
            count: res,
          });
        });

      await ctx.prisma.moviesHistory
        .count({
          where: {
            user_id: ctx.session.user.profile.userId,
            datetime: {
              gte,
              lt,
            },
          },
        })
        .then((res) => {
          if (res > 0) movieCounter++;
          items.push({
            date: gte.toLocaleString("en-UK", {
              month: "short",
              day: "numeric",
            }),
            count: res,
          });
        });
    }

    const result: IStatItem[] = items.reduce((acc: any, { date, count }: any) => {
      acc[date] ??= { date: date, count: [] };
      acc[date].count = Number(acc[date].count) + Number(count);

      return acc;
    }, {});

    const sorted = Object.values(result).sort((a: IStatItem, b: IStatItem) => {
      if (new Date(a.date) > new Date(b.date)) {
        return 1;
      } else {
        return -1;
      }
    });

    return {
      history: sorted,
      episodeAmount: episodeCounter,
      movieAmount: movieCounter,
    };
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

  upNext: protectedProcedure.query(async ({ ctx }) => {
    const episodes = await ctx.prisma.episodesHistory.findMany({
      where: { user_id: ctx.session.user.profile.userId },
      include: {
        series: true,
      },
      orderBy: {
        datetime: "desc",
      },
      distinct: ["series_id"],
    });

    const result = await Promise.all(
      episodes.flatMap(async (lastEpisode) => {
        const season = await ctx.prisma.seasons.findFirst({
          where: {
            series_id: lastEpisode.series_id,
            season_number: lastEpisode.season_number,
          },
          include: {
            episodes: true,
            Series: true,
          },
        });

        // Removes all episodes that don't have a next episode
        const nextEpisode = season?.episodes.filter((ep) => {
          if (
            ep.episode_number === lastEpisode.episode_number + 1 &&
            ep.season_number === lastEpisode.season_number &&
            ep?.air_date !== null &&
            ep?.air_date <= new Date()
          ) {
            return true;
          } else {
            return false;
          }
        });

        if (nextEpisode !== undefined && nextEpisode?.length > 0) {
          return {
            ...nextEpisode[0],
            series: season?.Series,
          };
        } else {
          const nextSeason = await ctx.prisma.seasons.findFirst({
            where: {
              series_id: lastEpisode.series_id,
              season_number: lastEpisode.season_number + 1,
            },
            include: {
              episodes: true,
              Series: true,
            },
          });

          const nextEpisode = nextSeason?.episodes.filter((ep) => {
            if (
              ep.episode_number === 1 &&
              ep.season_number === lastEpisode.season_number + 1 &&
              ep?.air_date !== null &&
              ep?.air_date <= new Date()
            ) {
              return true;
            } else {
              return false;
            }
          });

          if (nextEpisode !== undefined && nextEpisode?.length > 0) {
            return {
              ...nextEpisode[0],
              series: season?.Series,
            };
          }
        }
      })
    );

    return {
      result: paginate(
        result.filter((el) => {
          if (el !== undefined) {
            return true;
          }
        }),
        6,
        1
      ),
    };
  }),
});
