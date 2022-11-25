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

  checkItemInWatchlist: protectedProcedure
    .input(
      z.object({
        itemID: z.number(),
      })
    )
    .query(async ({ ctx, input }) => {
      const watchlist = await ctx.prisma.watchlist.findFirst({
        where: {
          user_id: ctx.session.user.profile.userId,
          WatchlistItem: {
            some: {
              OR: [{ movie_id: input.itemID }, { series_id: input.itemID }],
            },
          },
        },
        include: {
          WatchlistItem: true,
        },
      });

      return {
        inWatchlist: Boolean(watchlist),
        id: watchlist?.WatchlistItem[0]?.id,
      };
    }),

  addItem: protectedProcedure
    .input(
      z.object({
        movie_id: z.number().optional(),
        series_id: z.number().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const watchlist = ctx.prisma.watchlist.upsert({
        where: {
          user_id: ctx.session.user.profile.userId,
        },
        update: {
          user_id: ctx.session.user.profile.userId,
          WatchlistItem: {
            create: {
              movie_id: input.movie_id,
              series_id: input.series_id,
            },
          },
        },
        create: {
          user_id: ctx.session.user.profile.userId,
          WatchlistItem: {
            create: {
              movie_id: input.movie_id,
              series_id: input.series_id,
            },
          },
        },
      });

      return {
        ...watchlist,
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
