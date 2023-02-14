import { TmdbEpisode } from "../types/tmdb";

const createNewSeries = async ({
  show,
  seriesPoster,
  id,
  ctx,
}: {
  show: any;
  seriesPoster: string;
  id: number;
  ctx: any;
}) => {
  try {
    const s = {
      id: show.id,
      name: show.name,
      poster: seriesPoster,
    };
    const series = await ctx.prisma.series.upsert({
      where: { id: show.id },
      update: s,
      create: s,
    });

    const episodesInfo: any = [];

    const seasons = await Promise.all(
      show.seasons.map(
        async (season: {
          air_date: string;
          episode_count: number;
          id: number;
          name: string;
          overview: string;
          poster_path: string;
          season_number: number;
        }) => {
          const url = new URL(`tv/${id}/season/${season.season_number}`, process.env.NEXT_PUBLIC_TMDB_API);
          url.searchParams.append("api_key", process.env.NEXT_PUBLIC_TMDB_KEY || "");

          const seasonWithEpisodes = await fetch(url).then((res) => res.json());

          if (seasonWithEpisodes?.status_code) {
            console.error("Failed to fetch season with episode", id, season);
          }

          episodesInfo.push(
            ...seasonWithEpisodes.episodes.map((episode: TmdbEpisode) => {
              return { ...episode, season_id: season.id };
            })
          );

          const s = {
            id: season.id,
            name: season.name,
            poster: season.poster_path ? season.poster_path : seriesPoster,
            season_number: season.season_number,
          };

          try {
            return await ctx.prisma.seasons.upsert({
              where: { id: season.id },
              update: s,
              create: s,
            });
          } catch {
            console.error("Failed to upsert season", season.id, season.name);
          }
        }
      )
    );

    const episodes = await Promise.all(
      episodesInfo.map(async (episode: TmdbEpisode & { season_id: number }) => {
        const e = {
          id: episode.id,
          name: episode.name,
          episode_number: episode.episode_number,
          season_number: episode.season_number,
          seasons_id: episode.season_id,
          air_date: episode.air_date ? new Date(episode.air_date) : null,
        };

        try {
          return await ctx.prisma.episodes.upsert({
            where: { id: episode.id },
            update: e,
            create: e,
          });
        } catch {
          console.error("Failed to upsert episode ", episode.id, episode.name);
        }
      })
    );

    if (series && seasons && episodes) {
      return { success: true };
    }
  } catch {
    return { success: false };
  }
};

export default createNewSeries;
