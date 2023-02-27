import { useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { AiOutlineCheckCircle } from "react-icons/ai";
import LoadingPageComponents from "../../components/common/LoadingPageComponents";
import { PosterGrid } from "../../components/common/PosterGrid";
import { LoadingPoster } from "../../components/posters/LoadingPoster";
import { trpc } from "../../utils/trpc";
import { useInView } from "react-intersection-observer";
import Link from "next/link";
import TVPoster from "../../components/posters/TVPoster";
import { InfiniteShow } from "../../components/infiniteScroll/TVInfiniteScroll";

const WelcomeSeriesPage = () => {
  const { data: session, status: sessionStatus } = useSession();
  const router = useRouter();
  const { ref, inView } = useInView();

  useEffect(() => {
    if (sessionStatus === "unauthenticated") {
      router.push("/404");
    }
  }, [sessionStatus, session, router]);

  const { data, status, isFetchingNextPage, hasNextPage, fetchNextPage, refetch, isRefetching } =
    trpc.tv.infiniteTV.useInfiniteQuery(
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
          <div className="text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">Add series</div>
          <div>
            Add series that you&apos;ve seen by pressing the{" "}
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
                      page.results.map((content: InfiniteShow) => {
                        return (
                          <TVPoster
                            id={content.id}
                            imageSrc={`${content.poster_path}`}
                            name={content.name}
                            key={content.id}
                            score={content.vote_average}
                            watched={content.watched}
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
            <Link
              href="/welcome/end"
              className="w-full px-10 py-5 font-medium text-center text-white bg-gray-700 rounded-t-lg focus:ring-4 focus:outline-none sm:w-auto hover:bg-blue-700 focus:ring-blue-800"
            >
              Next step
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default WelcomeSeriesPage;
