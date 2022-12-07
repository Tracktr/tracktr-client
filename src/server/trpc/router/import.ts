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
            const existsInDB = await ctx.prisma.series.findFirst({
              where: { id: Number(item.id) },
            });

            if (!existsInDB) {
              const url = new URL(`tv/${item?.id}`, process.env.NEXT_PUBLIC_TMDB_API);
              url.searchParams.append("api_key", process.env.NEXT_PUBLIC_TMDB_KEY || "");
              if (ctx) url.searchParams.append("language", ctx.session?.user?.profile.language as string);

              const json = await fetch(url)
                .then((res: any) => res.json())
                .catch((e: any) => console.error("Failed fetching series from TMDB", e));

              if (json.id && json.name && json.poster_path) {
                try {
                  const seriesPoster = json.poster_path ? json.poster_path : "/noimage.png";

                  const newSeries = await createNewSeries({ show: json, seriesPoster, id: Number(item?.id) });

                  if (newSeries !== null) {
                    manyEpisodesHistory.push({
                      datetime: item.datetime,
                      user_id: ctx?.session?.user?.id as string,
                      series_id: Number(item.id),
                      season_number: Number(item.season),
                      episode_number: Number(item.episode),
                    });

                    continue;
                  }
                } catch (e) {
                  if (e instanceof Prisma.PrismaClientKnownRequestError) {
                    if (e.code === "P2002") {
                      manyEpisodesHistory.push({
                        datetime: item.datetime,
                        user_id: ctx?.session?.user?.id as string,
                        series_id: Number(item.id),
                        season_number: Number(item.season),
                        episode_number: Number(item.episode),
                      });

                      continue;
                    }
                  }
                }
              }
            } else {
              manyEpisodesHistory.push({
                datetime: item.datetime,
                user_id: ctx?.session?.user?.id as string,
                series_id: Number(item.id),
                season_number: Number(item.season),
                episode_number: Number(item.episode),
              });

              continue;
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
