import { router, publicProcedure, protectedProcedure } from "../trpc";
import { z } from "zod";
import { TmdbEpisode } from "../../../types/tmdb";

export const episodeRouter = router({
  episodeById: publicProcedure
    .input(
      z.object({
        tvID: z.string().nullish(),
        seasonID: z.string().nullish(),
        episodeID: z.string().nullish(),
      })
    )
    .query(async ({ ctx, input }) => {
      const url = new URL(
        `tv/${input?.tvID}/season/${input?.seasonID}/episode/${input?.episodeID}`,
        process.env.NEXT_PUBLIC_TMDB_API
      );
      url.searchParams.append("api_key", process.env.NEXT_PUBLIC_TMDB_KEY || "");
      url.searchParams.append("append_to_response", "credits");
      if (ctx) url.searchParams.append("language", ctx.session?.user?.profile.language as string);

      const res = await fetch(url);
      const json = await res.json();

      return {
        ...json,
      };
    }),

  markEpisodeAsWatched: protectedProcedure
    .input(
      z.object({
        episodeNumber: z.number(),
        seasonNumber: z.number(),
        seriesId: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const url = new URL(`tv/${input?.seriesId}`, process.env.NEXT_PUBLIC_TMDB_API);
      url.searchParams.append("api_key", process.env.NEXT_PUBLIC_TMDB_KEY || "");
      if (ctx) url.searchParams.append("language", ctx.session?.user?.profile.language as string);

      const show = await fetch(url).then((res) => res.json());

      const seriesPoster = show.poster_path ? show.poster_path : "/noimage.png";

      const existsInDB = await ctx.prisma.series.findFirst({
        where: { id: show.id },
      });

      if (!existsInDB) {
        const newSeriesCreateUpdate = {
          id: show.id,
          name: show.name,
          poster: seriesPoster,
          seasons: {
            connectOrCreate: await Promise.all(
              show.seasons.map(
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
                    `tv/${input?.seriesId}/season/${season.season_number}`,
                    process.env.NEXT_PUBLIC_TMDB_API
                  );
                  url.searchParams.append("api_key", process.env.NEXT_PUBLIC_TMDB_KEY || "");

                  const seasonWithEpisodes = await fetch(url).then((res) => res.json());

                  return {
                    where: { id: season.id },
                    create: {
                      id: season.id,
                      name: season.name,
                      poster: season.poster_path ? season.poster_path : seriesPoster,
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
                              air_date: e.air_date ? new Date(e.air_date) : null,
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
        };

        const newSeries = await ctx.prisma.series.upsert({
          where: { id: input.seriesId },
          update: newSeriesCreateUpdate,
          create: newSeriesCreateUpdate,
        });

        if (newSeries !== null) {
          const result = await ctx.prisma.episodesHistory.create({
            data: {
              datetime: new Date(),
              user_id: ctx?.session?.user?.id as string,
              series_id: input.seriesId,
              season_number: input.seasonNumber,
              episode_number: input.episodeNumber,
            },
          });
          return result;
        }
      } else {
        const result = await ctx.prisma.episodesHistory.create({
          data: {
            datetime: new Date(),
            user_id: ctx?.session?.user?.id as string,
            series_id: input.seriesId,
            season_number: input.seasonNumber,
            episode_number: input.episodeNumber,
          },
        });

        return result;
      }
    }),

  removeEpisodeFromWatched: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const result = await ctx.prisma.episodesHistory.deleteMany({
        where: {
          user_id: ctx.session.user.id,
          id: input.id,
        },
      });

      return {
        ...result,
      };
    }),

  watchHistoryByID: protectedProcedure
    .input(
      z.object({
        episodeNumber: z.number(),
        seasonNumber: z.number(),
        seriesId: z.number(),
      })
    )
    .query(async ({ ctx, input }) => {
      const result = await ctx.prisma.episodesHistory.findMany({
        where: {
          user_id: ctx.session.user.id,
          series_id: input.seriesId,
          season_number: input.seasonNumber,
          episode_number: input.episodeNumber,
        },
      });

      return {
        ...result,
      };
    }),
});
