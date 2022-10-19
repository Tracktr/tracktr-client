import { router, publicProcedure } from "../trpc";
import { z } from "zod";

export const personRouter = router({
  personById: publicProcedure
    .input(
      z.object({
        slug: z.string().nullish(),
      })
    )
    .query(async ({ input }) => {
      const url = new URL(`person/${input?.slug}`, process.env.NEXT_PUBLIC_TMDB_API);
      url.searchParams.append("api_key", process.env.NEXT_PUBLIC_TMDB_KEY || "");

      const res = await fetch(url);
      const json = await res.json();

      return {
        ...json,
      };
    }),
});
