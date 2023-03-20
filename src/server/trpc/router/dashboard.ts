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
        const episodes = await ctx.prisma.episodesHistory.findMany({
          where: { user_id: ctx.session.user.profile.userId },
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

        const result = await Promise.all(
          episodes.flatMap(async (lastEpisode) => {
            const season = await ctx.prisma.seasons.findFirst({
              where: {
                series_id: lastEpisode.series_id,
                season_number: lastEpisode.season.season_number,
              },
              include: {
                episodes: true,
                Series: true,
              },
            });

            // Removes all episodes that don't have a next episode
            const nextEpisode = season?.episodes.filter((ep) => {
              if (
                ep.episode_number === lastEpisode.episode.episode_number + 1 &&
                ep.season_number === lastEpisode.season.season_number &&
                ep?.air_date !== null &&
                ep?.air_date <= new Date()
              ) {
                return true;
              } else {
                return false;
              }
            });

            // Has a next episode in this season
            if (nextEpisode !== undefined && nextEpisode?.length > 0) {
              return {
                ...nextEpisode[0],
                series_id: season?.Series?.id,
                datetime: lastEpisode.datetime,
              };
            } else {
              const nextSeason = await ctx.prisma.seasons.findFirst({
                where: {
                  series_id: lastEpisode.series_id,
                  season_number: lastEpisode?.season?.season_number && lastEpisode.season.season_number + 1,
                },
                include: {
                  episodes: true,
                  Series: true,
                },
              });

              const nextEpisode = nextSeason?.episodes.filter((ep) => {
                if (
                  ep.episode_number === 1 &&
                  ep.season_number === (lastEpisode?.season?.season_number && lastEpisode.season.season_number + 1) &&
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
                  series_id: season?.Series?.id,
                  datetime: lastEpisode.datetime,
                };
              }
            }
          })
        );

        const filteredResult: any = result
          .filter((el) => {
            if (el !== undefined) {
              return true;
            }
          })
          .sort((a: any, b: any) => {
            if (input.orderBy.field === "title") {
              return a.series.name.localeCompare(b.series.name);
            }

            if (input.orderBy.field === "date") {
              if (input.orderBy.order === "asc") {
                if (a.series.first_air_date > b.series.first_air_date) {
                  return 1;
                } else {
                  return -1;
                }
              } else if (input.orderBy.order === "desc") {
                if (a.series.first_air_date < b.series.first_air_date) {
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

        const paginated = paginate(filteredResult, input.pageSize, input.page);

        const resultWithTMDB = await Promise.all(
          paginated.map(async (item) => {
            const url = new URL(`tv/${item.series_id}`, process.env.NEXT_PUBLIC_TMDB_API);
            url.searchParams.append("api_key", process.env.NEXT_PUBLIC_TMDB_KEY || "");
            if (ctx) url.searchParams.append("language", ctx.session?.user?.profile.language as string);

            const res = await fetch(url);
            const tmdb = await res.json();

            if (tmdb?.status_code) {
              throw new TRPCError({
                code: "NOT_FOUND",
                message: tmdb.status_message,
                cause: tmdb.status_code,
              });
            }

            const color = await convertImageToPrimaryColor({
              image: tmdb.poster_path,
              fallback: tmdb.backdrop_path,
            });

            tmdb.number_of_episodes = 0;
            tmdb.seasons.map(async (season: ISeason) => {
              if (new Date(season.air_date) <= new Date() && season.season_number > 0) {
                tmdb.number_of_episodes += season.episode_count;
              }
            });

            const watched = await ctx.prisma.episodesHistory.findMany({
              where: {
                user_id: ctx?.session?.user?.id,
                series_id: tmdb.id,
                NOT: {
                  season: {
                    season_number: 0,
                  },
                },
              },
              distinct: ["episode_id"],
              include: {
                series: true,
              },
              orderBy: {
                datetime: "desc",
              },
            });
            tmdb.episodes_watched = watched.length || 0;

            // TODO: Watched amount of episode equal to number of episodes
            // If we return undefined, there will be pageSize -1
            // Could do this before paginating, but that will take way too long
            // if (tmdb.episodes_watched === tmdb.number_of_episodes) return undefined;

            return { ...item, color: color, series: tmdb };
          })
        );

        return {
          result: resultWithTMDB,
          pagesAmount: Math.ceil(filteredResult.length / input.pageSize),
        };
      } catch (error) {
        console.error("something went wrong ", error);
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
