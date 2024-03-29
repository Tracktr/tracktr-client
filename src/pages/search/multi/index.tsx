import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import LoadingPageComponents from "../../../components/common/LoadingPageComponents";
import { PosterGrid } from "../../../components/common/PosterGrid";
import { LoadingPoster } from "../../../components/posters/LoadingPoster";
import MoviePoster from "../../../components/posters/MoviePoster";
import PersonPoster from "../../../components/posters/PersonPoster";
import TVPoster from "../../../components/posters/TVPoster";
import { trpc } from "../../../utils/trpc";
import { IPage } from "../movie";

const SearchPage = () => {
  const router = useRouter();
  const { query } = router.query;
  const { ref, inView } = useInView();

  const { data, status, isFetchingNextPage, hasNextPage, fetchNextPage, refetch, isRefetching } =
    trpc.search.useInfiniteQuery(
      { query: query as string, type: "multi" },
      {
        getNextPageParam: (lastPage: IPage, allPages: IPage[]) => {
          const nextPage = allPages.length + 1;
          return lastPage.results.length !== 0 ? nextPage : undefined;
        },
        enabled: router.isReady,
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
        <title>{`Search results for ${query} - Tracktr.`}</title>
        <meta name="description" content={`Track movies and series like ${query} on Tracktr.`} />
      </Head>

      <div className="max-w-6xl px-4 pt-32 m-auto">
        <div className="z-40 mb-5 text-4xl">Results for: {query}</div>
        <LoadingPageComponents status={status} posters>
          {() => (
            <PosterGrid>
              <>
                {data &&
                  data.pages.map((page: { results: any[] }) =>
                    page.results.map((content: any) => {
                      if (content.media_type === "tv") {
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
                      }

                      if (content.media_type === "movie") {
                        return (
                          <MoviePoster
                            id={content.id}
                            imageSrc={`${content.poster_path}`}
                            name={content.title}
                            key={content.id}
                            url={`/movies/${content.id}`}
                            score={content.vote_average}
                            watched={content.watched}
                            refetch={refetch}
                            watched_id={content.watched_id}
                            fetchStatus={isRefetching}
                            watchlist={content.watchlist}
                            watchlist_id={content.watchlist_id}
                          />
                        );
                      }

                      if (content.media_type === "person") {
                        return (
                          <PersonPoster
                            imageSrc={`${content.poster_path || content.profile_path}`}
                            name={content.title || content.name}
                            key={content.id}
                            url={`/person/${content.id}`}
                          />
                        );
                      }

                      return <div key={content.id} />;
                    }),
                  )}
                <div className="loader" ref={ref}>
                  {isFetchingNextPage && hasNextPage && <LoadingPoster />}
                </div>
                {!hasNextPage && <p className="py-12 text-center">No more results found...</p>}
              </>
            </PosterGrid>
          )}
        </LoadingPageComponents>
      </div>
    </>
  );
};

export default SearchPage;
