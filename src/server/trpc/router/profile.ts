import { z } from "zod";
import getDateXDaysAgo from "../../../utils/getDateXAgo";
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

    return {
      ...user,
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

  stats: protectedProcedure.query(async ({ ctx }) => {
    const items: {
      date: string;
      count: number;
    }[] = [];
    let episodeCounter = 0;
    let movieCounter = 0;

    for (let i = 0; i < 30; i++) {
      const gte = new Date(getDateXDaysAgo(i + 1).setHours(0, 0, 0, 0));
      const lt = new Date(getDateXDaysAgo(i).setHours(0, 0, 0, 0));

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
          if (res > 0) episodeCounter++;
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

    const result = items.reduce((acc: any, { date, count, itemType }: any) => {
      acc[date] ??= { date: date, count: [] };
      acc[date].count = Number(acc[date].count) + Number(count);
      acc[date].itemType = itemType;

      return acc;
    }, {});

    const sorted = Object.values(result).sort((a: any, b: any) => {
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
        const nextEpisode: any = season?.episodes.filter((ep) => {
          if (ep.episode_number === lastEpisode.episode_number + 1 && ep.season_number === lastEpisode.season_number) {
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

          const nextEpisode: any = nextSeason?.episodes.filter((ep) => {
            if (ep.episode_number === 1 && ep.season_number === lastEpisode.season_number + 1) {
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
        result.filter((el: any) => {
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
