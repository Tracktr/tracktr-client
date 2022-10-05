export const fetchTrendingMovies = (filter?: string): any =>
  fetch(`https://api.themoviedb.org/3/trending/movie/${filter || "day"}?api_key=${process.env.NEXT_PUBLIC_TMDB_KEY}`)
    .then((res) => res.json())
    .then((res) => res.results.slice(0, 6))
    .then((res) => {
      const newKeys: any[] = [];

      res.map((m: any) =>
        newKeys.push({ imageSrc: `https://image.tmdb.org/t/p/original${m.poster_path}`, name: m.title })
      );

      return newKeys;
    });

export const fetchPopularMovies = (): any =>
  fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${process.env.NEXT_PUBLIC_TMDB_KEY}&language=en-US&page=1`)
    .then((res) => res.json())
    .then((res) => res.results.slice(0, 6))
    .then((res) => {
      const newKeys: any[] = [];

      res.map((m: any) =>
        newKeys.push({ imageSrc: `https://image.tmdb.org/t/p/original${m.poster_path}`, name: m.title })
      );

      return newKeys;
    });

export const fetchUpcomingMovies = (): any =>
  fetch(`https://api.themoviedb.org/3/movie/upcoming?api_key=${process.env.NEXT_PUBLIC_TMDB_KEY}&language=en-US&page=1`)
    .then((res) => res.json())
    .then((res) => res.results.slice(0, 6))
    .then((res) => {
      const newKeys: any[] = [];

      res.map((m: any) =>
        newKeys.push({ imageSrc: `https://image.tmdb.org/t/p/original${m.poster_path}`, name: m.title })
      );

      return newKeys;
    });

export const fetchDiscoverMovies = (filter?: string): any =>
  fetch(
    `https://api.themoviedb.org/3/discover/movie?api_key=${process.env.NEXT_PUBLIC_TMDB_KEY}&language=en-US&sort_by=${
      filter || "popularity.desc"
    }&include_adult=false&include_video=false&page=1&with_watch_monetization_types=flatrate`
  )
    .then((res) => res.json())
    .then((res) => res.results.slice(0, 6))
    .then((res) => {
      const newKeys: any[] = [];

      res.map((m: any) =>
        newKeys.push({ imageSrc: `https://image.tmdb.org/t/p/original${m.poster_path}`, name: m.title })
      );

      return newKeys;
    });
