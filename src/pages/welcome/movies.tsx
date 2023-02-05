import { useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { AiOutlineCheckCircle } from "react-icons/ai";
import LoadingPageComponents from "../../components/common/LoadingPageComponents";
import { PosterGrid } from "../../components/common/PosterGrid";
import { LoadingPoster } from "../../components/posters/LoadingPoster";
import MoviePoster from "../../components/posters/MoviePoster";
import { trpc } from "../../utils/trpc";
import { useInView } from "react-intersection-observer";
import { InfiniteMovie } from "../../components/infiniteScroll/MoviesInfiniteScroll";
import Link from "next/link";

const WelcomeMoviesPage = () => {
  const { data: session, status: sessionStatus } = useSession();
  const router = useRouter();
  const { ref, inView } = useInView();

  useEffect(() => {
    if (sessionStatus === "authenticated") {
    } else if (sessionStatus === "unauthenticated") {
      router.push("/");
    }
  }, [sessionStatus, session, router]);

  const { data, status, isFetchingNextPage, hasNextPage, fetchNextPage, refetch, isRefetching } =
    trpc.movie.infiniteMovies.useInfiniteQuery(
      {
        filter: "top_rated",
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
    <>
      <Head>
        <title>Welcome to Tracktr.</title>
      </Head>

      <div className="pt-24">
        <div className="px-4 mx-auto text-center max-w-7xl sm:px-6 lg:px-8">
          <div className="text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">Add movies</div>
          <div>
            Add movies that you&apos;ve seen by pressing the{" "}
            <span className="inline-block">
              <AiOutlineCheckCircle />
            </span>{" "}
            icon.
          </div>

          <div className="max-w-6xl min-h-screen m-auto mt-6">
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
                            score={content.vote_average}
                            watched={content.watched}
                            watched_id={content.watched_id}
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

          <div className="sticky bottom-0">
            <Link href="/welcome/series">
              <a className="w-full px-10 py-5 font-medium text-center text-white bg-gray-700 rounded-t-lg focus:ring-4 focus:outline-none sm:w-auto hover:bg-blue-700 focus:ring-blue-800">
                Next step
              </a>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default WelcomeMoviesPage;
