import { GetStaticProps } from "next";
import { useState } from "react";
import { QueryClient, dehydrate } from "react-query";
import ContentRow from "../../modules/ContentRow";
import PosterHeader from "../../modules/PosterHeader";
import {
  fetchDiscoverSeries,
  fetchPopularSeries,
  fetchTrendingSeries,
  fetchUpcomingSeries,
} from "../../utils/fetchQueries";

const SeriesPage = () => {
  const [trendingFilter, setTrendingFilter] = useState("day");
  const [discoverFilter, setDiscoverFilter] = useState("popularity.desc");

  return (
    <div className="pb-5">
      <PosterHeader
        type="series"
        backgroundImage="https://www.themoviedb.org/t/p/original/Aa9TLpNpBMyRkD8sPJ7ACKLjt0l.jpg"
        recommendations={[
          {
            imageSrc: "https://image.tmdb.org/t/p/original/z2yahl2uefxDCl0nogcRBstwruJ.jpg",
            name: "House of the Dragon",
          },
          {
            imageSrc: "https://image.tmdb.org/t/p/original/1rO4xoCo4Z5WubK0OwdVll3DPYo.jpg",
            name: "The Lord of the Rings: The Rings of Power",
          },
        ]}
      />

      <div className="max-w-6xl pb-6 mx-2 md:-mt-24 md:mx-auto">
        <ContentRow
          type="Trending"
          fetchContent={() => fetchTrendingSeries(trendingFilter)}
          buttons={{
            onClick: (value) => setTrendingFilter(value),
            currentValue: trendingFilter,
            data: [
              { title: "Today", value: "day" },
              { title: "This week", value: "week" },
            ],
          }}
        />
        <ContentRow type="Popular" fetchContent={fetchPopularSeries} />
      </div>

      <div className="mx-2 md:mx-auto max-w-6xl pt-2 border-t-2 border-[#343434]">
        <ContentRow
          type="Series"
          fetchContent={() => fetchDiscoverSeries(discoverFilter)}
          buttons={{
            onClick: (value) => setDiscoverFilter(value),
            currentValue: discoverFilter,
            data: [
              { title: "Popular", value: "popularity.desc" },
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

  await queryClient.prefetchQuery(["getTrendingContent", "day"], () => fetchTrendingSeries());
  await queryClient.prefetchQuery(["getPopularContent", ""], () => fetchPopularSeries());
  await queryClient.prefetchQuery(["getUpcomingContent", ""], () => fetchUpcomingSeries());
  await queryClient.prefetchQuery(["getSeriesContent", "popularity.desc"], () => fetchDiscoverSeries());

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
};

export default SeriesPage;
