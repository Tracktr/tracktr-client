import { getFirstDayOfMonth, getLastDayOfMonth } from "../../../utils/getDate";
import { router, publicProcedure } from "../trpc";

export const calendarRouter = router({
  get: publicProcedure.query(async ({ ctx }) => {
    const today = new Date();

    const episodes = ctx.prisma.episodes.findMany({
      where: {
        air_date: {
          lte: getLastDayOfMonth(today.getFullYear(), today.getMonth()),
          gte: getFirstDayOfMonth(today.getFullYear(), today.getMonth()),
        },
      },
    });

    return {
      ...episodes,
    };
  }),
});
