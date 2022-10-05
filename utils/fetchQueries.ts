interface IFetchMinimizedContent {
  type: "trending" | "movie" | "discover" | "tv";
  limiter: "movie" | "tv" | "popular" | "upcoming";
  filter?: string;
  sortBy?: string;
  slice?: number;
  page?: number;
}

const fetchMinimizedContent = ({ type, limiter, filter, sortBy, slice, page }: IFetchMinimizedContent): any => {
  const BASE_URL = new URL("https://api.themoviedb.org/3/");
  const url = new URL(`${type}/${limiter}${filter ? `/${filter}` : ""}`, BASE_URL);
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
            imageSrc: `https://image.tmdb.org/t/p/w185${m.poster_path}`,
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

export default fetchMinimizedContent;
