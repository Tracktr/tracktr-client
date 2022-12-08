import { TmdbEpisode } from "../types/tmdb";

const createNewSeries = async ({ show, seriesPoster, id }: { show: any; seriesPoster: string; id: number }) => {
  const newSeriesCreateUpdate = {
    id: show.id,
    name: show.name,
    poster: seriesPoster,
    seasons: {
      connectOrCreate: await Promise.all(
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

            return {
              where: { id: season.id },
              create: {
                id: season.id,
                name: season.name,
                poster: season.poster_path ? season.poster_path : seriesPoster,
                season_number: season.season_number,
                episodes: {
                  connectOrCreate: seasonWithEpisodes.episodes.map((e: TmdbEpisode) => {
                    return {
                      where: { id: e.id },
                      create: {
                        id: e.id,
                        name: e.name,
                        episode_number: e.episode_number,
                        season_number: e.season_number,
                        air_date: e.air_date ? new Date(e.air_date) : null,
                      },
                    };
                  }),
                },
              },
            };
          }
        )
      ),
    },
  };

  return newSeriesCreateUpdate;
};

export default createNewSeries;
