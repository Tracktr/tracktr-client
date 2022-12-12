import { getFirstDayOfMonth, getLastDayOfMonth } from "../../../utils/getDate";
import { router, publicProcedure } from "../trpc";

export const calendarRouter = router({
  get: publicProcedure.query(async ({ ctx }) => {
    const today = new Date();

    const series = await ctx.prisma.episodesHistory.findMany({
      include: {
        series: true,
        episode: true,
      },
      distinct: ["series_id"],
    });

    const firstDayOfMonth = getFirstDayOfMonth(today.getFullYear(), today.getMonth());
    const lastDayOfMonth = getLastDayOfMonth(today.getFullYear(), today.getMonth());

    const events = await Promise.all(
      series.map(async (ep) => {
        // get all episodes of series in this month
        const episodesThisMonth = await ctx.prisma.episodes.findMany({
          where: {
            Seasons: {
              series_id: ep.series_id,
            },
            air_date: {
              lte: lastDayOfMonth,
              gte: firstDayOfMonth,
            },
          },
          include: {
            Seasons: {
              include: {
                Series: true,
              },
            },
          },
        });

        const formatted = await Promise.all(
          episodesThisMonth.map((episode) => {
            return {
              title: `${episode.Seasons?.Series?.name} ${episode.season_number}x${episode.episode_number}`,
              start: episode.air_date,
              end: episode.air_date,
            };
          })
        );

        return formatted;
      })
    );

    return {
      events: events.flat(1),
    };
  }),
});
