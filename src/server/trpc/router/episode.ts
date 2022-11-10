import { router, publicProcedure, protectedProcedure } from "../trpc";
import { z } from "zod";
import { TmdbEpisode, TmdbSeason } from "../../../types/tmdb";

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
      url.searchParams.append("append_to_response", `season/${input.seasonNumber}`);
      if (ctx) url.searchParams.append("language", ctx.session?.user?.profile.language as string);

      const show = await fetch(url).then((res) => res.json());
      const currentSeason = show[`season/${input.seasonNumber}`];
      // Getting the season ID until the append to response is fixed
      // (https://www.themoviedb.org/talk/5bf41a1f0e0a26266f09a707?language=pa-IN)
      currentSeason.id = show.seasons.filter((s: TmdbSeason) => s.season_number === input.seasonNumber)[0].id;

      const newSeries = await ctx.prisma.series.upsert({
        where: { id: input.seriesId },
        update: {},
        create: {
          id: show.id,
          name: show.name,
          poster: show.poster_path,
          // Adds only the current season
          seasons: {
            connectOrCreate: [
              {
                where: { id: currentSeason.id },
                create: {
                  id: currentSeason.id,
                  name: currentSeason.name,
                  poster: currentSeason.poster_path,
                  season_number: currentSeason.season_number,
                  // Loop over all episodes in the season
                  episodes: {
                    connectOrCreate: currentSeason.episodes.map((e: TmdbEpisode) => {
                      return {
                        where: { id: e.id },
                        create: {
                          id: e.id,
                          name: e.name,
                          episode_number: e.episode_number,
                          season_number: e.season_number,
                        },
                      };
                    }),
                  },
                },
              },
            ],
          },
        },
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
    }),
});
