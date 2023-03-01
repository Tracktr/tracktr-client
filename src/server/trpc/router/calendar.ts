import { getFirstDayOfMonth, getLastDayOfMonth } from "../../../utils/getDate";
import { router, protectedProcedure } from "../trpc";

export const calendarRouter = router({
  get: protectedProcedure.query(async ({ ctx }) => {
    const today = new Date();

    const series = await ctx.prisma.episodesHistory.findMany({
      include: {
        series: true,
        episode: true,
      },
      where: { user_id: ctx.session.user.id },
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
              start: episode.air_date as Date,
              end: episode.air_date as Date,
              url: `/tv/${episode.Seasons?.series_id}/season/${episode.season_number}/episode/${episode.episode_number}`,
              color: "#FAC42C",
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
