import { Prisma } from "@prisma/client";
import { z } from "zod";
import createNewSeries from "../../../utils/createNewSeries";
import { router, protectedProcedure } from "../trpc";

export const importRouter = router({
  trakt: protectedProcedure
    .input(
      z.array(
        z.object({
          id: z.string(),
          type: z.string(),
          season: z.string().optional(),
          episode: z.string().optional(),
          datetime: z.string(),
        })
      )
    )
    .mutation(async ({ ctx, input }) => {
      const manyMoviesHistory: any[] = [];
      const manyEpisodesHistory: any[] = [];

      let i = 0;

      for (i = 0; i < input.length; i++) {
        const item = input[i];

        if (item !== undefined) {
          if (item.type === "movie") {
            const existsInDB = await ctx.prisma.movies.findFirst({
              where: { id: Number(item.id) },
            });

            if (!existsInDB) {
              const movie = new URL(`movie/${item.id}`, process.env.NEXT_PUBLIC_TMDB_API);
              movie.searchParams.append("api_key", process.env.NEXT_PUBLIC_TMDB_KEY || "");

              const json = await fetch(movie)
                .then((res: any) => res.json())
                .catch((e: any) => console.error("Failed fetching movie from TMDB", e));

              if (json.id && json.title && json.poster_path) {
                const newMovie = await ctx.prisma.movies.create({
                  data: {
                    id: json.id,
                    title: json.title,
                    poster: json.poster_path,
                  },
                });

                if (newMovie !== null) {
                  manyMoviesHistory.push({
                    datetime: item.datetime,
                    movie_id: Number(item.id),
                    user_id: ctx?.session?.user?.id as string,
                  });

                  continue;
                }
              }
            } else {
              manyMoviesHistory.push({
                datetime: item.datetime,
                movie_id: Number(item.id),
                user_id: ctx?.session?.user?.id as string,
              });

              continue;
            }
          } else if (item.type === "episode") {
            const url = new URL(`tv/${item?.id}`, process.env.NEXT_PUBLIC_TMDB_API);
            url.searchParams.append("api_key", process.env.NEXT_PUBLIC_TMDB_KEY || "");
            url.searchParams.append("append_to_response", `season/${item.season}`);

            const show = await fetch(url)
              .then((res: any) => res.json())
              .catch((e: any) => console.error("Failed fetching series from TMDB", e));

            const existsInDB = await ctx.prisma.series.findFirst({
              where: { id: Number(item.id) },
            });

            // Getting current season from show cuz append to response does not have season id
            const currentSeason = show.seasons.filter((season: any) => season.season_number == item.season)[0];
            const currentEpisode = show[`season/${item.season}`].episodes.filter(
              (episode: any) => episode.episode_number == item.episode
            )[0];

            if (!existsInDB) {
              try {
                const seriesPoster = show.poster_path ? show.poster_path : "/noimage.png";

                const newSeriesCreateUpdate = await createNewSeries({
                  show: show,
                  seriesPoster,
                  id: Number(item?.id),
                });

                const newSeries = await ctx.prisma.series.upsert({
                  where: { id: Number(item.id) },
                  update: newSeriesCreateUpdate,
                  create: newSeriesCreateUpdate,
                });

                if (newSeries !== null) {
                  manyEpisodesHistory.push({
                    datetime: item.datetime,
                    user_id: ctx?.session?.user?.id as string,
                    series_id: Number(item.id),
                    season_id: currentSeason.id,
                    episode_id: currentEpisode.id,
                  });

                  continue;
                }
              } catch (e) {
                console.error("Create new series", e);
                if (e instanceof Prisma.PrismaClientKnownRequestError) {
                  if (e.code === "P2002") {
                    manyEpisodesHistory.push({
                      datetime: item.datetime,
                      user_id: ctx?.session?.user?.id as string,
                      series_id: Number(item.id),
                      season_id: currentSeason.id,
                      episode_id: currentEpisode.id,
                    });

                    continue;
                  }
                }
              }
            } else {
              console.log("In database");
              console.log(currentSeason.id, currentEpisode.id);

              try {
                manyEpisodesHistory.push({
                  datetime: item.datetime,
                  user_id: ctx?.session?.user?.id as string,
                  series_id: Number(item.id),
                  season_id: currentSeason.id,
                  episode_id: currentEpisode.id,
                });

                continue;
              } catch (error) {
                console.error(error);
              }
            }
          }
        } else {
          continue;
        }
      }

      if (i === input.length) {
        const createManyMoviesHistory = await ctx.prisma.moviesHistory.createMany({
          data: manyMoviesHistory,
          skipDuplicates: true,
        });

        const createManyEpisodesHistory = await ctx.prisma.episodesHistory.createMany({
          data: manyEpisodesHistory,
          skipDuplicates: true,
        });

        return {
          ...createManyEpisodesHistory,
          ...createManyMoviesHistory,
        };
      }
    }),
});
