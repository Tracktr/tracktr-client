import { WatchlistItem } from "@prisma/client";
import { z } from "zod";
import paginate from "../../../utils/paginate";
import { router, protectedProcedure } from "../trpc";

export const watchlistRouter = router({
  getUserWatchlist: protectedProcedure
    .input(
      z.object({
        pageSize: z.number(),
        page: z.number(),
      })
    )
    .query(async ({ ctx, input }) => {
      const watchlist = await ctx.prisma.watchlist.findFirst({
        where: {
          user_id: ctx.session.user.profile.userId,
        },
        include: {
          WatchlistItem: {
            include: {
              series: true,
              movies: true,
            },
          },
        },
      });

      if (watchlist?.WatchlistItem) {
        watchlist.WatchlistItem = paginate(watchlist?.WatchlistItem, input.pageSize, input.page);

        if (ctx?.session?.user) {
          watchlist.WatchlistItem = await Promise.all(
            watchlist.WatchlistItem.map(async (item) => {
              if (item.movie_id) {
                const watched = await ctx.prisma.moviesHistory.findFirst({
                  where: {
                    user_id: ctx?.session?.user?.id as string,
                    movie_id: item?.movies?.id,
                  },
                });

                if (watched) {
                  return { ...item, watched: true, watched_id: watched.id };
                } else {
                  return { ...item, watched: false, watched_id: null };
                }
              } else {
                return { ...item, watched: false, watched_id: null };
              }
            })
          );
        } else {
          watchlist.WatchlistItem = watchlist.WatchlistItem.map((item) => {
            return { ...item, watched: false };
          });
        }
      }

      return {
        ...watchlist,
        pagesAmount: Math.ceil(watchlist?.WatchlistItem?.length || 0 / input.pageSize),
      };
    }),

  createWatchlist: protectedProcedure
    .input(
      z.object({
        pageSize: z.number(),
        page: z.number(),
      })
    )
    .query(async ({ ctx }) => {
      const watchlist = ctx.prisma.watchlist.create({
        data: {
          user_id: ctx.session.user.profile.userId,
        },
      });

      return {
        ...watchlist,
      };
    }),

  addMovie: protectedProcedure
    .input(
      z.object({
        watchlist_id: z.string(),
        movie_id: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const watchlistItem = ctx.prisma.watchlistItem.create({
        data: {
          movie_id: input.movie_id,
          watchlist_id: input.watchlist_id,
        },
      });

      return {
        ...watchlistItem,
      };
    }),

  addSeries: protectedProcedure
    .input(
      z.object({
        watchlist_id: z.string(),
        series_id: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const watchlistItem = ctx.prisma.watchlistItem.create({
        data: {
          series_id: input.series_id,
          watchlist_id: input.watchlist_id,
        },
      });

      return {
        ...watchlistItem,
      };
    }),

  removeItem: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const watchlistItem = ctx.prisma.watchlistItem.delete({
        where: {
          id: input.id,
        },
      });

      return {
        ...watchlistItem,
      };
    }),
});
