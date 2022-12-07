import { z } from "zod";
import { protectedProcedure, router } from "../trpc";

export const followersRouter = router({
  createFollowers: protectedProcedure
    .input(
      z.object({
        follower: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.update({
        where: { id: ctx.session.user.profile.userId },
        data: { following: { connect: [{ id: input.follower }] } },
      });

      return {
        ...user,
      };
    }),

  removeFollowers: protectedProcedure
    .input(
      z.object({
        follower: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.update({
        where: { id: ctx.session.user.profile.userId },
        data: { following: { disconnect: [{ id: input.follower }] } },
      });

      return {
        ...user,
      };
    }),

  getFollowers: protectedProcedure.query(async ({ ctx }) => {
    const result = await ctx.prisma.user.findFirst({
      where: { id: ctx.session.user.profile.userId },
      include: { followers: true },
    });

    return result;
  }),
});
