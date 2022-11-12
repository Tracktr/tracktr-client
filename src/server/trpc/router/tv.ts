import { router, publicProcedure } from "../trpc";
import { z } from "zod";
import { Prisma } from "@prisma/client";
import convertImageToPrimaryColor from "../../../utils/colors";

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
      url.searchParams.append("append_to_response", "credits,watch/providers");
      if (ctx) url.searchParams.append("language", ctx.session?.user?.profile.language as string);

      const res = await fetch(url);
      const json = await res.json();

      const color = await convertImageToPrimaryColor({ image: json.poster_path, fallback: json.backdrop_path });

      if (ctx && input?.tvID) {
        const episodesWatched = await ctx.prisma.$queryRaw`
          SELECT CAST(COUNT(DISTINCT EpisodesHistory.episode_number) as UNSIGNED)
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
          };
        }
      }

      return {
        ...json,
        theme_color: color,
      };
    }),

  infiniteTV: publicProcedure
    .input(
      z.object({
        cursor: z.number().nullish(),
      })
    )
    .query(async ({ ctx, input }) => {
      const url = new URL("tv/popular", process.env.NEXT_PUBLIC_TMDB_API);
      url.searchParams.append("api_key", process.env.NEXT_PUBLIC_TMDB_KEY || "");
      url.searchParams.append("page", input?.cursor?.toString() || "1");
      if (ctx) url.searchParams.append("language", ctx.session?.user?.profile.language as string);

      const res = await fetch(url);
      const json = await res.json();

      return {
        ...json,
      };
    }),

  searchTV: publicProcedure
    .input(
      z.object({
        cursor: z.number().nullish(),
        query: z.string().nullish(),
      })
    )
    .query(async ({ ctx, input }) => {
      const url = new URL("search/tv", process.env.NEXT_PUBLIC_TMDB_API);
      url.searchParams.append("api_key", process.env.NEXT_PUBLIC_TMDB_KEY || "");
      url.searchParams.append("query", input?.query || "");
      url.searchParams.append("page", input?.cursor?.toString() || "1");
      if (ctx) url.searchParams.append("language", ctx.session?.user?.profile.language as string);
      if (ctx) url.searchParams.append("include_adult", ctx.session?.user?.profile?.adult ? "true" : "false");

      const res = await fetch(url);
      const json = await res.json();

      return {
        ...json,
      };
    }),
});
