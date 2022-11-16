import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { trpc } from "../../utils/trpc";
import LoadingPageComponents from "../common/LoadingPageComponents";
import PosterGrid from "../common/PosterGrid";
import SortPill from "../common/SortPill";
import { LoadingPoster } from "../posters/LoadingPoster";
import TVPoster from "../posters/TVPoster";

const TVInfiniteScroll = () => {
  const [filter, setFilter] = useState("popular");
  const MAX_PAGES = 5;
  const { ref, inView } = useInView();

  const { data, status, isFetchingNextPage, hasNextPage, fetchNextPage } = trpc.tv.infiniteTV.useInfiniteQuery(
    {
      filter: filter,
    },
    {
      getNextPageParam: (lastPage, allPages) => {
        const nextPage = allPages.length + 1;
        return lastPage.results.length !== 0 && lastPage.page <= MAX_PAGES ? nextPage : undefined;
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
      <div className="flex items-center pb-6">
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
                page.results.map((content: any) => {
                  return (
                    <TVPoster
                      imageSrc={`${content.poster_path}`}
                      name={content.title || content.name}
                      key={content.id}
                      url={`tv/${content.id}`}
                      score={content.vote_average}
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
