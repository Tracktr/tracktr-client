import { useRouter } from "next/router";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import LoadingPageComponents from "../../../components/common/LoadingPageComponents";
import { PosterGrid } from "../../../components/common/PosterGrid";
import { LoadingPoster } from "../../../components/posters/LoadingPoster";
import MoviePoster from "../../../components/posters/MoviePoster";
import { trpc } from "../../../utils/trpc";

const SearchPage = () => {
  const router = useRouter();
  const { query } = router.query;
  const { ref, inView } = useInView();

  const { data, status, isFetchingNextPage, hasNextPage, fetchNextPage, refetch } =
    trpc.movie.searchMovie.useInfiniteQuery(
      { query: query as string },
      {
        getNextPageParam: (lastPage: any, allPages: any) => {
          const nextPage = allPages.length + 1;
          return lastPage.results.length !== 0 ? nextPage : undefined;
        },
      }
    );

  const markAsWatched = trpc.movie.markMovieAsWatched.useMutation({
    onSuccess: () => refetch(),
  });

  const deleteFromHistory = trpc.movie.removeMovieFromWatched.useMutation({
    onSuccess: () => {
      refetch();
    },
  });

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage]);

  return (
    <div className="max-w-6xl px-4 pt-32 m-auto">
      <div className="z-40 mb-5 text-4xl">Results for: {query}</div>
      <LoadingPageComponents status={status} posters>
        {() => (
          <PosterGrid>
            <>
              {data?.pages.map((page) =>
                page.results.map((content: any) => {
                  return (
                    <MoviePoster
                      id={content.id}
                      imageSrc={`${content.poster_path}`}
                      name={content.title || content.name}
                      key={content.id}
                      url={`/movie/${content.id}`}
                      score={content.vote_average}
                      watched={content.watched}
                      markAsWatched={markAsWatched.mutate}
                      deleteFromWatched={deleteFromHistory}
                      watched_id={content.watched_id}
                    />
                  );
                })
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
  );
};

export default SearchPage;
