import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import LoadingPageComponents from "../../../components/common/LoadingPageComponents";
import { PosterGrid } from "../../../components/common/PosterGrid";
import { LoadingPoster } from "../../../components/posters/LoadingPoster";
import TVPoster from "../../../components/posters/TVPoster";
import { trpc } from "../../../utils/trpc";
import { IPage } from "../movie";

const SearchPage = () => {
  const router = useRouter();
  const { query } = router.query;
  const { ref, inView } = useInView();

  const { data, status, isFetchingNextPage, hasNextPage, fetchNextPage, refetch, isRefetching } =
    trpc.search.useInfiniteQuery(
      { query: query as string, type: "tv" },
      {
        getNextPageParam: (lastPage: IPage, allPages: IPage[]) => {
          const nextPage = allPages.length + 1;
          return lastPage.results.length !== 0 ? nextPage : undefined;
        },
      },
    );

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage]);

  return (
    <>
      <Head>
        <title>Search results for {query} - Tracktr.</title>
        <meta name="description" content={`Track movies and series like ${query} on Tracktr.`} />
      </Head>

      <div className="max-w-6xl px-4 pt-32 m-auto">
        <div className="z-40 mb-5 text-4xl">
          Results for: <span className="font-bold">{query}</span>
        </div>
        <LoadingPageComponents status={status} posters>
          {() => (
            <>
              <PosterGrid>
                <>
                  {data?.pages.map((page) =>
                    page.results.map((content: any) => {
                      return (
                        <TVPoster
                          id={content.id}
                          imageSrc={`${content.poster_path}`}
                          name={content.title || content.name}
                          key={content.id}
                          url={`/tv/${content.id}`}
                          score={content.vote_average}
                          watched={content.watched}
                          refetch={refetch}
                          fetchStatus={isRefetching}
                          watchlist={content.watchlist}
                          watchlist_id={content.watchlist_id}
                        />
                      );
                    }),
                  )}
                  <div className="loader" ref={ref}>
                    {isFetchingNextPage && hasNextPage && <LoadingPoster />}
                  </div>
                </>
              </PosterGrid>
              {!hasNextPage && <p className="py-12 text-center">No more results found...</p>}
            </>
          )}
        </LoadingPageComponents>
      </div>
    </>
  );
};

export default SearchPage;
