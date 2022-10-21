import { router, publicProcedure } from "../trpc";

export const commonRouter = router({
  languages: publicProcedure.query(async ({ ctx }) => {
    const data = await ctx.prisma.languages.findMany();

    return {
      ...data,
    };
  }),
});
