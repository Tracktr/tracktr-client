import { router, publicProcedure } from "../trpc";
import { z } from "zod";

export const multiRouter = router({
  searchMulti: publicProcedure
    .input(
      z.object({
        cursor: z.number().nullish(),
        query: z.string().nullish(),
      })
    )
    .query(async ({ input }) => {
      const url = new URL("search/multi", process.env.NEXT_PUBLIC_TMDB_API);
      url.searchParams.append("api_key", process.env.NEXT_PUBLIC_TMDB_KEY || "");
      url.searchParams.append("query", input?.query || "");
      url.searchParams.append("page", input?.cursor?.toString() || "1");

      const res = await fetch(url);
      const json = await res.json();

      return {
        ...json,
      };
    }),
});
