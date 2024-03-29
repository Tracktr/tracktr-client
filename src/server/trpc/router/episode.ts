import { router, publicProcedure, protectedProcedure } from "../trpc";
import { z } from "zod";
import createNewSeries from "../../../utils/createNewSeries";
import { TRPCError } from "@trpc/server";
import { Episodes, EpisodesHistory, Profile, Seasons, Series, User } from "@prisma/client";

export const episodeRouter = router({
  episodeByID: publicProcedure
    .input(
      z.object({
        seriesID: z.number(),
        seasonNumber: z.number(),
        episodeNumber: z.number(),
      })
    )
    .query(async ({ ctx, input }) => {
      const url = new URL(
        `tv/${input?.seriesID}/season/${input.seasonNumber}/episode/${input?.episodeNumber}`,
        process.env.NEXT_PUBLIC_TMDB_API
      );
      url.searchParams.append("api_key", process.env.NEXT_PUBLIC_TMDB_KEY || "");
      url.searchParams.append("append_to_response", "credits");
      if (ctx) url.searchParams.append("language", ctx.session?.user?.profile.language as string);

      const episode = await fetch(url).then((res) => res.json());

      if (episode?.status_code) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: episode.status_message,
          cause: episode.status_code,
        });
      }

      return {
        ...episode,
      };
    }),

  markEpisodeAsWatched: protectedProcedure
    .input(
      z.object({
        seriesID: z.number(),
        episodeID: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const existsInDB = await ctx.prisma.episodes.findFirst({
        where: { id: input.episodeID },
        include: {
          Seasons: {
            select: {
              id: true,
            },
          },
        },
      });

      if (!existsInDB) {
        const url = new URL(`tv/${input.seriesID}`, process.env.NEXT_PUBLIC_TMDB_API);
        url.searchParams.append("api_key", process.env.NEXT_PUBLIC_TMDB_KEY || "");

        const show = await fetch(url).then((res) => res.json());

        if (show?.status_code) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: show.status_message,
            cause: show.status_code,
          });
        }

        const seriesPoster = show.poster_path ? show.poster_path : "/noimage.png";

        const newSeries = await createNewSeries({ show, seriesPoster, id: input.seriesID, ctx });

        if (newSeries !== null) {
          try {
            return await ctx.prisma.episodesHistory.create({
              data: {
                datetime: new Date(),
                user_id: ctx.session.user.id,
                series_id: input.seriesID,
                season_id: show.seasons[0].id,
                episode_id: input.episodeID,
              },
            });
          } catch (error) {
            console.error(error);
          }
        }
      } else {
        try {
          return await ctx.prisma.episodesHistory.create({
            data: {
              datetime: new Date(),
              user_id: ctx?.session?.user?.id,
              series_id: input.seriesID,
              season_id: Number(existsInDB.Seasons?.id),
              episode_id: input.episodeID,
            },
          });
        } catch (error) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Could not add to history",
            cause: error,
          });
        }
      }
    }),

  removeEpisodeFromWatched: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const result = await ctx.prisma.episodesHistory.deleteMany({
        where: {
          user_id: ctx.session.user.id,
          id: input.id,
        },
      });

      return {
        ...result,
      };
    }),

  watchHistoryByID: protectedProcedure
    .input(
      z.object({
        episodeID: z.number(),
        seriesID: z.number(),
      })
    )
    .query(async ({ ctx, input }) => {
      const result = await ctx.prisma.episodesHistory.findMany({
        where: {
          user_id: ctx.session.user.id,
          series_id: input.seriesID,
          episode_id: input.episodeID,
        },
        orderBy: {
          datetime: "asc",
        },
      });

      return {
        ...result,
      };
    }),

  seenBy: protectedProcedure
    .input(
      z.object({
        id: z.number(),
      })
    )
    .query(async ({ ctx, input }) => {
      const activity = await ctx.prisma.user.findFirst({
        where: {
          id: ctx.session.user.id,
        },
        include: {
          following: {
            include: {
              profile: true,
              EpisodesHistory: {
                where: {
                  episode_id: input.id,
                },
                include: {
                  series: true,
                  season: true,
                  episode: true,
                },
              },
            },
          },
        },
      });

      const response:
        | (User & {
            profile: Profile | null;
            EpisodesHistory: (EpisodesHistory & { series: Series; season: Seasons; episode: Episodes })[];
          })[]
        | undefined = [];
      activity?.following.map((user) => user.EpisodesHistory.length > 0 && response.push(user));

      return response;
    }),
});
