import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { trpc } from "../../utils/trpc";
import LoadingPageComponents from "../common/LoadingPageComponents";
import { PosterGrid } from "../common/PosterGrid";
import SortPill from "../common/SortPill";
import { LoadingPoster } from "../posters/LoadingPoster";
import MoviePoster from "../posters/MoviePoster";

export interface InfiniteMovie {
  adult: boolean;
  backdrop_path: string;
  genre_ids: number[];
  id: number;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  release_date: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
  watched: boolean;
  watched_id: string | null;
  watchlist: boolean;
  watchlist_id: string | null;
}

const MoviesInfiniteScroll = () => {
  const [filter, setFilter] = useState("popular");
  const { ref, inView } = useInView();

  const { data, status, isFetchingNextPage, hasNextPage, fetchNextPage, refetch, isRefetching } =
    trpc.movie.infiniteMovies.useInfiniteQuery(
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
        <div className="z-40 text-4xl">Movies</div>
        <SortPill
          buttons={{
            onClick: (value) => setFilter(value),
            currentValue: filter,
            data: [
              { title: "Popular", value: "popular" },
              { title: "Top Rated", value: "top_rated" },
              { title: "In Theaters", value: "now_playing" },
              { title: "Upcoming", value: "upcoming" },
            ],
          }}
        />
      </div>

      <LoadingPageComponents status={status} posters>
        {() => (
          <PosterGrid>
            <>
              {data?.pages.map((page) =>
                page.results.map((content: InfiniteMovie) => {
                  return (
                    <MoviePoster
                      id={content.id}
                      imageSrc={`${content.poster_path}`}
                      name={content.title}
                      key={content.id}
                      url={`movies/${content.id}`}
                      score={content.vote_average}
                      watched={content.watched}
                      watched_id={content.watched_id}
                      watchlist={content.watchlist}
                      watchlist_id={content.watchlist_id}
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

export default MoviesInfiniteScroll;
