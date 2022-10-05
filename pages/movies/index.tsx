import { GetStaticProps } from "next";
import { useState } from "react";
import { QueryClient, dehydrate } from "react-query";
import ContentRow from "../../modules/ContentRow";
import PosterHeader from "../../modules/PosterHeader";
import {
  fetchDiscoverMovies,
  fetchPopularMovies,
  fetchTrendingMovies,
  fetchUpcomingMovies,
} from "../../utils/fetchQueries";

const MoviesPage = () => {
  const [trendingFilter, setTrendingFilter] = useState("day");
  const [discoverFilter, setDiscoverFilter] = useState("popularity.desc");

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
          fetchContent={() => fetchTrendingMovies(trendingFilter)}
          buttons={{
            onClick: (value) => setTrendingFilter(value),
            currentValue: trendingFilter,
            data: [
              { title: "Today", value: "day" },
              { title: "This week", value: "week" },
            ],
          }}
        />
        <ContentRow type="Popular" fetchContent={fetchPopularMovies} />
        <ContentRow type="Upcoming" fetchContent={fetchUpcomingMovies} />
      </div>

      <div className="mx-2 md:mx-auto max-w-6xl pt-2 border-t-2 border-[#343434]">
        <ContentRow
          type="Movies"
          fetchContent={() => fetchDiscoverMovies(discoverFilter)}
          buttons={{
            onClick: (value) => setDiscoverFilter(value),
            currentValue: discoverFilter,
            data: [
              { title: "Popular", value: "popularity.desc" },
              { title: "Box Office", value: "revenue.desc" },
              { title: "Score", value: "vote_average.desc&vote_count.gte=10000" },
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
};

export const getStaticProps: GetStaticProps = async () => {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery(["getTrendingContent", "day"], () => fetchTrendingMovies());
  await queryClient.prefetchQuery(["getPopularContent", ""], () => fetchPopularMovies());
  await queryClient.prefetchQuery(["getUpcomingContent", ""], () => fetchUpcomingMovies());
  await queryClient.prefetchQuery(["getMoviesContent", "popularity.desc"], () => fetchDiscoverMovies());

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
};

export default MoviesPage;
