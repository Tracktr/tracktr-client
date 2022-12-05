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
});
