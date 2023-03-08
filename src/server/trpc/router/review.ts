import { router, protectedProcedure, publicProcedure } from "../trpc";
import { z } from "zod";
import paginate from "../../../utils/paginate";
import { TRPCError } from "@trpc/server";

export const reviewRouter = router({
  getReviews: publicProcedure
    .input(
      z.object({
        movieID: z.number().optional(),
        seriesID: z.number().optional(),
        seasonID: z.number().optional(),
        episodeID: z.number().optional(),
        pageSize: z.number(),
        page: z.number(),
        linkedReview: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      let reviews;
      let linkedReview;

      if (input.movieID) {
        if (input.linkedReview) {
          linkedReview = await ctx.prisma.moviesReviews.findFirst({
            where: {
              id: input.linkedReview,
            },
            include: {
              Movies: true,
              user: {
                include: {
                  profile: true,
                },
              },
              MoviesReviewsLikes: {
                where: {
                  likedBy: {
                    id: ctx.session ? ctx?.session?.user?.id : undefined,
                  },
                },
              },
              _count: {
                select: {
                  MoviesReviewsLikes: true,
                },
              },
            },
          });
        }

        reviews = await ctx.prisma.moviesReviews.findMany({
          where: {
            movie_id: input.movieID,
            NOT: [
              {
                id: input.linkedReview,
              },
            ],
          },
          include: {
            Movies: true,
            user: {
              include: {
                profile: true,
              },
            },
            MoviesReviewsLikes: {
              where: {
                likedBy: {
                  id: ctx.session ? ctx?.session?.user?.id : undefined,
                },
              },
            },
            _count: {
              select: {
                MoviesReviewsLikes: true,
              },
            },
          },
          orderBy: {
            created: "desc",
          },
        });
      } else if (input.seriesID) {
        if (input.linkedReview) {
          linkedReview = await ctx.prisma.seriesReviews.findFirst({
            where: {
              id: input.linkedReview,
            },
            include: {
              Series: true,
              user: {
                include: {
                  profile: true,
                },
              },
              SeriesReviewsLikes: {
                where: {
                  likedBy: {
                    id: ctx.session ? ctx?.session?.user?.id : undefined,
                  },
                },
              },
              _count: {
                select: {
                  SeriesReviewsLikes: true,
                },
              },
            },
          });
        }

        reviews = await ctx.prisma.seriesReviews.findMany({
          where: {
            series_id: input.seriesID,
            NOT: [
              {
                id: input.linkedReview,
              },
            ],
          },
          include: {
            Series: true,
            user: {
              include: {
                profile: true,
              },
            },
            SeriesReviewsLikes: {
              where: {
                likedBy: {
                  id: ctx.session ? ctx?.session?.user?.id : undefined,
                },
              },
            },
            _count: {
              select: {
                SeriesReviewsLikes: true,
              },
            },
          },
          orderBy: {
            created: "desc",
          },
        });
      } else if (input.seasonID) {
        if (input.linkedReview) {
          linkedReview = await ctx.prisma.seasonsReviews.findFirst({
            where: {
              id: input.linkedReview,
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
              SeasonsReviewsLikes: {
                where: {
                  likedBy: {
                    id: ctx.session ? ctx?.session?.user?.id : undefined,
                  },
                },
              },
              _count: {
                select: {
                  SeasonsReviewsLikes: true,
                },
              },
            },
          });

          console.log(linkedReview);
        }

        reviews = await ctx.prisma.seasonsReviews.findMany({
          where: {
            seasons_id: input.seasonID,
            NOT: [
              {
                id: input.linkedReview,
              },
            ],
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
            SeasonsReviewsLikes: {
              where: {
                likedBy: {
                  id: ctx.session ? ctx?.session?.user?.id : undefined,
                },
              },
            },
            _count: {
              select: {
                SeasonsReviewsLikes: true,
              },
            },
          },
          orderBy: {
            created: "desc",
          },
        });
      } else if (input.episodeID) {
        if (input.linkedReview) {
          linkedReview = await ctx.prisma.episodesReviews.findFirst({
            where: {
              id: input.linkedReview,
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
              EpisodesReviewsLikes: {
                where: {
                  likedBy: {
                    id: ctx.session ? ctx?.session?.user?.id : undefined,
                  },
                },
              },
              _count: {
                select: {
                  EpisodesReviewsLikes: true,
                },
              },
            },
          });
        }

        reviews = await ctx.prisma.episodesReviews.findMany({
          where: {
            episodes_id: input.episodeID,
            NOT: [
              {
                id: input.linkedReview,
              },
            ],
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
            EpisodesReviewsLikes: {
              where: {
                likedBy: {
                  id: ctx.session ? ctx?.session?.user?.id : undefined,
                },
              },
            },
            _count: {
              select: {
                EpisodesReviewsLikes: true,
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
          linkedReview,
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

  addLikeReview: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        type: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      switch (input.type) {
        case "movie":
          return await ctx.prisma.moviesReviewsLikes.create({
            data: {
              likedBy: {
                connect: {
                  id: ctx.session.user.id,
                },
              },
              review: {
                connect: {
                  id: input.id,
                },
              },
            },
          });
        case "series":
          return await ctx.prisma.seriesReviewsLikes.create({
            data: {
              likedBy: {
                connect: {
                  id: ctx.session.user.id,
                },
              },
              review: {
                connect: {
                  id: input.id,
                },
              },
            },
          });

        case "season":
          return await ctx.prisma.seasonsReviewsLikes.create({
            data: {
              likedBy: {
                connect: {
                  id: ctx.session.user.id,
                },
              },
              review: {
                connect: {
                  id: input.id,
                },
              },
            },
          });

        case "episode":
          return await ctx.prisma.episodesReviewsLikes.create({
            data: {
              likedBy: {
                connect: {
                  id: ctx.session.user.id,
                },
              },
              review: {
                connect: {
                  id: input.id,
                },
              },
            },
          });

        default:
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Incorrect type, please try with a valid type",
          });
          break;
      }
    }),

  deleteLikeReview: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        type: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      switch (input.type) {
        case "movie":
          return await ctx.prisma.moviesReviewsLikes.deleteMany({
            where: {
              moviesReviewsId: input.id,
              likedBy: {
                id: ctx.session.user.id,
              },
            },
          });
        case "series":
          return await ctx.prisma.seriesReviewsLikes.deleteMany({
            where: {
              seriesReviewsId: input.id,
              likedBy: {
                id: ctx.session.user.id,
              },
            },
          });

        case "season":
          return await ctx.prisma.seasonsReviewsLikes.deleteMany({
            where: {
              seasonsReviewsId: input.id,
              likedBy: {
                id: ctx.session.user.id,
              },
            },
          });

        case "episode":
          return await ctx.prisma.episodesReviewsLikes.deleteMany({
            where: {
              episodesReviewsId: input.id,
              likedBy: {
                id: ctx.session.user.id,
              },
            },
          });

        default:
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Incorrect type, please try with a valid type",
          });
          break;
      }
    }),
});
