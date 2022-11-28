import { Prisma } from "@prisma/client";
import { z } from "zod";
import { TmdbEpisode } from "../../../types/tmdb";
import getDateXDaysAgo from "../../../utils/getDateXAgo";
import paginate from "../../../utils/paginate";
import { router, protectedProcedure } from "../trpc";

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

  createFriend: protectedProcedure
    .input(
      z.object({
        friend: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.update({
        where: { id: ctx.session.user.profile.userId },
        data: { friends: { connect: [{ id: input.friend }] } },
      });
      const friend = await ctx.prisma.user.update({
        where: { id: input.friend },
        data: { friends: { connect: [{ id: ctx.session.user.profile.userId }] } },
      });

      return {
        ...user,
        ...friend,
      };
    }),

  removeFriend: protectedProcedure
    .input(
      z.object({
        friend: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.update({
        where: { id: ctx.session.user.profile.userId },
        data: { friends: { disconnect: [{ id: input.friend }] } },
      });
      const friend = await ctx.prisma.user.update({
        where: { id: input.friend },
        data: { friends: { disconnect: [{ id: ctx.session.user.profile.userId }] } },
      });

      return {
        ...user,
        ...friend,
      };
    }),

  getFriends: protectedProcedure.query(async ({ ctx }) => {
    const result = await ctx.prisma.user.findFirst({
      where: { id: ctx.session.user.profile.userId },
      include: { friends: true },
    });

    return result;
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
            (ep?.air_date || new Date()) <= new Date()
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

  import: protectedProcedure
    .input(
      z.array(
        z.object({
          id: z.string(),
          type: z.string(),
          season: z.string().optional(),
          episode: z.string().optional(),
          datetime: z.string(),
        })
      )
    )
    .mutation(async ({ ctx, input }) => {
      const manyMoviesHistory: any[] = [];
      const manyEpisodesHistory: any[] = [];

      let i = 0;

      for (i = 0; i < input.length; i++) {
        const item = input[i];

        if (item !== undefined) {
          if (item.type === "movie") {
            const existsInDB = await ctx.prisma.movies.findFirst({
              where: { id: Number(item.id) },
            });

            if (!existsInDB) {
              const movie = new URL(`movie/${item.id}`, process.env.NEXT_PUBLIC_TMDB_API);
              movie.searchParams.append("api_key", process.env.NEXT_PUBLIC_TMDB_KEY || "");

              const json = await fetch(movie)
                .then((res: any) => res.json())
                .catch((e: any) => console.error("Failed fetching movie from TMDB", e));

              if (json.id && json.title && json.poster_path) {
                const newMovie = await ctx.prisma.movies.create({
                  data: {
                    id: json.id,
                    title: json.title,
                    poster: json.poster_path,
                  },
                });

                if (newMovie !== null) {
                  manyMoviesHistory.push({
                    datetime: item.datetime,
                    movie_id: Number(item.id),
                    user_id: ctx?.session?.user?.id as string,
                  });

                  continue;
                }
              }
            } else {
              manyMoviesHistory.push({
                datetime: item.datetime,
                movie_id: Number(item.id),
                user_id: ctx?.session?.user?.id as string,
              });

              continue;
            }
          } else if (item.type === "episode") {
            const existsInDB = await ctx.prisma.series.findFirst({
              where: { id: Number(item.id) },
            });

            if (!existsInDB) {
              const url = new URL(`tv/${item?.id}`, process.env.NEXT_PUBLIC_TMDB_API);
              url.searchParams.append("api_key", process.env.NEXT_PUBLIC_TMDB_KEY || "");
              if (ctx) url.searchParams.append("language", ctx.session?.user?.profile.language as string);

              const json = await fetch(url)
                .then((res: any) => res.json())
                .catch((e: any) => console.error("Failed fetching series from TMDB", e));

              if (json.id && json.name && json.poster_path) {
                try {
                  const newSeries = await ctx.prisma.series.create({
                    data: {
                      id: Number(item.id),
                      name: json.name,
                      poster: json.poster_path,
                      seasons: {
                        connectOrCreate: await Promise.all(
                          json.seasons.map(
                            async (season: {
                              air_date: string;
                              episode_count: number;
                              id: number;
                              name: string;
                              overview: string;
                              poster_path: string;
                              season_number: number;
                            }) => {
                              const url = new URL(
                                `tv/${json.id}/season/${season.season_number}`,
                                process.env.NEXT_PUBLIC_TMDB_API
                              );
                              url.searchParams.append("api_key", process.env.NEXT_PUBLIC_TMDB_KEY || "");

                              const seasonWithEpisodes = await fetch(url)
                                .then((res: any) => res.json())
                                .catch((e: any) => console.error("Failed fetching season from TMDB", e));

                              return {
                                where: { id: season.id },
                                create: {
                                  id: season.id,
                                  name: season.name,
                                  poster: season.poster_path ? season.poster_path : json.poster_path,
                                  season_number: season.season_number,
                                  episodes: {
                                    connectOrCreate: seasonWithEpisodes.episodes.map((e: TmdbEpisode) => {
                                      return {
                                        where: { id: e.id },
                                        create: {
                                          id: e.id,
                                          name: e.name,
                                          episode_number: e.episode_number,
                                          season_number: e.season_number,
                                          air_date: new Date(e.air_date),
                                        },
                                      };
                                    }),
                                  },
                                },
                              };
                            }
                          )
                        ),
                      },
                    },
                  });

                  if (newSeries !== null) {
                    manyEpisodesHistory.push({
                      datetime: item.datetime,
                      user_id: ctx?.session?.user?.id as string,
                      series_id: Number(item.id),
                      season_number: Number(item.season),
                      episode_number: Number(item.episode),
                    });

                    continue;
                  }
                } catch (e) {
                  if (e instanceof Prisma.PrismaClientKnownRequestError) {
                    if (e.code === "P2002") {
                      manyEpisodesHistory.push({
                        datetime: item.datetime,
                        user_id: ctx?.session?.user?.id as string,
                        series_id: Number(item.id),
                        season_number: Number(item.season),
                        episode_number: Number(item.episode),
                      });

                      continue;
                    }
                  }
                }
              }
            } else {
              manyEpisodesHistory.push({
                datetime: item.datetime,
                user_id: ctx?.session?.user?.id as string,
                series_id: Number(item.id),
                season_number: Number(item.season),
                episode_number: Number(item.episode),
              });

              continue;
            }
          }
        } else {
          continue;
        }
      }

      if (i === input.length) {
        const createManyMoviesHistory = await ctx.prisma.moviesHistory.createMany({
          data: manyMoviesHistory,
          skipDuplicates: true,
        });

        const createManyEpisodesHistory = await ctx.prisma.episodesHistory.createMany({
          data: manyEpisodesHistory,
          skipDuplicates: true,
        });

        return {
          ...createManyEpisodesHistory,
          ...createManyMoviesHistory,
        };
      }
    }),
});
