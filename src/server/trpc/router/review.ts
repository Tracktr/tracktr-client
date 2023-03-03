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
