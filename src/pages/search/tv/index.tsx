import { useRouter } from "next/router";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import LoadingPageComponents from "../../../components/common/LoadingPageComponents";
import { LoadingPoster } from "../../../components/posters/LoadingPoster";
import TVPoster from "../../../components/posters/TVPoster";
import { trpc } from "../../../utils/trpc";

const SearchPage = () => {
  const router = useRouter();
  const { query } = router.query;
  const { ref, inView } = useInView();

  const { data, status, isFetchingNextPage, hasNextPage, fetchNextPage } = trpc.tv.searchTV.useInfiniteQuery(
    { query: query as string },
    {
      getNextPageParam: (lastPage: any, allPages: any) => {
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
    <LoadingPageComponents status={status}>
      {() => (
        <div className="max-w-6xl px-4 pt-32 m-auto">
          <div className="z-40 text-4xl">Results for: {query}</div>
          <div className="flex flex-wrap items-center justify-center gap-4 py-5">
            {data?.pages.map((page) =>
              page.results.map((content: any) => {
                return (
                  <TVPoster
                    imageSrc={`${content.poster_path}`}
                    name={content.title || content.name}
                    key={content.id}
                    url={`/tv/${content.id}`}
                    score={content.vote_average}
                  />
                );
              })
            )}
          </div>

          <div className="loader" ref={ref}>
            {isFetchingNextPage && hasNextPage && <LoadingPoster />}
          </div>
          {!hasNextPage && <p className="py-12 text-center">No more results found...</p>}
        </div>
      )}
    </LoadingPageComponents>
  );
};

export default SearchPage;
