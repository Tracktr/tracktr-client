import getDateXDaysAgo from "../../../utils/getDateXAgo";
import paginate from "../../../utils/paginate";
import { router, protectedProcedure } from "../trpc";

interface IStatItem {
  date: string;
  count: number;
}

export const dashboardRouter = router({
  stats: protectedProcedure.query(async ({ ctx }) => {
    const items: {
      date: string;
      count: number;
    }[] = [];
    let episodeCounter = 0;
    let movieCounter = 0;

    for (let i = 0; i < 14; i++) {
      const gte = new Date(getDateXDaysAgo(i).setHours(0, 0, 0, 0));
      const lt = new Date(getDateXDaysAgo(i - 1).setHours(0, 0, 0, 0));

      await ctx.prisma.episodesHistory
        .count({
          where: {
            user_id: ctx.session.user.profile.userId,
            datetime: {
              gte,
              lt,
            },
          },
        })
        .then((res) => {
          if (res > 0) episodeCounter += res;
          items.push({
            date: gte.toLocaleString("en-UK", {
              month: "short",
              day: "numeric",
            }),
            count: res,
          });
        });

      await ctx.prisma.moviesHistory
        .count({
          where: {
            user_id: ctx.session.user.profile.userId,
            datetime: {
              gte,
              lt,
            },
          },
        })
        .then((res) => {
          if (res > 0) movieCounter++;
          items.push({
            date: gte.toLocaleString("en-UK", {
              month: "short",
              day: "numeric",
            }),
            count: res,
          });
        });
    }

    const result: IStatItem[] = items.reduce((acc: any, { date, count }: any) => {
      acc[date] ??= { date: date, count: [] };
      acc[date].count = Number(acc[date].count) + Number(count);

      return acc;
    }, {});

    const sorted = Object.values(result).sort((a: IStatItem, b: IStatItem) => {
      if (new Date(a.date) > new Date(b.date)) {
        return 1;
      } else {
        return -1;
      }
    });

    return {
      history: sorted,
      episodeAmount: episodeCounter,
      movieAmount: movieCounter,
    };
  }),

  upNext: protectedProcedure.query(async ({ ctx }) => {
    const episodes = await ctx.prisma.episodesHistory.findMany({
      where: { user_id: ctx.session.user.profile.userId },
      include: {
        series: true,
        season: true,
        episode: true,
      },
      orderBy: {
        datetime: "desc",
      },
      distinct: ["series_id"],
    });

    const result = await Promise.all(
      episodes.flatMap(async (lastEpisode) => {
        const season = await ctx.prisma.seasons.findFirst({
          where: {
            series_id: lastEpisode.series_id,
            season_number: lastEpisode.season.season_number,
          },
          include: {
            episodes: true,
            Series: true,
          },
        });

        // Removes all episodes that don't have a next episode
        const nextEpisode = season?.episodes.filter((ep) => {
          if (
            ep.episode_number === lastEpisode.episode.episode_number + 1 &&
            ep.season_number === lastEpisode.season.season_number &&
            ep?.air_date !== null &&
            ep?.air_date <= new Date()
          ) {
            return true;
          } else {
            return false;
          }
        });

        if (nextEpisode !== undefined && nextEpisode?.length > 0) {
          return {
            ...nextEpisode[0],
            series: season?.Series,
          };
        } else {
          const nextSeason = await ctx.prisma.seasons.findFirst({
            where: {
              series_id: lastEpisode.series_id,
              season_number: lastEpisode?.season?.season_number && lastEpisode.season.season_number + 1,
            },
            include: {
              episodes: true,
              Series: true,
            },
          });

          const nextEpisode = nextSeason?.episodes.filter((ep) => {
            if (
              ep.episode_number === 1 &&
              ep.season_number === (lastEpisode?.season?.season_number && lastEpisode.season.season_number + 1) &&
              ep?.air_date !== null &&
              ep?.air_date <= new Date()
            ) {
              return true;
            } else {
              return false;
            }
          });

          if (nextEpisode !== undefined && nextEpisode?.length > 0) {
            return {
              ...nextEpisode[0],
              series: season?.Series,
            };
          }
        }
      })
    );

    return {
      result: paginate(
        result.filter((el) => {
          if (el !== undefined) {
            return true;
          }
        }),
        6,
        1
      ),
    };
  }),

  friendsActivity: protectedProcedure.query(async ({ ctx }) => {
    const activity = await ctx.prisma.user.findFirst({
      where: {
        id: ctx.session.user.id,
      },
      include: {
        following: {
          include: {
            EpisodesHistory: {
              take: 6,
              include: {
                series: true,
                season: true,
                episode: true,
              },
              orderBy: {
                datetime: "desc",
              },
            },
            MoviesHistory: {
              take: 6,
              include: {
                movie: true,
              },
              orderBy: {
                datetime: "desc",
              },
            },
          },
        },
      },
    });

    let recentHistory: any[] = [];

    activity?.following.map((friend) => {
      const sortedHistory = [...friend.MoviesHistory, ...friend.EpisodesHistory].sort((a, b) => {
        if (a.datetime < b.datetime) {
          return 1;
        } else {
          return -1;
        }
      });

      recentHistory = [
        ...recentHistory,
        ...sortedHistory.map((h) => ({
          ...h,
          friend: {
            image: friend.image,
            name: friend.name,
          },
        })),
      ];
    });

    return {
      history: recentHistory?.slice(0, 6),
    };
  }),
});
