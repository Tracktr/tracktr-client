import { TRPCError } from "@trpc/server";
import { zonedTimeToUtc } from "date-fns-tz";
import { z } from "zod";
import convertImageToPrimaryColor from "../../../utils/colors";
import { getDateXDaysAgo } from "../../../utils/getDate";
import paginate from "../../../utils/paginate";
import { router, protectedProcedure } from "../trpc";
import { ISeason } from "./tv";

export interface IStatItem {
  date: string;
  count: number;
}

export const dashboardRouter = router({
  stats: protectedProcedure
    .input(
      z.object({
        timeZone: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const items: {
        date: string | Date;
        count: number;
      }[] = [];
      let episodeCounter = 0;
      let movieCounter = 0;

      for (let i = 0; i < 14; i++) {
        const gte = zonedTimeToUtc(new Date(getDateXDaysAgo(i).setHours(0, 0, 0, 0)), input.timeZone);
        const lt = zonedTimeToUtc(new Date(getDateXDaysAgo(i - 1).setHours(0, 0, 0, 0)), input.timeZone);

        await ctx.prisma.episodesHistory
          .findMany({
            where: {
              user_id: ctx.session.user.profile.userId,
              datetime: {
                gte,
                lt,
              },
            },
          })
          .then((res) => {
            if (res.length > 0) episodeCounter += res.length;

            items.push({
              date: gte,
              count: res.length,
            });
          });

        await ctx.prisma.moviesHistory
          .findMany({
            where: {
              user_id: ctx.session.user.profile.userId,
              datetime: {
                gte,
                lt,
              },
            },
          })
          .then((res) => {
            if (res.length > 0) movieCounter += res.length;

            items.push({
              date: gte,
              count: res.length,
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

  upNext: protectedProcedure
    .input(
      z.object({
        pageSize: z.number(),
        page: z.number(),
        orderBy: z.object({
          field: z.string(),
          order: z.string(),
        }),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        const userHistory = await ctx.prisma.episodesHistory.findMany({
          where: {
            user_id: ctx.session.user.id,
            NOT: {
              season: {
                season_number: 0,
              },
            },
          },
          include: {
            series: true,
            season: true,
            episode: true,
          },
          orderBy: [
            {
              datetime: "desc",
            },
            {
              episode: {
                episode_number: "desc",
              },
            },
          ],
          distinct: ["series_id"],
        });

        const nextEpisodes = await Promise.all(
          userHistory.map(async (historyItem) => {
            const nextEpisode = await ctx.prisma.episodes.findFirst({
              where: {
                seasons_id: historyItem.episode.seasons_id,
                episode_number: historyItem.episode.episode_number + 1,
              },
              include: {
                Seasons: {
                  include: {
                    Series: true,
                  },
                },
              },
            });

            if (nextEpisode !== null) {
              if (nextEpisode.air_date !== null && nextEpisode.air_date <= new Date()) {
                const totalEpisodes = await ctx.prisma.seasons.findMany({
                  where: {
                    series_id: historyItem.series_id,
                    NOT: {
                      season_number: 0,
                    },
                  },
                  select: {
                    _count: {
                      select: {
                        episodes: true,
                        EpisodesHistory: {
                          where: { user_id: ctx.session.user.id },
                        },
                      },
                    },
                  },
                });

                let number_of_episodes = 0;
                let episodes_watched = 0;

                totalEpisodes.forEach((item) => {
                  number_of_episodes += item._count.episodes;
                  episodes_watched += item._count.EpisodesHistory;
                });

                if (number_of_episodes === episodes_watched) {
                  return null;
                }

                const color = await convertImageToPrimaryColor({
                  image: historyItem.series.poster,
                });

                return {
                  ...nextEpisode,
                  datetime: historyItem.datetime,
                  number_of_episodes,
                  episodes_watched,
                  color,
                };
              } else {
                return null;
              }
            } else {
              const nextSeason = await ctx.prisma.seasons.findFirst({
                where: {
                  series_id: historyItem.series_id,
                  season_number: (historyItem.season.season_number || 0) + 1,
                },
                include: {
                  episodes: {
                    where: {
                      episode_number: 1,
                    },
                    include: {
                      Seasons: {
                        include: {
                          Series: true,
                        },
                      },
                    },
                  },
                },
              });

              if (nextSeason !== null) {
                if (
                  nextSeason.episodes[0] &&
                  nextSeason.episodes[0].air_date !== null &&
                  nextSeason.episodes[0].air_date <= new Date()
                ) {
                  const totalEpisodes = await ctx.prisma.seasons.findMany({
                    where: {
                      series_id: historyItem.series_id,
                      NOT: {
                        season_number: 0,
                      },
                    },
                    select: {
                      _count: {
                        select: {
                          episodes: true,
                          EpisodesHistory: {
                            where: { user_id: ctx.session.user.id },
                          },
                        },
                      },
                    },
                  });

                  let number_of_episodes = 0;
                  let episodes_watched = 0;

                  totalEpisodes.forEach((item) => {
                    number_of_episodes += item._count.episodes;
                    episodes_watched += item._count.EpisodesHistory;
                  });

                  if (number_of_episodes === episodes_watched) {
                    return null;
                  }

                  const color = await convertImageToPrimaryColor({
                    image: historyItem.series.poster,
                  });

                  return {
                    ...nextSeason.episodes[0],
                    datetime: historyItem.datetime,
                    number_of_episodes,
                    episodes_watched,
                    color,
                  };
                } else {
                  return null;
                }
              } else {
                return null;
              }
            }
          })
        );

        const filteredNextEpisodes = nextEpisodes
          .filter((item) => item !== null)
          .sort((a: any, b: any) => {
            if (input.orderBy.field === "title") {
              return a.Seasons.Series.name.localeCompare(b.Seasons.Series.name);
            }

            if (input.orderBy.field === "date") {
              if (input.orderBy.order === "asc") {
                if (a.air_date > b.air_date) {
                  return 1;
                } else {
                  return -1;
                }
              } else if (input.orderBy.order === "desc") {
                if (a.air_date < b.air_date) {
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
          result: paginate(filteredNextEpisodes, input.pageSize, input.page),
          pagesAmount: Math.ceil(filteredNextEpisodes.length / input.pageSize),
        };
      } catch (error) {
        console.error("something went wrong in the up next route ", error);
      }
    }),

  friendsActivity: protectedProcedure
    .input(
      z.object({
        timeZone: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const twoWeeksAgo = zonedTimeToUtc(new Date(getDateXDaysAgo(14).setHours(0, 0, 0, 0)), input.timeZone);

      const activity = await ctx.prisma.user.findFirst({
        where: {
          id: ctx.session.user.id,
        },
        include: {
          following: {
            include: {
              profile: true,
              EpisodesHistory: {
                where: {
                  datetime: {
                    gte: twoWeeksAgo,
                  },
                },
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
                where: {
                  datetime: {
                    gte: twoWeeksAgo,
                  },
                },
                take: 6,
                include: {
                  movie: true,
                },
                orderBy: {
                  datetime: "desc",
                },
              },
              MoviesReviews: {
                where: {
                  created: {
                    gte: twoWeeksAgo,
                  },
                },
                take: 1,
                include: {
                  Movies: true,
                },
                orderBy: {
                  created: "desc",
                },
              },
              SeriesReviews: {
                where: {
                  created: {
                    gte: twoWeeksAgo,
                  },
                },
                take: 1,
                orderBy: {
                  created: "desc",
                },
                include: {
                  Series: true,
                },
              },
            },
          },
        },
      });

      let recentHistory: any[] = [];
      let recentMovieReviews: any[] = [];
      let recentSeriesReviews: any[] = [];

      activity?.following.map((friend) => {
        recentHistory = [
          ...recentHistory,
          ...[...friend.MoviesHistory, ...friend.EpisodesHistory].map((h) => ({
            ...h,
            friend: {
              image: friend.image,
              name: friend.profile?.username,
            },
          })),
        ];

        recentMovieReviews = [
          ...recentMovieReviews,
          ...friend.MoviesReviews.map((r) => ({
            ...r,
            friend: {
              image: friend.image,
              name: friend.profile?.username,
            },
          })),
        ];

        recentSeriesReviews = [
          ...recentSeriesReviews,
          ...friend.SeriesReviews.map((r) => ({
            ...r,
            friend: {
              image: friend.image,
              name: friend.profile?.username,
            },
          })),
        ];
      });

      return {
        history: recentHistory
          .sort((a, b) => {
            if (a.datetime < b.datetime) {
              return 1;
            } else {
              return -1;
            }
          })
          ?.slice(0, 6),
        movieReviews: recentMovieReviews
          .sort((a, b) => {
            if (a.datetime < b.datetime) {
              return 1;
            } else {
              return -1;
            }
          })
          ?.slice(0, 1),
        seriesReviews: recentSeriesReviews
          .sort((a, b) => {
            if (a.datetime < b.datetime) {
              return 1;
            } else {
              return -1;
            }
          })
          ?.slice(0, 1),
      };
    }),
});
