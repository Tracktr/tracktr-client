import { z } from "zod";
import { router, protectedProcedure } from "../trpc";

export const calendarRouter = router({
  get: protectedProcedure
    .input(
      z.object({
        start: z.date(),
        end: z.date(),
      })
    )
    .query(async ({ ctx, input }) => {
      const series = await ctx.prisma.episodesHistory.findMany({
        include: {
          series: true,
          episode: true,
        },
        where: { user_id: ctx.session.user.id },
        distinct: ["series_id"],
      });

      const events = await Promise.all(
        series.map(async (ep) => {
          // get all episodes of series in this month
          const episodesThisMonth = await ctx.prisma.episodes.findMany({
            where: {
              Seasons: {
                series_id: ep.series_id,
              },
              air_date: {
                lte: input.end,
                gte: input.start,
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
