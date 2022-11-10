import { router, publicProcedure } from "../trpc";
import { z } from "zod";

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

      return {
        ...json,
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
