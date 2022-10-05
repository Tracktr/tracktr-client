interface IFetchMinimizedContent {
  type: "trending" | "movie" | "discover" | "tv";
  limiter: "movie" | "tv" | "popular" | "upcoming";
  filter?: string;
  sortBy?: string;
  slice?: number;
}

export const fetchMinimizedContent = ({ type, limiter, filter, sortBy, slice }: IFetchMinimizedContent): any => {
  const BASE_URL = new URL("https://api.themoviedb.org/3/");
  const url = new URL(`${type}/${limiter}${filter ? `/${filter}` : ""}`, BASE_URL);
  url.searchParams.append("api_key", process.env.NEXT_PUBLIC_TMDB_KEY || "");
  sortBy ?? url.searchParams.append("sort_by", sortBy || "");

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
