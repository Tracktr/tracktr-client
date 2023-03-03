import { router, protectedProcedure } from "../trpc";
import { z } from "zod";
import paginate from "../../../utils/paginate";

export const reviewRouter = router({
  getReview: protectedProcedure
    .input(
      z.object({
        movieID: z.number().optional(),
        seriesID: z.number().optional(),
        seasonID: z.number().optional(),
        episodeID: z.number().optional(),
        pageSize: z.number(),
        page: z.number(),
      })
    )
    .query(async ({ ctx, input }) => {
      let reviews;

      if (input.movieID) {
        reviews = await ctx.prisma.moviesReviews.findMany({
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
      } else if (input.seriesID) {
        reviews = await ctx.prisma.seriesReviews.findMany({
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
      } else if (input.seasonID) {
        reviews = await ctx.prisma.seasonsReviews.findMany({
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
      } else if (input.episodeID) {
        reviews = await ctx.prisma.episodesReviews.findMany({
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
      }

      if (reviews) {
        return {
          reviews: paginate(reviews, input.pageSize, input.page),
          pagesAmount: Math.ceil(reviews.length / input.pageSize),
        };
      }
    }),

  addReview: protectedProcedure
    .input(
      z.object({
        movieID: z.number().optional(),
        seriesID: z.number().optional(),
        seasonID: z.number().optional(),
        episodeID: z.number().optional(),
        content: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (input.movieID) {
        return await ctx.prisma.moviesReviews.create({
          data: {
            user_id: ctx.session.user.id,
            movie_id: input.movieID,
            content: input.content,
          },
        });
      } else if (input.seriesID) {
        return await ctx.prisma.seriesReviews.create({
          data: {
            user_id: ctx.session.user.id,
            series_id: input.seriesID,
            content: input.content,
          },
        });
      } else if (input.seasonID) {
        return await ctx.prisma.seasonsReviews.create({
          data: {
            user_id: ctx.session.user.id,
            seasons_id: input.seasonID,
            content: input.content,
          },
        });
      } else if (input.episodeID) {
        return await ctx.prisma.episodesReviews.create({
          data: {
            user_id: ctx.session.user.id,
            episodes_id: input.episodeID,
            content: input.content,
          },
        });
      }
    }),

  removeReview: protectedProcedure
    .input(
      z.object({
        movieID: z.number().optional(),
        seriesID: z.number().optional(),
        seasonID: z.number().optional(),
        episodeID: z.number().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (input.movieID) {
        return await ctx.prisma.moviesReviews.delete({
          where: {
            user_id_movie_id: {
              movie_id: input.movieID,
              user_id: ctx.session.user.id,
            },
          },
        });
      } else if (input.seriesID) {
        return await ctx.prisma.seriesReviews.delete({
          where: {
            user_id_series_id: {
              series_id: input.seriesID,
              user_id: ctx.session.user.id,
            },
          },
        });
      } else if (input.seasonID) {
        return await ctx.prisma.seasonsReviews.delete({
          where: {
            user_id_seasons_id: {
              user_id: ctx.session.user.id,
              seasons_id: input.seasonID,
            },
          },
        });
      } else if (input.episodeID) {
        return await ctx.prisma.episodesReviews.delete({
          where: {
            user_id_episodes_id: {
              user_id: ctx.session.user.id,
              episodes_id: input.episodeID,
            },
          },
        });
      }
    }),

  updateReview: protectedProcedure
    .input(
      z.object({
        movieID: z.number().optional(),
        seriesID: z.number().optional(),
        seasonID: z.number().optional(),
        episodeID: z.number().optional(),
        content: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (input.movieID) {
        return await ctx.prisma.moviesReviews.update({
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
      } else if (input.seriesID) {
        return await ctx.prisma.seriesReviews.update({
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
      } else if (input.seasonID) {
        return await ctx.prisma.seasonsReviews.update({
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
      } else if (input.episodeID) {
        return await ctx.prisma.episodesReviews.update({
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
      }
    }),
});
