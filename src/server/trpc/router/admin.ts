import { TRPCError } from "@trpc/server";
import { zonedTimeToUtc } from "date-fns-tz";
import { z } from "zod";
import { router, protectedProcedure } from "../trpc";

export const adminRouter = router({
  stats: protectedProcedure
    .input(
      z.object({
        timeZone: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      if (ctx.session.user.profile.role === "admin") {
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

        return {
          userCount,
          newUsersCount,
          episodesWatched,
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
});
