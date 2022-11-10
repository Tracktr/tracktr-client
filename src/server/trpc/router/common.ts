import { router, publicProcedure } from "../trpc";

export const commonRouter = router({
  languages: publicProcedure.query(async ({ ctx }) => {
    const data = await ctx.prisma.languages.findMany();

    return {
      ...data,
    };
  }),
  watchProviders: publicProcedure.query(async ({ ctx }) => {
    const url = new URL(`watch/providers/regions`, process.env.NEXT_PUBLIC_TMDB_API);
    url.searchParams.append("api_key", process.env.NEXT_PUBLIC_TMDB_KEY || "");

    const res = await fetch(url);
    const json = await res.json();

    return {
      ...json,
    };
  }),
});
