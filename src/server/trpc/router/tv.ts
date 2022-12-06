import { router, publicProcedure, protectedProcedure } from "../trpc";
import { z } from "zod";
import convertImageToPrimaryColor from "../../../utils/colors";
import createNewSeries from "../../../utils/createNewSeries";

export const tvRouter = router({
  tvById: publicProcedure
    .input(
      z.object({
        tvID: z.string().nullish(),
      })
    )
    .query(async ({ ctx, input }) => {
      const url = new URL(`tv/${input?.tvID}`, process.env.NEXT_PUBLIC_TMDB_API);
      url.searchParams.append("api_key", process.env.NEXT_PUBLIC_TMDB_KEY || "");
      url.searchParams.append("append_to_response", "credits,watch/providers,videos");
      if (ctx) url.searchParams.append("language", ctx.session?.user?.profile.language as string);

      const res = await fetch(url);
      const json = await res.json();

      const color = await convertImageToPrimaryColor({ image: json.poster_path, fallback: json.backdrop_path });

      const databaseSeries = await ctx.prisma.series.findFirst({
        where: { id: json.id },
        include: {
          SeriesReviews: {
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

      if (!databaseSeries) {
        const seriesPoster = json.poster_path ? json.poster_path : "/noimage.png";

        const newSeries = await createNewSeries({ show: json, seriesPoster, id: Number(input.tvID) });

        await ctx.prisma.series.upsert({
          where: { id: Number(input.tvID) },
          update: newSeries,
          create: newSeries,
        });
      }

      if (ctx && input?.tvID) {
        const episodesWatched = await ctx.prisma.$queryRaw`
          SELECT CAST(COUNT(DISTINCT EpisodesHistory.episode_number, EpisodesHistory.season_number) as UNSIGNED)
          as "count"
          FROM EpisodesHistory
          WHERE series_id = ${input?.tvID}
          AND user_id = ${ctx.session?.user?.id}
          AND NOT season_number = 0
        `;

        if (episodesWatched) {
          return {
            ...json,
            number_of_episodes_watched: episodesWatched,
            theme_color: color,
            reviews: databaseSeries?.SeriesReviews || [],
          };
        }
      }

      return {
        ...json,
        theme_color: color,
        reviews: databaseSeries?.SeriesReviews || [],
      };
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

      return {
        ...json,
      };
    }),

  markSeriesAsWatched: protectedProcedure
    .input(
      z.object({
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
          const seasonsCount = show.seasons.length;
          const result = [];

          for (let j = 1; j <= seasonsCount; j++) {
            const episodeCount = show.seasons[j].episode_count;

            for (let i = 1; i <= episodeCount; i++) {
              result.push(
                await ctx.prisma.episodesHistory.create({
                  data: {
                    datetime: new Date(),
                    user_id: ctx?.session?.user?.id as string,
                    series_id: input.seriesId,
                    season_number: j,
                    episode_number: i,
                  },
                })
              );
            }
          }

          return result;
        }
      } else {
        const seasonsCount = show.number_of_seasons;
        const result = [];

        for (let j = 1; j <= seasonsCount; j++) {
          const episodeCount = show.seasons[j].episode_count;

          for (let i = 1; i <= episodeCount; i++) {
            result.push(
              await ctx.prisma.episodesHistory.create({
                data: {
                  datetime: new Date(),
                  user_id: ctx?.session?.user?.id as string,
                  series_id: input.seriesId,
                  season_number: j,
                  episode_number: i,
                },
              })
            );
          }
        }

        return result;
      }
    }),

  removeSeriesFromWatched: protectedProcedure
    .input(
      z.object({
        seriesId: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const result = await ctx.prisma.episodesHistory.deleteMany({
        where: {
          user_id: ctx.session.user.id,
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
        seriesId: z.number(),
      })
    )
    .query(async ({ ctx, input }) => {
      const url = new URL(`tv/${input?.seriesId}`, process.env.NEXT_PUBLIC_TMDB_API);
      url.searchParams.append("api_key", process.env.NEXT_PUBLIC_TMDB_KEY || "");

      const show = await fetch(url).then((res) => res.json());

      const result = await ctx.prisma.episodesHistory.findMany({
        where: {
          user_id: ctx.session.user.id,
          series_id: input.seriesId,
        },
        distinct: ["season_number", "episode_number"],
        orderBy: {
          datetime: "desc",
        },
      });

      return {
        results: result,
        episodeAmount: show.number_of_episodes,
      };
    }),
});
