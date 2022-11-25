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

      if (watchlist?.WatchlistItem)
        watchlist.WatchlistItem = paginate(watchlist?.WatchlistItem, input.pageSize, input.page);

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
    .query(async ({ ctx, input }) => {
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
});
