import { router, publicProcedure, protectedProcedure } from "../trpc";
import { z } from "zod";
import { TmdbEpisode } from "../../../types/tmdb";
import createNewSeries from "../../../utils/createNewSeries";

export const seasonRouter = router({
  seasonByID: publicProcedure
    .input(
      z.object({
        tvID: z.string().nullish(),
        seasonID: z.number(),
      })
    )
    .query(async ({ ctx, input }) => {
      const url: URL = new URL(`tv/${input?.tvID}/season/${input?.seasonID}`, process.env.NEXT_PUBLIC_TMDB_API);
      url.searchParams.append("api_key", process.env.NEXT_PUBLIC_TMDB_KEY || "");
      url.searchParams.append("append_to_response", "credits");
      if (ctx) url.searchParams.append("language", ctx.session?.user?.profile.language as string);

      const res = await fetch(url);
      const json = await res.json();

      const databaseSeason = await ctx.prisma.seasons.findFirst({
        where: { series_id: Number(input?.tvID), season_number: input.seasonID },
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

      if (!databaseSeason) {
        const showUrl = new URL(`tv/${input?.tvID}`, process.env.NEXT_PUBLIC_TMDB_API);
        showUrl.searchParams.append("api_key", process.env.NEXT_PUBLIC_TMDB_KEY || "");

        const show = await fetch(showUrl).then((res) => res.json());

        const seriesPoster = show.poster_path ? show.poster_path : "/noimage.png";

        const newSeries = await createNewSeries({ show, seriesPoster, id: Number(input.tvID) });

        await ctx.prisma.series.upsert({
          where: { id: Number(input.tvID) },
          update: newSeries,
          create: newSeries,
        });
      }

      if (ctx?.session?.user) {
        json.episodes = await Promise.all(
          json.episodes.map(async (episode: TmdbEpisode) => {
            const watched = await ctx.prisma.episodesHistory.findFirst({
              where: {
                user_id: ctx?.session?.user?.id as string,
                series_id: episode.show_id,
                season_number: episode.season_number,
                episode_number: episode.episode_number,
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
        json.episodes = json.episodes.map((episode: TmdbEpisode) => {
          return { ...episode, watched: false };
        });
      }

      return {
        ...json,
        reviews: databaseSeason?.SeriesReviews || [],
      };
    }),

  markSeasonAsWatched: protectedProcedure
    .input(
      z.object({
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
        const newSeriesCreateUpdate = await createNewSeries({ show, seriesPoster, id: input.seriesId });
        const newSeries = await ctx.prisma.series.upsert({
          where: { id: input.seriesId },
          update: newSeriesCreateUpdate,
          create: newSeriesCreateUpdate,
        });
        if (newSeries !== null) {
          const episodeCount = show.seasons[input.seasonNumber].episode_count;
          const result = [];

          for (let i = 1; i <= episodeCount; i++) {
            result.push(
              await ctx.prisma.episodesHistory.create({
                data: {
                  datetime: new Date(),
                  user_id: ctx?.session?.user?.id as string,
                  series_id: input.seriesId,
                  season_number: input.seasonNumber,
                  episode_number: i,
                },
              })
            );
          }

          return result;
        }
      } else {
        const episodeCount = show.seasons[input.seasonNumber].episode_count;
        const result = [];

        for (let i = 1; i <= episodeCount; i++) {
          result.push(
            await ctx.prisma.episodesHistory.create({
              data: {
                datetime: new Date(),
                user_id: ctx?.session?.user?.id as string,
                series_id: input.seriesId,
                season_number: input.seasonNumber,
                episode_number: i,
              },
            })
          );
        }

        return result;
      }
    }),

  removeSeasonFromWatched: protectedProcedure
    .input(
      z.object({
        seasonNumber: z.number(),
        seriesId: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const result = await ctx.prisma.episodesHistory.deleteMany({
        where: {
          user_id: ctx.session.user.id,
          season_number: input.seasonNumber,
          series_id: input.seriesId,
        },
      });

      return {
        ...result,
      };
    }),

  watchHistoryByID: protectedProcedure
    .input(
      z.object({
        seasonNumber: z.number(),
        seriesId: z.number(),
      })
    )
    .query(async ({ ctx, input }) => {
      const url = new URL(`tv/${input?.seriesId}/season/${input.seasonNumber}`, process.env.NEXT_PUBLIC_TMDB_API);
      url.searchParams.append("api_key", process.env.NEXT_PUBLIC_TMDB_KEY || "");

      const season = await fetch(url).then((res) => res.json());

      const result = await ctx.prisma.episodesHistory.findMany({
        where: {
          user_id: ctx.session.user.id,
          series_id: input.seriesId,
          season_number: input.seasonNumber,
        },
        distinct: ["episode_number"],
        orderBy: {
          datetime: "desc",
        },
      });

      return {
        results: result,
        episodeAmount: season.episodes.length,
      };
    }),
});
