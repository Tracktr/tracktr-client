import Head from "next/head";
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

  const { data, status, isFetchingNextPage, hasNextPage, fetchNextPage, refetch, isRefetching } =
    trpc.search.useInfiniteQuery(
      { query: query as string, type: "movie" },
      {
        getNextPageParam: (lastPage: IPage, allPages: IPage[]) => {
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
    <>
      <Head>
        <title>Search results for {query} - Tracktr.</title>
        <meta name="description" content={`Track movies and series like ${query} on Tracktr.`} />
      </Head>

      <div className="max-w-6xl px-4 pt-32 m-auto">
        <div className="z-40 mb-5 text-4xl">Results for: {query}</div>
        <LoadingPageComponents status={status} posters>
          {() => (
            <PosterGrid>
              <>
                {data?.pages.map((page) =>
                  page.results.map((content) => {
                    return (
                      <MoviePoster
                        id={content.id}
                        imageSrc={`${content.poster_path}`}
                        name={content.title || content.name}
                        key={content.id}
                        url={`/movies/${content.id}`}
                        score={content.vote_average}
                        watched={content.watched}
                        refetch={refetch}
                        watched_id={content.watched_id}
                        fetchStatus={isRefetching}
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
    </>
  );
};

interface KnownFor {
  adult: boolean;
  backdrop_path: string;
  genre_ids: number[];
  id: number;
  media_type: string;
  original_language: string;
  original_title: string;
  overview: string;
  poster_path: string;
  release_date: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

interface Result {
  adult: boolean;
  backdrop_path: string;
  genre_ids: number[];
  id: number;
  media_type: string;
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
  first_air_date: string;
  name: string;
  origin_country: string[];
  original_name: string;
  gender?: number;
  known_for: KnownFor[];
  known_for_department: string;
  profile_path: string;
}

export interface IPage {
  page: number;
  results: Result[];
  total_pages: number;
  total_results: number;
}

export default SearchPage;
