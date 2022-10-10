import LoadingPageComponents from "@/components/common/loading/LoadingPageComponents";
import { LoadingPoster } from "@/components/common/poster/LoadingPosters";
import Poster from "@/components/common/poster/Poster";
import { fetchSearchRequest } from "@/utils/fetchQueries";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { useInfiniteQuery } from "react-query";

const SearchPage = () => {
  const router = useRouter();
  const { query } = router.query;
  const { ref, inView } = useInView();

  const { data, status, fetchNextPage, isFetchingNextPage, hasNextPage } = useInfiniteQuery(
    ["Search", query],
    ({ pageParam = 1 }) =>
      fetchSearchRequest({
        query: query || "",
        page: pageParam,
      }),
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
    <LoadingPageComponents status={status}>
      {() => (
        <div className="max-w-6xl pt-32 m-auto">
          <div className="z-40 text-4xl">Results for: {query}</div>
          <div className="flex flex-wrap items-center gap-4 py-5">
            {data?.pages.map((page) =>
              page.results.map((content: any) => {
                const mediaTypeTransformer =
                  (content.media_type === "tv" && "series") ||
                  (content.media_type === "movie" && "movies") ||
                  (content.media_type === "person" && "person");
                return (
                  <Poster
                    imageSrc={`${content.poster_path || content.profile_path}`}
                    name={content.title || content.name}
                    key={content.id}
                    url={`${mediaTypeTransformer}/${content.id}`}
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
