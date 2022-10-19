import { router, publicProcedure } from "../trpc";

export const commonRouter = router({
  languages: publicProcedure.query(async () => {
    const data = await prisma?.languages.findMany();

    return {
      ...data,
    };
  }),
});
