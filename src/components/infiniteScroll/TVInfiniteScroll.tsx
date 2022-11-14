import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { trpc } from "../../utils/trpc";
import LoadingPageComponents from "../common/LoadingPageComponents";
import { LoadingPoster } from "../posters/LoadingPoster";
import TVPoster from "../posters/TVPoster";

const TVInfiniteScroll = () => {
  const MAX_PAGES = 5;
  const { ref, inView } = useInView();

  const { data, status, isFetchingNextPage, hasNextPage, fetchNextPage } = trpc.tv.infiniteTV.useInfiniteQuery(
    ({ pageParam = 1 }) => ({ page: pageParam }),
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
      <div className="z-40 text-4xl">Series</div>
      <LoadingPageComponents status={status} posters>
        {() => (
          <div className="flex flex-wrap items-center justify-center gap-4 py-5">
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
          </div>
        )}
      </LoadingPageComponents>
    </div>
  );
};

export default TVInfiniteScroll;
