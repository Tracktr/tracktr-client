import { router, publicProcedure } from "../trpc";
import { z } from "zod";

export const movieRouter = router({
  movieById: publicProcedure
    .input(
      z.object({
        slug: z.string().nullish(),
      })
    )
    .query(async ({ input }) => {
      const url = new URL(`movie/${input?.slug}`, process.env.NEXT_PUBLIC_TMDB_API);
      url.searchParams.append("api_key", process.env.NEXT_PUBLIC_TMDB_KEY || "");
      url.searchParams.append("append_to_response", "credits");

      const res = await fetch(url);
      const json = await res.json();

      return {
        ...json,
      };
    }),

  infiniteMovies: publicProcedure
    .input(
      z.object({
        cursor: z.number().nullish(),
      })
    )
    .query(async ({ input }) => {
      const url = new URL("movie/popular", process.env.NEXT_PUBLIC_TMDB_API);
      url.searchParams.append("api_key", process.env.NEXT_PUBLIC_TMDB_KEY || "");
      url.searchParams.append("page", input?.cursor?.toString() || "1");

      const res = await fetch(url);
      const json = await res.json();

      return {
        ...json,
      };
    }),
});
