import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { trpc } from "../../utils/trpc";
import LoadingPageComponents from "../common/LoadingPageComponents";
import { PosterGrid } from "../common/PosterGrid";
import SortPill from "../common/SortPill";
import { LoadingPoster } from "../posters/LoadingPoster";
import TVPoster from "../posters/TVPoster";

export interface InfiniteShow {
  backdrop_path: string;
  first_air_date: string;
  id: number;
  name: string;
  origin_country: string[];
  original_language: string;
  original_name: string;
  overview: string;
  popularity: number;
  poster_path: string;
  vote_average: number;
  vote_count: number;
  watched: boolean;
}

const TVInfiniteScroll = () => {
  const [filter, setFilter] = useState("popular");
  const { ref, inView } = useInView();

  const { data, status, isFetchingNextPage, hasNextPage, fetchNextPage, refetch, isRefetching } =
    trpc.tv.infiniteTV.useInfiniteQuery(
      {
        filter: filter,
      },
      {
        getNextPageParam: (lastPage, allPages) => {
          const nextPage = allPages.length + 1;
          return lastPage.results.length !== 0 ? nextPage : undefined;
        },
      }
    );

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage]);

  return (
    <div className="px-4">
      <div className="items-center pb-6 md:flex">
        <div className="z-40 text-4xl">Series</div>
        <SortPill
          buttons={{
            onClick: (value) => setFilter(value),
            currentValue: filter,
            data: [
              { title: "Popular", value: "popular" },
              { title: "Airing Today", value: "airing_today" },
              { title: "Recent", value: "on_the_air" },
              { title: "Top Rated", value: "top_rated" },
            ],
          }}
        />
      </div>
      <LoadingPageComponents status={status} posters>
        {() => (
          <PosterGrid>
            <>
              {data?.pages.map((page) =>
                page.results.map((content: InfiniteShow) => {
                  return (
                    <TVPoster
                      id={content.id}
                      imageSrc={`${content.poster_path}`}
                      name={content.name}
                      key={content.id}
                      url={`tv/${content.id}`}
                      score={content.vote_average}
                      watched={content.watched}
                      refetch={refetch}
                      fetchStatus={isRefetching}
                    />
                  );
                })
              )}
              <div className="loader" ref={ref}>
                {isFetchingNextPage && hasNextPage && <LoadingPoster />}
              </div>
            </>
          </PosterGrid>
        )}
      </LoadingPageComponents>
    </div>
  );
};

export default TVInfiniteScroll;
