interface IFetchMinimizedContent {
  type: "trending" | "movie" | "discover" | "tv";
  limiter: "movie" | "tv" | "popular" | "upcoming";
  filter?: string;
  sortBy?: string;
  slice?: number;
}

// TODO: Async Await Refactor
export const fetchMinimizedContent = ({ type, limiter, filter, sortBy, slice }: IFetchMinimizedContent): any => {
  const url = new URL(`${type}/${limiter}${filter ? `/${filter}` : ""}`, process.env.TMDB_API);
  url.searchParams.append("api_key", process.env.NEXT_PUBLIC_TMDB_KEY || "");
  if (sortBy) url.searchParams.append("sort_by", sortBy || "");

  const data = fetch(url)
    .then((res) => res.json())
    .then((res) => res.results.slice(0, slice))
    .then((res) => {
      const newKeys: any[] = [];

      res.map((m: any) =>
        newKeys.push({
          imageSrc: `https://image.tmdb.org/t/p/w185${m.poster_path}`,
          name: m.title || m.name,
          id: m.id,
        })
      );

      return newKeys;
    });

  return data;
};

interface IFetchDetailedContent {
  type: "Movie" | "TV";
  id: string;
}

export const fetchDetailedContent = async ({ type, id }: IFetchDetailedContent) => {
  const url = new URL(`${type.toLowerCase()}/${id}`, process.env.TMDB_API);
  url.searchParams.append("api_key", process.env.NEXT_PUBLIC_TMDB_KEY || "");

  const response = await fetch(url);
  const data = await response.json();

  return data;
};
