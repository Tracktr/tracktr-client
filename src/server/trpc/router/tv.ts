import { router, publicProcedure, protectedProcedure } from "../trpc";
import { z } from "zod";
import convertImageToPrimaryColor from "../../../utils/colors";
import createNewSeries from "../../../utils/createNewSeries";
import { TRPCError } from "@trpc/server";
import { Episodes, EpisodesHistory, Profile, Seasons, Series, User } from "@prisma/client";

export interface ISeries {
  backdrop_path: string;
  first_air_date: string;
  genre_ids: number[];
  id: number;
  name: string;
  origin_country: string[];
  original_language: string;
  original_name: string;
  overview: string;
  popularity: number;
  poster_path: string;
  vote_average: number;
  vote_count: number;
}

export interface ISeason {
  air_date: string;
  episode_count: number;
  id: number;
  name: string;
  overview: string;
  poster_path: string;
  season_number: number;
}

export const tvRouter = router({
  seriesById: publicProcedure
    .input(
      z.object({
        seriesID: z.number(),
      })
    )
    .query(async ({ ctx, input }) => {
      const url = new URL(`tv/${input?.seriesID}`, process.env.NEXT_PUBLIC_TMDB_API);
      url.searchParams.append("api_key", process.env.NEXT_PUBLIC_TMDB_KEY || "");
      url.searchParams.append("append_to_response", "credits,watch/providers,videos,recommendations");
      if (ctx) url.searchParams.append("language", ctx.session?.user?.profile.language as string);

      const res = await fetch(url);
      const json = await res.json();

      if (json?.status_code) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: json.status_message,
          cause: json.status_code,
        });
      }

      const color = await convertImageToPrimaryColor({ image: json.poster_path, fallback: json.backdrop_path });

      if (ctx.session?.user) {
        json.number_of_episodes = 0;

        // Check if user has watched an episode of a season
        json.seasons = await Promise.all(
          json.seasons.map(async (season: ISeason) => {
            if (new Date(season.air_date) <= new Date() && season.season_number > 0) {
              json.number_of_episodes += season.episode_count;
            }

            const watched = await ctx.prisma.episodesHistory.findFirst({
              where: {
                user_id: ctx.session?.user?.id,
                series_id: input.seriesID,
                season_id: season.id,
              },
              distinct: ["episode_id"],
            });

            if (watched) {
              return { ...season, watched: true };
            } else {
              return { ...season, watched: false };
            }
          })
        );

        // Check how many episodes a user has watched
        const episodesWatched = await ctx.prisma.episodesHistory.findMany({
          where: {
            series_id: input.seriesID,
            user_id: ctx.session?.user?.id,
            NOT: {
              season: {
                season_number: 0,
              },
            },
          },
          distinct: ["episode_id"],
        });

        if (episodesWatched) {
          return {
            ...json,
            number_of_episodes_watched: [{ count: episodesWatched.length }],
            theme_color: color,
          };
        }
      } else {
        json.seasons = json.seasons.map((season: ISeries) => {
          return { ...season, watched: false };
        });

        return {
          ...json,
          number_of_episodes_watched: 0,
          theme_color: color,
        };
      }
    }),

  infiniteTV: publicProcedure
    .input(
      z.object({
        cursor: z.number().nullish(),
        filter: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const url = new URL(`tv/${input.filter}`, process.env.NEXT_PUBLIC_TMDB_API);
      url.searchParams.append("api_key", process.env.NEXT_PUBLIC_TMDB_KEY || "");
      url.searchParams.append("page", input?.cursor?.toString() || "1");
      if (ctx) url.searchParams.append("language", ctx.session?.user?.profile.language as string);
      if (ctx) url.searchParams.append("region", ctx.session?.user?.profile.region as string);

      const res = await fetch(url);
      const json = await res.json();

      if (json?.status_code) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: json.status_message,
          cause: json.status_code,
        });
      }

      if (ctx.session?.user) {
        json.results = await Promise.all(
          json.results.map(async (series: ISeries) => {
            const watched = await ctx.prisma.episodesHistory.findFirst({
              where: {
                user_id: ctx?.session?.user?.id,
                series_id: series.id,
                NOT: {
                  season: {
                    season_number: 0,
                  },
                },
              },
              distinct: ["episode_id"],
            });

            const watchlist = await ctx.prisma.watchlist.findFirst({
              where: {
                user_id: ctx.session?.user?.profile.userId,
              },
              include: {
                WatchlistItem: {
                  where: {
                    series_id: series.id,
                  },
                },
              },
            });

            return {
              ...series,
              watched: Boolean(watched),
              watched_id: watched?.id || null,
              watchlist: Boolean(watchlist?.WatchlistItem && watchlist.WatchlistItem.length > 0),
              watchlist_id: watchlist?.WatchlistItem[0]?.id || null,
            };
          })
        );
      } else {
        json.results = json.results.map((series: ISeries) => {
          return { ...series, watched: false };
        });
      }

      return {
        ...json,
      };
    }),

  markSeriesAsWatched: protectedProcedure
    .input(
      z.object({
        seriesID: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const url = new URL(`tv/${input?.seriesID}`, process.env.NEXT_PUBLIC_TMDB_API);
      url.searchParams.append("api_key", process.env.NEXT_PUBLIC_TMDB_KEY || "");

      const show = await fetch(url).then((res) => res.json());

      if (show?.status_code) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: show.status_message,
          cause: show.status_code,
        });
      }

      const seasonsCount = show.number_of_seasons;
      const firstSeason: number = show.seasons[0].season_number;

      const seriesPoster = show.poster_path ? show.poster_path : "/noimage.png";

      const existsInDB = await ctx.prisma.series.findFirst({
        where: { id: show.id },
      });

      const createHistory = async () => {
        try {
          return await ctx.prisma.episodesHistory.createMany({
            data: await saveHistory({
              firstSeason,
              seasonsCount,
              seriesID: input.seriesID,
              userID: ctx.session.user.id,
            }),
          });
        } catch (error) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Could not add to history",
            cause: error,
          });
        }
      };

      if (!existsInDB) {
        const newSeries = await createNewSeries({ show, seriesPoster, id: input.seriesID, ctx });

        if (newSeries !== null) {
          await createHistory();
        }
      } else {
        await createHistory();
      }
    }),

  removeSeriesFromWatched: protectedProcedure
    .input(
      z.object({
        seriesID: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const result = await ctx.prisma.episodesHistory.deleteMany({
        where: {
          user_id: ctx.session.user.id,
          series_id: input.seriesID,
        },
      });

      return {
        ...result,
      };
    }),

  watchHistoryByID: protectedProcedure
    .input(
      z.object({
        seriesID: z.number(),
      })
    )
    .query(async ({ ctx, input }) => {
      const url = new URL(`tv/${input?.seriesID}`, process.env.NEXT_PUBLIC_TMDB_API);
      url.searchParams.append("api_key", process.env.NEXT_PUBLIC_TMDB_KEY || "");

      const show = await fetch(url).then((res) => res.json());

      if (show?.status_code) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: show.status_message,
          cause: show.status_code,
        });
      }

      const result = await ctx.prisma.episodesHistory.findMany({
        where: {
          user_id: ctx.session.user.id,
          series_id: input.seriesID,
          NOT: {
            season: {
              season_number: 0,
            },
          },
        },
        distinct: ["episode_id"],
        orderBy: {
          datetime: "desc",
        },
      });

      show.number_of_episodes = 0;
      show.seasons.map((season: ISeason) => {
        if (new Date(season.air_date) <= new Date() && season.season_number > 0) {
          show.number_of_episodes += season.episode_count;
        }
      });

      return {
        results: result,
        episodeAmount: show.number_of_episodes,
      };
    }),

  seenBy: protectedProcedure
    .input(
      z.object({
        id: z.number(),
      })
    )
    .query(async ({ ctx, input }) => {
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
                  series_id: input.id,
                },
                include: {
                  series: true,
                  season: true,
                  episode: true,
                },
              },
            },
          },
        },
      });

      const response:
        | (User & {
            profile: Profile | null;
            EpisodesHistory: (EpisodesHistory & { series: Series; season: Seasons; episode: Episodes })[];
          })[]
        | undefined = [];
      activity?.following.map((user) => user.EpisodesHistory.length > 0 && response.push(user));

      return response;
    }),
});

const saveHistory = async ({
  firstSeason,
  seasonsCount,
  seriesID,
  userID,
}: {
  firstSeason: number;
  seasonsCount: number;
  seriesID: number;
  userID: string;
}) => {
  const results: any[] = [];

  for (let j = firstSeason; j <= seasonsCount; j++) {
    const seasonUrl = new URL(`tv/${seriesID}/season/${j}`, process.env.NEXT_PUBLIC_TMDB_API);
    seasonUrl.searchParams.append("api_key", process.env.NEXT_PUBLIC_TMDB_KEY || "");

    const season = await fetch(seasonUrl).then((res) => res.json());

    if (season?.status_code) {
      console.error("Failed to fetch season", seriesID, j);
    }

    if (season.season_number === 0 || new Date(season.air_date) >= new Date()) continue;

    for (let i = 0; i < season.episodes.length; i++) {
      try {
        const item = {
          datetime: new Date(),
          user_id: userID,
          series_id: seriesID,
          season_id: season.id,
          episode_id: season.episodes[i].id,
        };

        results.push(item);
      } catch (error) {
        console.error("Could not save series to database ", error);
      }
    }
  }

  return results;
};
