import { router, publicProcedure, protectedProcedure } from "../trpc";
import { z } from "zod";
import convertImageToPrimaryColor from "../../../utils/colors";
import { TRPCError } from "@trpc/server";
import { Movies, MoviesHistory, Profile, User } from "@prisma/client";

export interface IMovie {
  adult: boolean;
  backdrop_path: string;
  genre_ids: number[];
  id: number;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  release_date: string;
  title: string;
  video: false;
  vote_average: number;
  vote_count: 815;
}

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
      url.searchParams.append("append_to_response", "credits,videos,watch/providers,recommendations");
      if (ctx) url.searchParams.append("language", ctx.session?.user?.profile.language as string);

      const res = await fetch(url);
      const json = await res.json();

      if (json?.status_code) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: json.status_message,
          cause: json.status_code,
        });
      }

      const color = await convertImageToPrimaryColor({ image: json.poster_path, fallback: json.backdrop_path });

      const databaseMovie = await ctx.prisma.movies.findFirst({
        where: { id: json.id },
        include: {
          Reviews: {
            include: {
              user: {
                include: {
                  profile: true,
                },
              },
            },
            take: 3,
            orderBy: {
              created: "desc",
            },
          },
        },
      });

      if (!databaseMovie) {
        await ctx.prisma.movies.create({
          data: {
            id: json.id,
            title: json.title,
            poster: json.poster_path,
            release_date: json.release_date ? new Date(json.release_date) : null,
          },
        });
      }

      return {
        ...json,
        theme_color: color,
        reviews: databaseMovie?.Reviews || [],
      };
    }),

  infiniteMovies: publicProcedure
    .input(
      z.object({
        cursor: z.number().nullish(),
        filter: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const url: URL = new URL(`movie/${input.filter}`, process.env.NEXT_PUBLIC_TMDB_API);
      url.searchParams.append("api_key", process.env.NEXT_PUBLIC_TMDB_KEY || "");
      url.searchParams.append("page", input?.cursor?.toString() || "1");
      if (ctx?.session?.user) url.searchParams.append("language", ctx.session?.user?.profile.language as string);
      if (ctx?.session?.user) url.searchParams.append("region", ctx.session?.user?.profile.region as string);

      const res = await fetch(url);
      const json = await res.json();

      if (json?.status_code) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: json.status_message,
          cause: json.status_code,
        });
      }

      if (ctx.session?.user) {
        json.results = await Promise.all(
          json.results.map(async (movie: IMovie) => {
            const watched = await ctx.prisma.moviesHistory.findFirst({
              where: {
                user_id: ctx.session?.user?.id,
                movie_id: movie.id,
              },
            });
            const watchlist = await ctx.prisma.watchlist.findFirst({
              where: {
                user_id: ctx.session?.user?.profile.userId,
              },
              include: {
                WatchlistItem: {
                  where: {
                    movie_id: movie.id,
                  },
                },
              },
            });

            return {
              ...movie,
              watched: Boolean(watched),
              watched_id: watched?.id || null,
              watchlist: Boolean(watchlist?.WatchlistItem && watchlist.WatchlistItem.length > 0),
              watchlist_id: watchlist?.WatchlistItem[0]?.id || null,
            };
          })
        );
      } else {
        json.results = json.results.map((movie: IMovie) => {
          return { ...movie, watched: false };
        });
      }

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
      if (ctx) url.searchParams.append("region", ctx.session?.user?.profile.region as string);

      const res = await fetch(url);
      const json = await res.json();

      if (json?.status_code) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: json.status_message,
          cause: json.status_code,
        });
      }

      if (ctx?.session?.user) {
        json.results = await Promise.all(
          json.results.map(async (movie: IMovie) => {
            const watched = await ctx.prisma.moviesHistory.findFirst({
              where: {
                user_id: ctx?.session?.user?.id as string,
                movie_id: movie.id,
              },
            });

            if (watched) {
              return { ...movie, watched: true, watched_id: watched.id };
            } else {
              return { ...movie, watched: false, watched_id: null };
            }
          })
        );
      } else {
        json.results = json.results.map((movie: IMovie) => {
          return { ...movie, watched: false };
        });
      }

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
      if (ctx) movie.searchParams.append("language", ctx.session?.user?.profile.language as string);

      const res = await fetch(movie);
      const json = await res.json();

      if (json?.status_code) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: json.status_message,
          cause: json.status_code,
        });
      }

      const newMovie = await ctx.prisma.movies.upsert({
        where: {
          id: input?.movieId,
        },
        update: {},
        create: {
          id: input?.movieId,
          title: json.title,
          poster: json.poster_path,
          release_date: json.release_date ? new Date(json.release_date) : null,
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
      } else {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Could not add to history",
        });
      }
    }),

  removeMovieFromWatched: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const result = await ctx.prisma.moviesHistory.deleteMany({
        where: {
          user_id: ctx.session.user.id,
          id: input.id,
        },
      });

      return {
        ...result,
      };
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
        orderBy: {
          datetime: "asc",
        },
      });

      return {
        ...result,
      };
    }),

  seenBy: protectedProcedure
    .input(
      z.object({
        id: z.number(),
      })
    )
    .query(async ({ ctx, input }) => {
      const activity = await ctx.prisma.user.findFirst({
        where: {
          id: ctx.session.user.id,
        },
        include: {
          following: {
            include: {
              profile: true,
              MoviesHistory: {
                where: {
                  movie_id: input.id,
                },
                include: {
                  movie: true,
                },
              },
            },
          },
        },
      });

      const response:
        | (User & {
            profile: Profile | null;
            MoviesHistory: (MoviesHistory & { movie: Movies })[];
          })[]
        | undefined = [];
      activity?.following.map((user) => user.MoviesHistory.length > 0 && response.push(user));

      return response;
    }),
});
