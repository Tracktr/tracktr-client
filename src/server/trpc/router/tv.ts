import { router, publicProcedure } from "../trpc";
import { z } from "zod";

export const tvRouter = router({
  tvById: publicProcedure
    .input(
      z.object({
        tvID: z.string().nullish(),
      })
    )
    .query(async ({ input }) => {
      const url = new URL(`tv/${input?.tvID}`, process.env.NEXT_PUBLIC_TMDB_API);
      url.searchParams.append("api_key", process.env.NEXT_PUBLIC_TMDB_KEY || "");
      url.searchParams.append("append_to_response", "credits");

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
    .query(async ({ input }) => {
      const url = new URL("tv/popular", process.env.NEXT_PUBLIC_TMDB_API);
      url.searchParams.append("api_key", process.env.NEXT_PUBLIC_TMDB_KEY || "");
      url.searchParams.append("page", input?.cursor?.toString() || "1");

      const res = await fetch(url);
      const json = await res.json();

      return {
        ...json,
      };
    }),
});
