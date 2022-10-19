import { router, publicProcedure } from "../trpc";
import { z } from "zod";

export const seasonRouter = router({
  seasonByID: publicProcedure
    .input(
      z.object({
        tvID: z.string().nullish(),
        seasonID: z.string().nullish(),
      })
    )
    .query(async ({ input }) => {
      const url = new URL(`tv/${input?.tvID}/season/${input?.seasonID}`, process.env.NEXT_PUBLIC_TMDB_API);
      url.searchParams.append("api_key", process.env.NEXT_PUBLIC_TMDB_KEY || "");
      url.searchParams.append("append_to_response", "credits");

      const res = await fetch(url);
      const json = await res.json();

      return {
        ...json,
      };
    }),
});
