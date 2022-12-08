import { router, publicProcedure, protectedProcedure } from "../trpc";
import { z } from "zod";
import { TmdbEpisode } from "../../../types/tmdb";
import createNewSeries from "../../../utils/createNewSeries";
import { TRPCError } from "@trpc/server";

export const seasonRouter = router({
  seasonByID: publicProcedure
    .input(
      z.object({
        seriesID: z.number(),
        seasonNumber: z.number(),
      })
    )
    .query(async ({ ctx, input }) => {
      const url: URL = new URL(`tv/${input.seriesID}/season/${input.seasonNumber}`, process.env.NEXT_PUBLIC_TMDB_API);
      url.searchParams.append("api_key", process.env.NEXT_PUBLIC_TMDB_KEY || "");
      url.searchParams.append("append_to_response", "credits");
      if (ctx) url.searchParams.append("language", ctx.session?.user?.profile.language as string);

      const season = await fetch(url).then((res) => res.json());

      if (season?.status_code) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: season.status_message,
          cause: season.status_code,
        });
      }

      const databaseSeason = await ctx.prisma.seasons.findFirst({
        where: { id: season.id },
        include: {
          SeasonsReviews: {
            include: {
              user: {
                include: {
                  profile: true,
                },
              },
            },
            take: 10,
            orderBy: {
              created: "desc",
            },
          },
        },
      });

      if (ctx?.session?.user) {
        season.episodes = await Promise.all(
          season.episodes.map(async (episode: TmdbEpisode) => {
            const watched = await ctx.prisma.episodesHistory.findFirst({
              where: {
                user_id: ctx?.session?.user?.id as string,
                series_id: episode.show_id,
                episode_id: episode.id,
              },
            });

            if (watched) {
              return { ...episode, watched: true, watched_id: watched.id };
            } else {
              return { ...episode, watched: false, watched_id: null };
            }
          })
        );
      } else {
        season.episodes = season.episodes.map((episode: TmdbEpisode) => {
          return { ...episode, watched: false };
        });
      }

      return {
        ...season,
        reviews: databaseSeason?.SeasonsReviews || [],
      };
    }),

  markSeasonAsWatched: protectedProcedure
    .input(
      z.object({
        seasonNumber: z.number(),
        seriesID: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const url = new URL(`tv/${input?.seriesID}`, process.env.NEXT_PUBLIC_TMDB_API);
      url.searchParams.append("api_key", process.env.NEXT_PUBLIC_TMDB_KEY || "");
      if (ctx) url.searchParams.append("language", ctx.session?.user?.profile.language as string);

      const show = await fetch(url).then((res) => res.json());

      if (show?.status_code) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: show.status_message,
          cause: show.status_code,
        });
      }

      const seriesPoster = show.poster_path ? show.poster_path : "/noimage.png";

      const existsInDB = await ctx.prisma.series.findFirst({
        where: { id: input.seriesID },
      });

      if (!existsInDB) {
        const newSeriesCreateUpdate = await createNewSeries({ show, seriesPoster, id: input.seriesID });
        const newSeries = await ctx.prisma.series.upsert({
          where: { id: input.seriesID },
          update: newSeriesCreateUpdate,
          create: newSeriesCreateUpdate,
        });

        if (newSeries !== null) {
          try {
            return await ctx.prisma.episodesHistory.createMany({
              data: await saveHistory({
                seasonNumber: input.seasonNumber,
                seriesID: input.seriesID,
                userID: ctx.session.user.id,
              }),
            });
          } catch (error) {
            console.error(error);
          }
        }
      } else {
        try {
          return await ctx.prisma.episodesHistory.createMany({
            data: await saveHistory({
              seasonNumber: input.seasonNumber,
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
      }
    }),

  removeSeasonFromWatched: protectedProcedure
    .input(
      z.object({
        seasonID: z.number(),
        seriesID: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const result = await ctx.prisma.episodesHistory.deleteMany({
        where: {
          user_id: ctx.session.user.id,
          season_id: input.seasonID,
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
        seasonID: z.number(),
      })
    )
    .query(async ({ ctx, input }) => {
      const result = await ctx.prisma.episodesHistory.findMany({
        where: {
          user_id: ctx.session.user.id,
          series_id: input.seriesID,
          season_id: input.seasonID,
        },
        distinct: ["episode_id"],
        orderBy: {
          datetime: "desc",
        },
      });

      const amountOfEpisodes = await ctx.prisma.episodes.count({
        where: {
          seasons_id: input.seasonID,
        },
      });

      return {
        results: result,
        episodeAmount: amountOfEpisodes,
      };
    }),
});

const saveHistory = async ({
  seasonNumber,
  seriesID,
  userID,
}: {
  seasonNumber: number;
  seriesID: number;
  userID: string;
}) => {
  const results: any[] = [];

  const seasonUrl = new URL(`tv/${seriesID}/season/${seasonNumber}`, process.env.NEXT_PUBLIC_TMDB_API);
  seasonUrl.searchParams.append("api_key", process.env.NEXT_PUBLIC_TMDB_KEY || "");

  const season = await fetch(seasonUrl).then((res) => res.json());

  if (season?.status_code) {
    console.error("Failed to fetch season", seriesID, seasonNumber);
  }

  for (let i = 0; i <= season.episodes.length; i++) {
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

  return results;
};
