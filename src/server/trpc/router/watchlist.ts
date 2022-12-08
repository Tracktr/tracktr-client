import { z } from "zod";
import createNewSeries from "../../../utils/createNewSeries";
import paginate from "../../../utils/paginate";
import { router, protectedProcedure } from "../trpc";

export const watchlistRouter = router({
  getUserWatchlist: protectedProcedure
    .input(
      z.object({
        pageSize: z.number(),
        page: z.number(),
        orderBy: z.object({
          field: z.string(),
          order: z.string(),
        }),
        filter: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const watchlist = await ctx.prisma.watchlist.findFirst({
        where: {
          user_id: ctx.session.user.id,
        },
        include: {
          WatchlistItem: {
            include: {
              series: {
                include: {
                  EpisodesHistory: {
                    where: { user_id: ctx.session.user.id },
                  },
                },
              },
              movies: {
                include: {
                  MoviesHistory: {
                    where: { user_id: ctx.session.user.id },
                  },
                },
              },
            },
          },
        },
      });

      if (watchlist?.WatchlistItem) {
        if (input.filter === "movies") {
          watchlist.WatchlistItem = watchlist.WatchlistItem.filter((e) => {
            if (e.series === null) {
              return true;
            }
          });
        }

        if (input.filter === "series") {
          watchlist.WatchlistItem = watchlist.WatchlistItem.filter((e) => {
            if (e.movies === null) {
              return true;
            }
          });
        }

        if (input.filter === "watched") {
          watchlist.WatchlistItem = watchlist.WatchlistItem.filter((e) => {
            if ((e?.movies?.MoviesHistory?.length || 0) < 1 && (e?.series?.EpisodesHistory?.length || 0) < 1) {
              return true;
            }
          });
        }

        if (input.filter === "notwatched") {
          watchlist.WatchlistItem = watchlist.WatchlistItem.filter((e) => {
            if ((e?.movies?.MoviesHistory?.length || 0) > 0 || (e?.series?.EpisodesHistory?.length || 0) > 0) {
              return true;
            }
          });
        }

        const watchlistLength = watchlist?.WatchlistItem?.length || 0;

        watchlist.WatchlistItem = [...watchlist.WatchlistItem].sort((a: any, b: any) => {
          if (input.orderBy.field === "title") {
            const aField = a[a.series ? "series" : "movies"][a.series ? "name" : "title"];
            const bField = b[b.series ? "series" : "movies"][b.series ? "name" : "title"];

            return aField.localeCompare(bField);
          }

          if (input.orderBy.field === "date") {
            // return null for series because getting the last released episode is a pain
            const aField = a.movies ? a.movies.release_date : null;
            const bField = b.movies ? b.movies.release_date : null;

            if (input.orderBy.order === "asc") {
              if (aField > bField) {
                return 1;
              } else {
                return -1;
              }
            } else if (input.orderBy.order === "desc") {
              if (aField < bField) {
                return 1;
              } else {
                return -1;
              }
            }
          }

          if (input.orderBy.order === "asc") {
            if (a[input.orderBy.field] > b[input.orderBy.field]) {
              return 1;
            } else {
              return -1;
            }
          } else if (input.orderBy.order === "desc") {
            if (a[input.orderBy.field] < b[input.orderBy.field]) {
              return 1;
            } else {
              return -1;
            }
          }
          return 0;
        });

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

        return {
          ...watchlist,
          pagesAmount: Math.ceil(watchlistLength / input.pageSize),
        };
      }
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
      const url = new URL(`tv/${input?.series_id}`, process.env.NEXT_PUBLIC_TMDB_API);
      url.searchParams.append("api_key", process.env.NEXT_PUBLIC_TMDB_KEY || "");
      if (ctx) url.searchParams.append("language", ctx.session?.user?.profile.language as string);

      const show = await fetch(url).then((res) => res.json());

      const seriesPoster = show.poster_path ? show.poster_path : "/noimage.png";

      const existsInDB = await ctx.prisma.series.findFirst({
        where: { id: input.series_id },
      });

      if (!existsInDB) {
        const newSeriesCreateUpdate = await createNewSeries({ show, seriesPoster, id: Number(input.series_id) });

        await ctx.prisma.series.upsert({
          where: { id: input.series_id },
          update: newSeriesCreateUpdate,
          create: newSeriesCreateUpdate,
        });
      }

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
