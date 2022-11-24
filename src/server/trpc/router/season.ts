import { router, publicProcedure } from "../trpc";
import { z } from "zod";
import { TmdbEpisode } from "../../../types/tmdb";

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
      };
    }),
});
