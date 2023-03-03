import { router, protectedProcedure } from "../trpc";
import { z } from "zod";
import paginate from "../../../utils/paginate";

export const reviewRouter = router({
  getMovieReview: protectedProcedure
    .input(
      z.object({
        movieID: z.number(),
        pageSize: z.number(),
        page: z.number(),
      })
    )
    .query(async ({ ctx, input }) => {
      const reviews = await ctx.prisma.moviesReviews.findMany({
        where: {
          movie_id: input.movieID,
        },
        include: {
          Movies: true,
          user: {
            include: {
              profile: true,
            },
          },
        },
        orderBy: {
          created: "desc",
        },
      });

      return {
        reviews: paginate(reviews, input.pageSize, input.page),
        pagesAmount: Math.ceil(reviews.length / input.pageSize),
      };
    }),
  getSeriesReview: protectedProcedure
    .input(
      z.object({
        seriesID: z.number(),
        pageSize: z.number(),
        page: z.number(),
      })
    )
    .query(async ({ ctx, input }) => {
      const reviews = await ctx.prisma.seriesReviews.findMany({
        where: {
          series_id: input.seriesID,
        },
        include: {
          Series: true,
          user: {
            include: {
              profile: true,
            },
          },
        },
        orderBy: {
          created: "desc",
        },
      });

      return {
        reviews: paginate(reviews, input.pageSize, input.page),
        pagesAmount: Math.ceil(reviews.length / input.pageSize),
      };
    }),
  getSeasonReview: protectedProcedure
    .input(
      z.object({
        seasonID: z.number(),
        pageSize: z.number(),
        page: z.number(),
      })
    )
    .query(async ({ ctx, input }) => {
      const reviews = await ctx.prisma.seasonsReviews.findMany({
        where: {
          seasons_id: input.seasonID,
        },
        include: {
          Seasons: {
            include: {
              Series: true,
            },
          },
          user: {
            include: {
              profile: true,
            },
          },
        },
        orderBy: {
          created: "desc",
        },
      });

      return {
        reviews: paginate(reviews, input.pageSize, input.page),
        pagesAmount: Math.ceil(reviews.length / input.pageSize),
      };
    }),
  getEpisodeReview: protectedProcedure
    .input(
      z.object({
        episodeID: z.number(),
        pageSize: z.number(),
        page: z.number(),
      })
    )
    .query(async ({ ctx, input }) => {
      const reviews = await ctx.prisma.episodesReviews.findMany({
        where: {
          episodes_id: input.episodeID,
        },
        include: {
          Episodes: {
            include: {
              Seasons: {
                include: {
                  Series: true,
                },
              },
            },
          },
          user: {
            include: {
              profile: true,
            },
          },
        },
        orderBy: {
          created: "desc",
        },
      });

      return {
        reviews: paginate(reviews, input.pageSize, input.page),
        pagesAmount: Math.ceil(reviews.length / input.pageSize),
      };
    }),

  addMovieReview: protectedProcedure
    .input(
      z.object({
        movieID: z.number(),
        content: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const review = ctx.prisma.moviesReviews.create({
        data: {
          user_id: ctx.session.user.id,
          movie_id: input.movieID,
          content: input.content,
        },
      });

      return review;
    }),

  addSeriesReview: protectedProcedure
    .input(
      z.object({
        seriesID: z.number(),
        content: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const review = ctx.prisma.seriesReviews.create({
        data: {
          user_id: ctx.session.user.id,
          series_id: input.seriesID,
          content: input.content,
        },
      });

      return review;
    }),

  addSeasonReview: protectedProcedure
    .input(
      z.object({
        seasonID: z.number(),
        content: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const review = ctx.prisma.seasonsReviews.create({
        data: {
          user_id: ctx.session.user.id,
          seasons_id: input.seasonID,
          content: input.content,
        },
      });

      return review;
    }),

  addEpisodeReview: protectedProcedure
    .input(
      z.object({
        episodeID: z.number(),
        content: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const review = ctx.prisma.episodesReviews.create({
        data: {
          user_id: ctx.session.user.id,
          episodes_id: input.episodeID,
          content: input.content,
        },
      });

      return review;
    }),

  removeMovieReview: protectedProcedure
    .input(
      z.object({
        movieID: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const review = ctx.prisma.moviesReviews.delete({
        where: {
          user_id_movie_id: {
            movie_id: input.movieID,
            user_id: ctx.session.user.id,
          },
        },
      });

      return review;
    }),

  removeSeriesReview: protectedProcedure
    .input(
      z.object({
        seriesID: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const review = ctx.prisma.seriesReviews.delete({
        where: {
          user_id_series_id: {
            series_id: input.seriesID,
            user_id: ctx.session.user.id,
          },
        },
      });

      return review;
    }),
  removeSeasonReview: protectedProcedure
    .input(
      z.object({
        seasonID: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const review = ctx.prisma.seasonsReviews.delete({
        where: {
          user_id_seasons_id: {
            user_id: ctx.session.user.id,
            seasons_id: input.seasonID,
          },
        },
      });

      return review;
    }),
  removeEpisodeReview: protectedProcedure
    .input(
      z.object({
        episodeID: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const review = ctx.prisma.episodesReviews.delete({
        where: {
          user_id_episodes_id: {
            user_id: ctx.session.user.id,
            episodes_id: input.episodeID,
          },
        },
      });

      return review;
    }),

  updateMovieReview: protectedProcedure
    .input(
      z.object({
        movieID: z.number(),
        content: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const review = ctx.prisma.moviesReviews.update({
        where: {
          user_id_movie_id: {
            movie_id: input.movieID,
            user_id: ctx.session.user.id,
          },
        },
        data: {
          content: input.content,
          updated: new Date(),
          approved: false,
        },
      });

      return review;
    }),

  updateSeriesReview: protectedProcedure
    .input(
      z.object({
        seriesID: z.number(),
        content: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const review = ctx.prisma.seriesReviews.update({
        where: {
          user_id_series_id: {
            series_id: input.seriesID,
            user_id: ctx.session.user.id,
          },
        },
        data: {
          content: input.content,
          updated: new Date(),
          approved: false,
        },
      });

      return review;
    }),

  updateSeasonsReview: protectedProcedure
    .input(
      z.object({
        seasonID: z.number(),
        content: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const review = ctx.prisma.seasonsReviews.update({
        where: {
          user_id_seasons_id: {
            seasons_id: input.seasonID,
            user_id: ctx.session.user.id,
          },
        },
        data: {
          content: input.content,
          updated: new Date(),
          approved: false,
        },
      });

      return review;
    }),

  updateEpisodeReview: protectedProcedure
    .input(
      z.object({
        episodeID: z.number(),
        content: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const review = ctx.prisma.episodesReviews.update({
        where: {
          user_id_episodes_id: {
            episodes_id: input.episodeID,
            user_id: ctx.session.user.id,
          },
        },
        data: {
          content: input.content,
          updated: new Date(),
          approved: false,
        },
      });

      return review;
    }),
});
