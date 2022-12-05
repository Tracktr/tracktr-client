import { router, protectedProcedure } from "../trpc";
import { z } from "zod";

export const reviewRouter = router({
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

  removeMoviesReview: protectedProcedure
    .input(
      z.object({
        moviesID: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const review = ctx.prisma.moviesReviews.delete({
        where: {
          user_id_movie_id: {
            movie_id: input.moviesID,
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
});
