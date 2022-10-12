interface IFetchMoviesContent {
  type: string;
  limiter: string;
  filter?: string;
  sortBy?: string;
  slice?: number;
  page?: number;
}

export const fetchMoviesContent = async ({ type, limiter, filter, sortBy, page }: IFetchMoviesContent) => {
  const url = new URL("movies", process.env.NEXT_PUBLIC_URL && `${process.env.NEXT_PUBLIC_URL}/api/`);
  url.searchParams.append("type", type.toString());
  url.searchParams.append("limiter", limiter.toString());
  if (filter) url.searchParams.append("filter", filter.toString());
  if (sortBy) url.searchParams.append("sortby", sortBy.toString());
  if (page) url.searchParams.append("page", page.toString());

  const response = await fetch(url);
  const data = await response.json();

  return data;
};

interface IFetchTVsContent {
  type: string;
  limiter: string;
  filter?: string;
  sortBy?: string;
  slice?: number;
  page?: number;
}

export const fetchTVsContent = async ({ type, limiter, filter, sortBy, page }: IFetchTVsContent) => {
  const url = new URL("tv", process.env.NEXT_PUBLIC_URL && `${process.env.NEXT_PUBLIC_URL}/api/`);
  url.searchParams.append("type", type.toString());
  url.searchParams.append("limiter", limiter.toString());
  if (filter) url.searchParams.append("filter", filter.toString());
  if (sortBy) url.searchParams.append("sortby", sortBy.toString());
  if (page) url.searchParams.append("page", page.toString());

  const response = await fetch(url);
  const data = await response.json();

  return data;
};

interface IFetchMovieContent {
  id: string;
}

export const fetchMovieContent = async (id: IFetchMovieContent) => {
  const response = await fetch(`/api/movies/${id}`);
  const data = await response.json();

  return data;
};

interface IFetchTVContent {
  seriesID: string;
}

export const fetchTVContent = async ({ seriesID }: IFetchTVContent) => {
  const response = await fetch(`/api/tv/${seriesID}`);
  const data = await response.json();

  return data;
};

interface IFetchSeasonContent {
  seriesID: string;
  seasonID: string;
}

export const fetchSeasonContent = async ({ seriesID, seasonID }: IFetchSeasonContent) => {
  const response = await fetch(`/api/tv/${seriesID}/season/${seasonID}`);
  const data = await response.json();

  return data;
};

interface IFetchEpisodeContent {
  seriesID: string;
  seasonID: string;
  episodeID: string;
}

export const fetchEpisodeContent = async ({ seriesID, seasonID, episodeID }: IFetchEpisodeContent) => {
  const response = await fetch(`/api/tv/${seriesID}/season/${seasonID}/episode/${episodeID}`);
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
  const response = await fetch(`/api/person/${personID}`);
  const data = await response.json();

  return data;
};
