import { router, publicProcedure } from "../trpc";
import { z } from "zod";
import convertImageToPrimaryColor from "../../../utils/colors";
import { TmdbEpisode } from "../../../types/tmdb";

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
            take: 6,
          },
        },
      });

      if (!databaseSeries) {
        await ctx.prisma.series.create({
          data: {
            id: json.id,
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

                    const seasonWithEpisodes = await fetch(url).then((res) => res.json());

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
          },
        });
      }

      if (ctx && input?.tvID) {
        const episodesWatched = await ctx.prisma.$queryRaw`
          SELECT CAST(COUNT(DISTINCT EpisodesHistory.episode_number, EpisodesHistory.season_number) as UNSIGNED)
          as "count"
          FROM EpisodesHistory
          WHERE series_id = ${input?.tvID}
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
});
