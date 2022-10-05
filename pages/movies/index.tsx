import { GetStaticProps } from "next";
import { useState } from "react";
import { useQuery, QueryClient, dehydrate } from "react-query";
import ContentRow from "../../modules/ContentRow";
import PosterHeader from "../../modules/PosterHeader";

const fetchTrendingMovies = (filter: string): any =>
  fetch(`https://api.themoviedb.org/3/trending/movie/${filter}?api_key=${process.env.NEXT_PUBLIC_TMDB_KEY}`)
    .then((res) => res.json())
    .then((res) => res.results.slice(0, 6))
    .then((res) => {
      const newKeys: any[] = [];

      res.map((m: any) =>
        newKeys.push({ imageSrc: `https://image.tmdb.org/t/p/original${m.poster_path}`, name: m.title })
      );

      return newKeys;
    });

const MoviesPage = () => {
  const [trendingFilter, setTrendingFilter] = useState("day");

  const {
    isSuccess,
    data: trendingMovies,
    isLoading,
    isError,
  } = useQuery(["getTrendingMovies", trendingFilter], () => fetchTrendingMovies(trendingFilter), {
    staleTime: 24 * (60 * (60 * 1000)), // 24 hours
  });

  if (isSuccess) {
    return (
      <div className="pb-5">
        <PosterHeader
          type="movies"
          backgroundImage="https://www.themoviedb.org/t/p/original/wQxPlS65wgy6Ik7N80bsMpAkjyf.jpg"
          recommendations={[
            {
              imageSrc: "https://image.tmdb.org/t/p/original/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
              name: "Interstellar",
            },
            {
              imageSrc: "https://image.tmdb.org/t/p/original/tVxDe01Zy3kZqaZRNiXFGDICdZk.jpg",
              name: "Bullet Train",
            },
          ]}
        />

        <div className="max-w-6xl pb-6 mx-2 md:-mt-24 md:mx-auto">
          <ContentRow
            type="Trending"
            data={trendingMovies}
            buttons={{
              onClick: (value) => setTrendingFilter(value),
              currentValue: trendingFilter,
              data: [
                { title: "Today", value: "day" },
                { title: "This week", value: "week" },
              ],
            }}
          />
          <ContentRow type="Popular" data={[]} />
          <ContentRow
            type="Upcoming"
            data={[]}
            buttons={{
              onClick: () => {
                console.log("upcoming");
              },
              currentValue: "day",
              data: [
                { title: "Streaming", value: "streaming" },
                { title: "In Theaters", value: "theaters" },
              ],
            }}
          />
        </div>

        <div className="mx-2 md:mx-auto max-w-6xl pt-2 border-t-2 border-[#343434]">
          <ContentRow
            type="Movies"
            data={[]}
            buttons={{
              onClick: () => {
                console.log("movies");
              },
              currentValue: "day",
              data: [
                { title: "Trending", value: "trending" },
                { title: "Popular", value: "popular" },
                { title: "Recommended", value: "recommended" },
                { title: "Box Office", value: "boxoffice" },
              ],
            }}
          />
          <div className="flex items-center justify-center">
            <div className="px-10 py-2 border-2 rounded-full cursor-pointer select-none border-primary text-primary">
              Load more...
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return <div className="max-w-6xl pt-16 pb-6 mx-6 md:mx-auto">Loading</div>;
  }

  if (isError) {
    return <div className="max-w-6xl pt-16 pb-6 mx-6 md:mx-auto">Something went wrong...</div>;
  }

  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <></>;
};

export const getStaticProps: GetStaticProps = async () => {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery(["getTrendingMovies", "day"], () => fetchTrendingMovies("day"));

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
};

export default MoviesPage;
