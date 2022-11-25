import { AnimatePresence, motion } from "framer-motion";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { ImSpinner2 } from "react-icons/im";
import { MdDelete } from "react-icons/md";
import LoadingPageComponents from "../../components/common/LoadingPageComponents";
import { PosterGrid } from "../../components/common/PosterGrid";
import ProfileHeader from "../../components/pageBlocks/ProfileHeader";
import { PosterImage } from "../../utils/generateImages";
import { trpc } from "../../utils/trpc";

const WatchlistPage = () => {
  const [currentLoadingID, setCurrentLoadingID] = useState<string | undefined>();

  const router = useRouter();
  const session = useSession();
  const [page, setPage] = useState<number>(1);

  const { data, status } = trpc.profile.profileBySession.useQuery();
  const {
    data: watchlist,
    status: watchlistStatus,
    refetch,
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

  const deleteItem = trpc.watchlist.removeItem.useMutation({
    onMutate: (e) => {
      setCurrentLoadingID(e.id);
    },
    onSuccess: () => {
      refetch();
    },
  });

  const handleDelete = (id: string) => {
    deleteItem.mutate({ id });
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
                      <Link href={item?.movie_id ? `/movies/${item.movie_id}` : `/tv/${item.series_id}`}>
                        <a className="relative w-[170px] group">
                          <Image
                            alt={`Poster image for ${item?.movie_id ? item.movies?.title : item.series?.name}`}
                            src={PosterImage({
                              path: item.movie_id ? String(item.movies?.poster) : String(item.series?.poster),
                              size: "sm",
                            })}
                            width="170px"
                            height="240px"
                            className="rounded"
                          />
                          <div>
                            <span className="w-full text-xs truncate line-clamp-2">
                              {item?.movie_id ? item.movies?.title : item.series?.name}
                            </span>
                          </div>
                        </a>
                      </Link>
                      <div className="pt-1 text-gray-500 transition-all duration-300 ease-in-out opacity-25 group-hover:opacity-100">
                        {deleteItem.isLoading && item.id === currentLoadingID ? (
                          <ImSpinner2 className="w-6 h-6 animate-spin" />
                        ) : (
                          <button
                            className="text-3xl transition-all duration-300 ease-in-out hover:text-red-700"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleDelete(item.id);
                            }}
                            title="Remove from watchlist"
                          >
                            <MdDelete className="text-2xl" />
                          </button>
                        )}
                      </div>
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
