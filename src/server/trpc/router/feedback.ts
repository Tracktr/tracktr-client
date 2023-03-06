import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { router, publicProcedure, protectedProcedure } from "../trpc";

export const feedbackRouter = router({
  add: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        message: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.feedback.create({
        data: {
          email: input.email,
          message: input.message,
        },
      });
    }),
  get: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.session.user.profile.role === "ADMIN") {
      return await ctx.prisma.feedback.findMany({
        take: 10,
        orderBy: {
          created: "desc",
        },
      });
    } else {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message:
          "The client request has not been completed because it lacks valid authentication credentials for the requested resource.",
      });
    }
  }),
  delete: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.session.user.profile.role === "ADMIN") {
        return await ctx.prisma.feedback.delete({
          where: { id: input.id },
        });
      } else {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message:
            "The client request has not been completed because it lacks valid authentication credentials for the requested resource.",
        });
      }
    }),
});
