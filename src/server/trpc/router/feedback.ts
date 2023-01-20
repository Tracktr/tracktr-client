import { z } from "zod";
import { router, publicProcedure } from "../trpc";

export const feedbackRouter = router({
  add: publicProcedure
    .input(
      z.object({
        email: z.string(),
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
});
