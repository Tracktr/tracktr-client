interface IFetchMoviesContent {
  type: string;
  limiter: string;
  filter?: string;
  sortBy?: string;
  slice?: number;
  page?: number;
}

export const fetchMoviesContent = async ({ type, limiter, filter, sortBy, page }: IFetchMoviesContent) => {
  let url = `/api/movies/`;
  url += `?type=${type.toString()}`;
  url += `&limiter=${limiter.toString()}`;
  if (filter) url += `&filter=${filter.toString()}`;
  if (sortBy) url += `&sortby=${sortBy.toString()}`;
  if (page) url += `&page=${page.toString()}`;

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
  let url = `/api/tv/`;
  url += `?type=${type.toString()}`;
  url += `&limiter=${limiter.toString()}`;
  if (filter) url += `&filter=${filter.toString()}`;
  if (sortBy) url += `&sortby=${sortBy.toString()}`;
  if (page) url += `&page=${page.toString()}`;

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
