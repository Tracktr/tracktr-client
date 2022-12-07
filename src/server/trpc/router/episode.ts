import { router, publicProcedure, protectedProcedure } from "../trpc";
import { z } from "zod";
import createNewSeries from "../../../utils/createNewSeries";

export const episodeRouter = router({
  episodeById: publicProcedure
    .input(
      z.object({
        tvID: z.string().nullish(),
        seasonID: z.string().nullish(),
        episodeNumber: z.string().nullish(),
      })
    )
    .query(async ({ ctx, input }) => {
      const url = new URL(
        `tv/${input?.tvID}/season/${input?.seasonID}/episode/${input?.episodeNumber}`,
        process.env.NEXT_PUBLIC_TMDB_API
      );
      url.searchParams.append("api_key", process.env.NEXT_PUBLIC_TMDB_KEY || "");
      url.searchParams.append("append_to_response", "credits");
      if (ctx) url.searchParams.append("language", ctx.session?.user?.profile.language as string);

      const res = await fetch(url);
      const json = await res.json();

      const databaseEpisodes = await ctx.prisma.episodes.findFirst({
        where: { id: json.id },
        include: {
          EpisodesReviews: {
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

      return {
        ...json,
        reviews: databaseEpisodes?.EpisodesReviews || [],
      };
    }),

  markEpisodeAsWatched: protectedProcedure
    .input(
      z.object({
        episodeNumber: z.number(),
        seasonNumber: z.number(),
        seriesID: z.number(),
        seasonId: z.number(),
        episodeId: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const existsInDB = await ctx.prisma.series.findFirst({
        where: { id: input?.seriesID },
      });

      if (!existsInDB) {
        const url = new URL(`tv/${input?.seriesID}`, process.env.NEXT_PUBLIC_TMDB_API);
        url.searchParams.append("api_key", process.env.NEXT_PUBLIC_TMDB_KEY || "");
        if (ctx) url.searchParams.append("language", ctx.session?.user?.profile.language as string);

        const show = await fetch(url).then((res) => res.json());

        const seriesPoster = show.poster_path ? show.poster_path : "/noimage.png";

        const newSeriesCreateUpdate = await createNewSeries({ show, seriesPoster, id: input.seriesID });

        const newSeries = await ctx.prisma.series.upsert({
          where: { id: input.seriesID },
          update: newSeriesCreateUpdate,
          create: newSeriesCreateUpdate,
        });

        if (newSeries !== null) {
          const result = await ctx.prisma.episodesHistory.create({
            data: {
              datetime: new Date(),
              user_id: ctx?.session?.user?.id as string,
              series_id: input.seriesID,
              season_id: input.seasonId,
              episode_id: input.episodeId,
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
            series_id: input.seriesID,
            season_id: input.seasonId,
            episode_id: input.episodeId,
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
        seriesID: z.number(),
      })
    )
    .query(async ({ ctx, input }) => {
      const result = await ctx.prisma.episodesHistory.findMany({
        where: {
          user_id: ctx.session.user.id,
          series_id: input.seriesID,
          season_number: input.seasonNumber,
          episode_number: input.episodeNumber,
        },
      });

      return {
        ...result,
      };
    }),
});
