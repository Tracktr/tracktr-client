import { router, publicProcedure, protectedProcedure } from "../trpc";
import { z } from "zod";

export const movieRouter = router({
  movieById: publicProcedure
    .input(
      z.object({
        slug: z.string().nullish(),
      })
    )
    .query(async ({ ctx, input }) => {
      const url = new URL(`movie/${input?.slug}`, process.env.NEXT_PUBLIC_TMDB_API);
      url.searchParams.append("api_key", process.env.NEXT_PUBLIC_TMDB_KEY || "");
      url.searchParams.append("append_to_response", "credits,watch/providers");
      if (ctx) url.searchParams.append("language", ctx.session?.user?.profile.language as string);

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
    .query(async ({ ctx, input }) => {
      const url = new URL("movie/popular", process.env.NEXT_PUBLIC_TMDB_API);
      url.searchParams.append("api_key", process.env.NEXT_PUBLIC_TMDB_KEY || "");
      url.searchParams.append("page", input?.cursor?.toString() || "1");
      if (ctx) url.searchParams.append("language", ctx.session?.user?.profile.language as string);

      const res = await fetch(url);
      const json = await res.json();

      return {
        ...json,
      };
    }),

  searchMovie: publicProcedure
    .input(
      z.object({
        cursor: z.number().nullish(),
        query: z.string().nullish(),
      })
    )
    .query(async ({ ctx, input }) => {
      const url = new URL("search/multi", process.env.NEXT_PUBLIC_TMDB_API);
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

  markMovieAsWatched: protectedProcedure
    .input(
      z.object({
        movieId: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const movie = new URL(`movie/${input?.movieId}`, process.env.NEXT_PUBLIC_TMDB_API);
      movie.searchParams.append("api_key", process.env.NEXT_PUBLIC_TMDB_KEY || "");
      movie.searchParams.append("append_to_response", "credits");
      if (ctx) movie.searchParams.append("language", ctx.session?.user?.profile.language as string);

      const res = await fetch(movie);
      const json = await res.json();

      const newMovie = await ctx.prisma.movies.upsert({
        where: {
          id: input?.movieId,
        },
        update: {},
        create: {
          id: input?.movieId,
          title: json.title,
          poster: json.poster_path,
        },
      });

      if (newMovie !== null) {
        const result = await ctx.prisma.moviesHistory.create({
          data: {
            datetime: new Date(),
            movie_id: input?.movieId,
            user_id: ctx?.session?.user?.id as string,
          },
        });

        return result;
      }
    }),

  watchHistoryByID: protectedProcedure
    .input(
      z.object({
        movieId: z.number(),
      })
    )
    .query(async ({ ctx, input }) => {
      const result = await ctx.prisma.moviesHistory.findMany({
        where: {
          user_id: ctx.session.user.id,
          movie_id: input?.movieId,
        },
      });

      return {
        ...result,
      };
    }),
});
