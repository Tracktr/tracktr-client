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
    if (ctx.session?.user) {
      url.searchParams.append("language", ctx.session?.user?.profile.language);
      url.searchParams.append("include_adult", ctx.session?.user?.profile?.adult ? "true" : "false");
      url.searchParams.append("region", ctx.session?.user?.profile?.region);
    }

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
        json.results.map(async (item: any) => {
          if (item.title) {
            const watched = await ctx.prisma.moviesHistory.findFirst({
              where: {
                user_id: ctx?.session?.user?.id as string,
                movie_id: item.id,
              },
            });
            const watchlist = await ctx.prisma.watchlist.findFirst({
              where: {
                user_id: ctx.session?.user?.profile.userId,
              },
              include: {
                WatchlistItem: {
                  where: {
                    movie_id: item.id,
                  },
                },
              },
            });

            return {
              ...item,
              watched: Boolean(watched),
              watched_id: watched?.id || null,
              watchlist: Boolean(watchlist?.WatchlistItem && watchlist.WatchlistItem.length > 0),
              watchlist_id: watchlist?.WatchlistItem[0]?.id || null,
            };
          } else if (item.name) {
            const watched = await ctx.prisma.episodesHistory.findFirst({
              where: {
                user_id: ctx?.session?.user?.id,
                series_id: item.id,
                NOT: {
                  season: {
                    season_number: 0,
                  },
                },
              },
              distinct: ["episode_id"],
            });
            const watchlist = await ctx.prisma.watchlist.findFirst({
              where: {
                user_id: ctx.session?.user?.profile.userId,
              },
              include: {
                WatchlistItem: {
                  where: {
                    series_id: item.id,
                  },
                },
              },
            });

            return {
              ...item,
              watched: Boolean(watched),
              watched_id: watched?.id || null,
              watchlist: Boolean(watchlist?.WatchlistItem && watchlist.WatchlistItem.length > 0),
              watchlist_id: watchlist?.WatchlistItem[0]?.id || null,
            };
          } else {
            return item;
          }
        })
      );
    }

    return {
      ...json,
    };
  });
