import { TRPCError } from "@trpc/server";
import { zonedTimeToUtc } from "date-fns-tz";
import { z } from "zod";
import { router, protectedProcedure } from "../trpc";

export const adminRouter = router({
  stats: protectedProcedure
    .input(
      z.object({
        timeZone: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      if (ctx.session.user.profile.role === "ADMIN") {
        const gte = zonedTimeToUtc(new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000), input.timeZone);

        const userCount = await ctx.prisma.user.count();
        const newUsersCount = await ctx.prisma.user.count({
          where: {
            profile: {
              signUpDate: {
                gte,
              },
            },
          },
        });

        const episodesWatched = await ctx.prisma.episodesHistory.count({
          where: {
            datetime: {
              gte,
            },
          },
        });
        const moviesWatched = await ctx.prisma.moviesHistory.count({
          where: {
            datetime: {
              gte,
            },
          },
        });

        const uniqueEpisodeViewers = await ctx.prisma.episodesHistory.findMany({
          where: {
            datetime: {
              gte,
            },
          },
          select: {
            id: true,
          },
          distinct: ["user_id"],
        });
        const uniqueMovieViewers = await ctx.prisma.moviesHistory.findMany({
          where: {
            datetime: {
              gte,
            },
          },
          select: {
            id: true,
          },
          distinct: ["user_id"],
        });

        const movieReviews = await ctx.prisma.moviesReviews.count({
          where: {
            created: {
              gte,
            },
          },
        });

        const seriesReviews = await ctx.prisma.seriesReviews.count({
          where: {
            created: {
              gte,
            },
          },
        });

        const seasonReviews = await ctx.prisma.seasonsReviews.count({
          where: {
            created: {
              gte,
            },
          },
        });

        const episodesReviews = await ctx.prisma.episodesReviews.count({
          where: {
            created: {
              gte,
            },
          },
        });

        return {
          userCount,
          newUsersCount,
          reviewCount: movieReviews || 0 + seriesReviews || 0 + seasonReviews || 0 + episodesReviews || 0,
          episodesWatched,
          uniqueEpisodeViewers: uniqueEpisodeViewers.length,
          uniqueMovieViewers: uniqueMovieViewers.length,
          moviesWatched,
        };
      } else {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message:
            "The client request has not been completed because it lacks valid authentication credentials for the requested resource.",
        });
      }
    }),
  getReviews: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.session.user.profile.role === "ADMIN") {
      const moviesReviews = await ctx.prisma.moviesReviews.findMany({
        where: {
          approved: false,
        },
        take: 3,
        orderBy: {
          created: "desc",
        },
        include: {
          Movies: true,
          user: {
            include: {
              profile: {
                select: {
                  username: true,
                },
              },
            },
          },
        },
      });
      const seriesReviews = await ctx.prisma.seriesReviews.findMany({
        where: {
          approved: false,
        },
        take: 3,
        orderBy: {
          created: "desc",
        },
        include: {
          Series: true,
          user: {
            include: {
              profile: {
                select: {
                  username: true,
                },
              },
            },
          },
        },
      });
      const seasonsReviews = await ctx.prisma.seasonsReviews.findMany({
        where: {
          approved: false,
        },
        take: 3,
        orderBy: {
          created: "desc",
        },
        include: {
          Seasons: {
            include: {
              Series: true,
            },
          },
          user: {
            include: {
              profile: {
                select: {
                  username: true,
                },
              },
            },
          },
        },
      });
      const episodesReviews = await ctx.prisma.episodesReviews.findMany({
        where: {
          approved: false,
        },
        take: 3,
        orderBy: {
          created: "desc",
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
              profile: {
                select: {
                  username: true,
                },
              },
            },
          },
        },
      });

      return [
        ...moviesReviews.map((review) => {
          return {
            type: "movie",
            id: review.id,
            title: review.Movies.title,
            content: review.content,
            created: review.created,
            user: {
              username: review.user.profile?.username,
              image: review.user.image,
            },
            item: {
              id: review.Movies.id,
              title: review.Movies.title,
              poster: review.Movies.poster,
            },
          };
        }),
        ...seriesReviews.map((review) => {
          return {
            type: "series",
            id: review.id,
            title: review.Series.name,
            content: review.content,
            created: review.created,
            user: {
              username: review.user.profile?.username,
              image: review.user.image,
            },
            item: {
              id: review.Series.id,
              name: review.Series.name,
              poster: review.Series.poster,
            },
          };
        }),
        ...seasonsReviews.map((review) => {
          return {
            type: "season",
            id: review.id,
            title: review.Seasons.Series?.name,
            content: review.content,
            created: review.created,
            user: {
              username: review.user.profile?.username,
              image: review.user.image,
            },
            item: {
              id: review.Seasons.id,
              name: review.Seasons.Series?.name,
              poster: review.Seasons.poster,
            },
          };
        }),
        ...episodesReviews.map((review) => {
          return {
            type: "episodes",
            id: review.id,
            title: review.Episodes.Seasons?.Series?.name,
            content: review.content,
            created: review.created,
            user: {
              username: review.user.profile?.username,
              image: review.user.image,
            },
            item: {
              id: review.Episodes.id,
              name: review.Episodes.Seasons?.Series?.name,
              poster: review.Episodes.Seasons?.poster,
            },
          };
        }),
      ];
    } else {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message:
          "The client request has not been completed because it lacks valid authentication credentials for the requested resource.",
      });
    }
  }),

  removeMovieReview: protectedProcedure
    .input(
      z.object({
        reviewID: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.session.user.profile.role === "ADMIN") {
        const review = ctx.prisma.moviesReviews.delete({
          where: {
            id: input.reviewID,
          },
        });

        return review;
      } else {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message:
            "The client request has not been completed because it lacks valid authentication credentials for the requested resource.",
        });
      }
    }),

  removeSeriesReview: protectedProcedure
    .input(
      z.object({
        reviewID: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.session.user.profile.role === "ADMIN") {
        const review = ctx.prisma.seriesReviews.delete({
          where: {
            id: input.reviewID,
          },
        });

        return review;
      } else {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message:
            "The client request has not been completed because it lacks valid authentication credentials for the requested resource.",
        });
      }
    }),

  removeSeasonsReview: protectedProcedure
    .input(
      z.object({
        reviewID: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.session.user.profile.role === "ADMIN") {
        const review = ctx.prisma.seasonsReviews.delete({
          where: {
            id: input.reviewID,
          },
        });

        return review;
      } else {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message:
            "The client request has not been completed because it lacks valid authentication credentials for the requested resource.",
        });
      }
    }),

  removeEpisodesReview: protectedProcedure
    .input(
      z.object({
        reviewID: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.session.user.profile.role === "ADMIN") {
        const review = ctx.prisma.episodesReviews.delete({
          where: {
            id: input.reviewID,
          },
        });

        return review;
      } else {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message:
            "The client request has not been completed because it lacks valid authentication credentials for the requested resource.",
        });
      }
    }),

  approveMoviesReview: protectedProcedure
    .input(
      z.object({
        reviewID: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.session.user.profile.role === "ADMIN") {
        const review = ctx.prisma.moviesReviews.update({
          where: {
            id: input.reviewID,
          },
          data: {
            approved: true,
          },
        });

        return review;
      } else {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message:
            "The client request has not been completed because it lacks valid authentication credentials for the requested resource.",
        });
      }
    }),

  approveSeriesReview: protectedProcedure
    .input(
      z.object({
        reviewID: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.session.user.profile.role === "ADMIN") {
        const review = ctx.prisma.seriesReviews.update({
          where: {
            id: input.reviewID,
          },
          data: {
            approved: true,
          },
        });

        return review;
      } else {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message:
            "The client request has not been completed because it lacks valid authentication credentials for the requested resource.",
        });
      }
    }),

  approveSeasonsReview: protectedProcedure
    .input(
      z.object({
        reviewID: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.session.user.profile.role === "ADMIN") {
        const review = ctx.prisma.seasonsReviews.update({
          where: {
            id: input.reviewID,
          },
          data: {
            approved: true,
          },
        });

        return review;
      } else {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message:
            "The client request has not been completed because it lacks valid authentication credentials for the requested resource.",
        });
      }
    }),

  approveEpisodesReview: protectedProcedure
    .input(
      z.object({
        reviewID: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.session.user.profile.role === "ADMIN") {
        const review = ctx.prisma.episodesReviews.update({
          where: {
            id: input.reviewID,
          },
          data: {
            approved: true,
          },
        });

        return review;
      } else {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message:
            "The client request has not been completed because it lacks valid authentication credentials for the requested resource.",
        });
      }
    }),
});
