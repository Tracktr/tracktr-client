import { router, publicProcedure, protectedProcedure } from "../trpc";
import { z } from "zod";
import convertImageToPrimaryColor from "../../../utils/colors";
import createNewSeries from "../../../utils/createNewSeries";

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

      if (ctx && input.seriesID) {
        const episodesWatched = await ctx.prisma.$queryRaw`
          SELECT CAST(COUNT(DISTINCT EpisodesHistory.episode_id, EpisodesHistory.season_id) as UNSIGNED)
          as "count"
          FROM EpisodesHistory
          WHERE series_id = ${input.seriesID}
          AND user_id = ${ctx.session?.user?.id}
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
        seriesID: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const url = new URL(`tv/${input?.seriesID}`, process.env.NEXT_PUBLIC_TMDB_API);
      url.searchParams.append("api_key", process.env.NEXT_PUBLIC_TMDB_KEY || "");

      const show = await fetch(url).then((res) => res.json());

      const seasonsCount = show.number_of_seasons;
      const firstSeason: number = show.seasons[0].season_number;

      const seriesPoster = show.poster_path ? show.poster_path : "/noimage.png";

      const existsInDB = await ctx.prisma.series.findFirst({
        where: { id: show.id },
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
                firstSeason,
                seasonsCount,
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
              firstSeason,
              seasonsCount,
              seriesID: input.seriesID,
              userID: ctx.session.user.id,
            }),
          });
        } catch (error) {
          console.error(error);
        }
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

      const result = await ctx.prisma.episodesHistory.findMany({
        where: {
          user_id: ctx.session.user.id,
          series_id: input.seriesID,
        },
        distinct: ["season_id", "episode_id"],
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

    if (season.season_number === 0) continue;

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
        console.error(error);
      }
    }
  }

  return results;
};
