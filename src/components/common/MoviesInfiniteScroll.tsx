import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { trpc } from "../../utils/trpc";
import { LoadingPoster } from "../posters/LoadingPoster";
import MoviePoster from "../posters/MoviePoster";
import PersonPoster from "../posters/PersonPoster";
import TVPoster from "../posters/TVPoster";
import LoadingPageComponents from "./LoadingPageComponents";

interface IMoviesInfiniteScroll {
  type: "Movies" | "TV" | "Person";
  title: string;
}

const MoviesInfiniteScroll = ({ type, title }: IMoviesInfiniteScroll) => {
  const MAX_PAGES = 5;
  const { ref, inView } = useInView();

  const { data, status, isFetchingNextPage, hasNextPage, fetchNextPage } = trpc.movie.infiniteMovies.useInfiniteQuery(
    ({ pageParam = 1 }) => ({ page: pageParam, type }),
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
      <div className="z-40 text-4xl">{title}</div>
      <LoadingPageComponents status={status}>
        {() => (
          <div className="flex flex-wrap items-center justify-center gap-4 py-5 md:justify-start">
            {data?.pages.map((page) =>
              page.results.map((content: any) => {
                if (type === "TV") {
                  return (
                    <TVPoster
                      imageSrc={`${content.poster_path}`}
                      name={content.title || content.name}
                      key={content.id}
                      url={`tv/${content.id}`}
                    />
                  );
                }

                if (type === "Movies") {
                  return (
                    <MoviePoster
                      imageSrc={`${content.poster_path}`}
                      name={content.title || content.name}
                      key={content.id}
                      url={`movies/${content.id}`}
                    />
                  );
                }

                if (type === "Person") {
                  return (
                    <PersonPoster
                      imageSrc={`${content.poster_path || content.profile_path}`}
                      name={content.title || content.name}
                      key={content.id}
                      url={`person/${content.id}`}
                    />
                  );
                }

                return <div key={content.id} />;
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

export default MoviesInfiniteScroll;
