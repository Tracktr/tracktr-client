import { AnimatePresence, motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import LoadingPageComponents from "../../components/common/LoadingPageComponents";
import { PosterGrid } from "../../components/common/PosterGrid";
import ProfileHeader from "../../components/pageBlocks/ProfileHeader";
import MoviePoster from "../../components/posters/MoviePoster";
import TVPoster from "../../components/posters/TVPoster";
import { trpc } from "../../utils/trpc";

const WatchlistPage = () => {
  const router = useRouter();
  const session = useSession();
  const [page, setPage] = useState<number>(1);
  const { data, status } = trpc.profile.profileBySession.useQuery();
  const {
    data: watchlist,
    status: watchlistStatus,
    refetch,
    isRefetching,
  } = trpc.watchlist.getUserWatchlist.useQuery({ page, pageSize: 50 }, { keepPreviousData: true });

  useEffect(() => {
    if (session.status === "unauthenticated") {
      router.push("/");
    }
  }, [session, router]);

  const nextPage = () => {
    setPage(page + 1);
    refetch();
  };

  const previousPage = () => {
    setPage(page - 1);
    refetch();
  };

  return (
    <LoadingPageComponents
      status={
        session.status === "authenticated" && status === "success" && watchlistStatus === "success"
          ? "success"
          : "loading"
      }
    >
      {() => (
        <div className="max-w-6xl m-auto">
          <ProfileHeader image={String(data?.image)} name={String(data?.name)} />
          <div className="items-center my-5 align-middle md:flex">
            <h1 className="text-3xl">Watchlist</h1>
            <div className="flex items-center justify-center gap-4 mx-5 ml-auto align-middle">
              <button className="text-sm disabled:text-gray-500" onClick={previousPage} disabled={page < 2}>
                Previous page
              </button>
              <div className="flex items-center gap-4 mx-6">
                <button onClick={previousPage} className="p-2 text-xs text-gray-200">
                  {page > 1 && page - 1}
                </button>
                <div>{page}</div>
                <button onClick={nextPage} className="p-2 text-xs text-gray-200">
                  {page < Number(watchlist?.pagesAmount) && page + 1}
                </button>
              </div>
              <button
                className="text-sm disabled:text-gray-500"
                onClick={nextPage}
                disabled={page >= Number(watchlist?.pagesAmount)}
              >
                Next page
              </button>
            </div>
          </div>
          <PosterGrid hasScrollContainer={false}>
            <AnimatePresence mode="popLayout" initial={false}>
              {watchlist?.WatchlistItem &&
                watchlist.WatchlistItem.map((item) => {
                  return (
                    <motion.div
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -150, opacity: 0 }}
                      transition={{ type: "spring" }}
                      className="relative w-[170px] group"
                      key={item.id}
                    >
                      {watchlist.WatchlistItem &&
                        watchlist.WatchlistItem.map((item) => {
                          if (item.series_id) {
                            return (
                              <TVPoster
                                imageSrc={`${item.series?.poster}`}
                                name={String(item.series?.name)}
                                key={item.series?.id}
                                url={`/tv/${item.series?.id}`}
                              />
                            );
                          }

                          if (item.movie_id) {
                            return (
                              <MoviePoster
                                id={Number(item.movies?.id)}
                                imageSrc={`${item.movies?.poster}`}
                                name={String(item.movies?.title)}
                                key={item.movies?.id}
                                url={`/movies/${item.movies?.id}`}
                                watched={null}
                                watched_id={null}
                                refetch={refetch}
                                fetchStatus={isRefetching}
                              />
                            );
                          }
                        })}
                    </motion.div>
                  );
                })}
            </AnimatePresence>
          </PosterGrid>
        </div>
      )}
    </LoadingPageComponents>
  );
};

export default WatchlistPage;
