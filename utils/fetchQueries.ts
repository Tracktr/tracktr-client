import { PosterImage } from "./generateImages";

interface IFetchMinimizedContent {
  type: "trending" | "movie" | "discover" | "tv";
  limiter: "movie" | "tv" | "popular" | "upcoming";
  filter?: string;
  sortBy?: string;
  slice?: number;
  page?: number;
}

// TODO: Async Await Refactor
export const fetchMinimizedContent = ({ type, limiter, filter, sortBy, slice, page }: IFetchMinimizedContent): any => {
  const url = new URL(`${type}/${limiter}${filter ? `/${filter}` : ""}`, process.env.NEXT_PUBLIC_TMDB_API);
  url.searchParams.append("api_key", process.env.NEXT_PUBLIC_TMDB_KEY || "");
  if (sortBy) url.searchParams.append("sort_by", sortBy || "");
  if (page) url.searchParams.append("page", page.toString());

  const data = fetch(url)
    .then((res) => res.json())
    .then((res) => (page ? res : res.results.slice(0, slice)))
    .then((res) => {
      if (!page) {
        const newKeys: any[] = [];

        res.map((m: any) =>
          newKeys.push({
            imageSrc: PosterImage({ path: m.poster_path, size: "md" }),
            name: m.title || m.name,
            id: m.id,
          })
        );

        return newKeys;
      }

      return res;
    });

  return data;
};

interface IFetchMovieContent {
  id: string;
}

export const fetchMovieContent = async (id: IFetchMovieContent) => {
  const response = await fetch(`/api/movie/${id}`);
  const data = await response.json();

  return data;
};

interface IFetchDetailedContent {
  type: "Movie" | "TV";
  id: string;
}

export const fetchDetailedContent = async ({ type, id }: IFetchDetailedContent) => {
  const url = new URL(`${type.toLowerCase()}/${id}`, process.env.NEXT_PUBLIC_TMDB_API);
  url.searchParams.append("api_key", process.env.NEXT_PUBLIC_TMDB_KEY || "");

  const response = await fetch(url);
  const data = await response.json();

  return data;
};

interface IFetchSeasonContent {
  seriesID: string;
  seasonID: string;
}

export const fetchSeasonContent = async ({ seriesID, seasonID }: IFetchSeasonContent) => {
  const url = new URL(`tv/${seriesID}/season/${seasonID}`, process.env.NEXT_PUBLIC_TMDB_API);
  url.searchParams.append("api_key", process.env.NEXT_PUBLIC_TMDB_KEY || "");

  const response = await fetch(url);
  const data = await response.json();

  return data;
};

interface IFetchEpisodeContent {
  seriesID: string;
  seasonID: string;
  episodeID: string;
}

export const fetchEpisodeContent = async ({ seriesID, seasonID, episodeID }: IFetchEpisodeContent) => {
  const url = new URL(`tv/${seriesID}/season/${seasonID}/episode/${episodeID}`, process.env.NEXT_PUBLIC_TMDB_API);
  url.searchParams.append("api_key", process.env.NEXT_PUBLIC_TMDB_KEY || "");

  const response = await fetch(url);
  const data = await response.json();

  return data;
};

interface IFetchSearchContent {
  query: string | string[] | undefined;
  page: number;
  type: string | string[] | undefined;
}

export const fetchSearchRequest = async ({ query, page, type }: IFetchSearchContent) => {
  const url = new URL(
    `${
      (type === "Movies" && "search/movie") ||
      (type === "Series" && "search/tv") ||
      (type === "Person" && "search/person") ||
      "search/multi"
    }`,
    process.env.NEXT_PUBLIC_TMDB_API
  );
  url.searchParams.append("api_key", process.env.NEXT_PUBLIC_TMDB_KEY || "");
  if (query) url.searchParams.append("query", query.toString());
  url.searchParams.append("page", page.toString());

  const response = await fetch(url);
  const data = await response.json();

  return data;
};

interface IFetchPersonContent {
  personID: string;
}

export const fetchPersonContent = async ({ personID }: IFetchPersonContent) => {
  const url = new URL(`person/${personID}`, process.env.NEXT_PUBLIC_TMDB_API);
  url.searchParams.append("api_key", process.env.NEXT_PUBLIC_TMDB_KEY || "");

  const response = await fetch(url);
  const data = await response.json();

  return data;
};
