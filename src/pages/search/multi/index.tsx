import { useRouter } from "next/router";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import LoadingPageComponents from "../../../components/common/LoadingPageComponents";
import { LoadingPoster } from "../../../components/posters/LoadingPoster";
import MoviePoster from "../../../components/posters/MoviePoster";
import PersonPoster from "../../../components/posters/PersonPoster";
import TVPoster from "../../../components/posters/TVPoster";
import { trpc } from "../../../utils/trpc";

const SearchPage = () => {
  const router = useRouter();
  const { query } = router.query;
  const { ref, inView } = useInView();

  const { data, status, isFetchingNextPage, hasNextPage, fetchNextPage, refetch } =
    trpc.multi.searchMulti.useInfiniteQuery(
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

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage]);

  return (
    <div className="max-w-6xl px-4 pt-32 m-auto">
      <div className="z-40 text-4xl">Results for: {query}</div>
      <LoadingPageComponents status={status} posters>
        {() => (
          <div className="flex flex-wrap items-center justify-center gap-4 py-5 md:justify-start">
            {data?.pages.map((page) =>
              page.results.map((content: any) => {
                if (content.media_type === "tv") {
                  return (
                    <TVPoster
                      imageSrc={`${content.poster_path}`}
                      name={content.title || content.name}
                      key={content.id}
                      url={`/tv/${content.id}`}
                      score={content.vote_average}
                    />
                  );
                }

                if (content.media_type === "movie") {
                  return (
                    <MoviePoster
                      id={content.id}
                      imageSrc={`${content.poster_path}`}
                      name={content.title || content.name}
                      key={content.id}
                      url={`/movies/${content.id}`}
                      score={content.vote_average}
                      watched={content.watched}
                      markAsWatched={markAsWatched.mutate}
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
              })
            )}
            <div className="loader" ref={ref}>
              {isFetchingNextPage && hasNextPage && <LoadingPoster />}
            </div>
            {!hasNextPage && <p className="py-12 text-center">No more results found...</p>}
          </div>
        )}
      </LoadingPageComponents>
    </div>
  );
};

export default SearchPage;
