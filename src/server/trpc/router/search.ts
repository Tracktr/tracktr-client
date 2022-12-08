import { publicProcedure } from "../trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

export const searchRouter = publicProcedure
  .input(
    z.object({
      cursor: z.number().nullish(),
      query: z.string().nullish(),
      type: z.union([z.literal("movie"), z.literal("tv"), z.literal("person"), z.literal("multi")]),
    })
  )
  .query(async ({ ctx, input }) => {
    const { cursor, query, type } = input;

    const url = new URL(`search/${type}`, process.env.NEXT_PUBLIC_TMDB_API);
    url.searchParams.append("api_key", process.env.NEXT_PUBLIC_TMDB_KEY || "");
    url.searchParams.append("query", query || "");
    url.searchParams.append("page", cursor?.toString() || "1");
    if (ctx) url.searchParams.append("language", ctx.session?.user?.profile.language as string);
    if (ctx) url.searchParams.append("include_adult", ctx.session?.user?.profile?.adult ? "true" : "false");
    if (ctx) url.searchParams.append("region", ctx.session?.user?.profile?.region as string);

    const res = await fetch(url);
    const json = await res.json();

    if (json?.status_code) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: json.status_message,
        cause: json.status_code,
      });
    }

    // TODO: specifically for movie
    // if (ctx?.session?.user && type === "movie") {
    //   json.results = await Promise.all(
    //     json.results.map(async (movie: IMovie) => {
    //       const watched = await ctx.prisma.moviesHistory.findFirst({
    //         where: {
    //           user_id: ctx?.session?.user?.id as string,
    //           movie_id: movie.id,
    //         },
    //       });

    //       if (watched) {
    //         return { ...movie, watched: true, watched_id: watched.id };
    //       } else {
    //         return { ...movie, watched: false, watched_id: null };
    //       }
    //     })
    //   );
    // } else if (type === "movie") {
    //   json.results = json.results.map((movie: IMovie) => {
    //     return { ...movie, watched: false };
    //   });
    // }

    return {
      ...json,
    };
  });
