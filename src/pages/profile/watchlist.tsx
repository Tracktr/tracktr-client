import { AnimatePresence, motion } from "framer-motion";
import { useSession } from "next-auth/react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { ChangeEvent, useEffect, useState } from "react";
import { AiOutlineCheckCircle, AiOutlineCloseCircle } from "react-icons/ai";
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
  const [orderInput, setOrderInput] = useState(
    JSON.stringify({
      field: "created",
      order: "desc",
    })
  );
  const [filterInput, setFilterInput] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const { data, status } = trpc.profile.profileBySession.useQuery();
  const {
    data: watchlist,
    status: watchlistStatus,
    refetch,
    isRefetching,
  } = trpc.watchlist.getUserWatchlist.useQuery(
    { page, pageSize: 25, orderBy: JSON.parse(orderInput), filter: filterInput },
    { keepPreviousData: true }
  );

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

  const markAsWatched = trpc.movie.markMovieAsWatched.useMutation({
    onSuccess: () => refetch(),
  });

  const deleteFromWatched = trpc.movie.removeMovieFromWatched.useMutation({
    onSuccess: () => {
      refetch();
    },
  });

  const handleOrderInput = (e: ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.currentTarget;
    setOrderInput(value);
  };

  const handleFilterInput = (e: ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.currentTarget;
    setFilterInput(value);
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
        <>
          <Head>
            <title>{session.data?.user?.name}&apos;s Watchlist - Tracktr.</title>
          </Head>
          <div className="max-w-6xl m-auto">
            <ProfileHeader image={String(data?.image)} name={String(data?.name)} currentPage="Watchlist" />
            <div className="items-center my-5 align-middle md:flex">
              <h1 className="text-3xl">Watchlist</h1>
              <button onClick={() => setShowFilters(!showFilters)} className=" md:mr-4 md:ml-auto">
                Show filters
              </button>
              <div className="flex items-center justify-center gap-4 mx-5 align-middle">
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

            {showFilters && (
              <div className="flex gap-4 my-10">
                <div className="w-full">
                  <label htmlFor="orderBy" className="block mb-2 text-sm font-medium text-white">
                    Order by
                  </label>
                  <select
                    id="orderBY"
                    className="border text-sm rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
                    onChange={handleOrderInput}
                    value={orderInput}
                  >
                    <option
                      value={JSON.stringify({
                        field: "created",
                        order: "desc",
                      })}
                    >
                      Recently added
                    </option>
                    <option
                      value={JSON.stringify({
                        field: "created",
                        order: "asc",
                      })}
                    >
                      Oldest added
                    </option>
                    <option
                      value={JSON.stringify({
                        field: "title",
                        order: "asc",
                      })}
                    >
                      Title
                    </option>
                    <option
                      value={JSON.stringify({
                        field: "date",
                        order: "desc",
                      })}
                    >
                      Recently aired
                    </option>
                    <option
                      value={JSON.stringify({
                        field: "date",
                        order: "asc",
                      })}
                    >
                      Previously aired
                    </option>
                  </select>
                </div>

                <div className="w-full">
                  <label htmlFor="Filter" className="block mb-2 text-sm font-medium text-white">
                    Filter
                  </label>
                  <select
                    onChange={handleFilterInput}
                    value={filterInput}
                    id="filter"
                    className="border  text-sm rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">No filter</option>
                    <option value="movies">Hide series</option>
                    <option value="series">Hide movies</option>
                    <option value="watched">Hide watched</option>
                    <option value="notwatched">Hide not watched</option>
                  </select>
                </div>
              </div>
            )}

            {watchlist?.WatchlistItem && watchlist.WatchlistItem.length > 0 ? (
              <PosterGrid hasScrollContainer={false}>
                <AnimatePresence mode="popLayout" initial={false}>
                  {watchlist.WatchlistItem.map((item: any) => {
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
                        <div className="flex pt-1 text-gray-500 transition-all duration-300 ease-in-out opacity-25 group-hover:opacity-100">
                          {item.movie_id &&
                            ((markAsWatched.isLoading || deleteFromWatched.isLoading || isRefetching) &&
                            item.movies.id === currentLoadingID ? (
                              <ImSpinner2 className="w-6 h-6 animate-spin" />
                            ) : (
                              <button
                                disabled={markAsWatched.isLoading || deleteFromWatched.isLoading}
                                className={`text-2xl transition-all duration-300 ease-in-out ${
                                  item.watched ? "hover:text-red-500" : "hover:text-white"
                                }`}
                                onClick={() => {
                                  if (item.watched && item.watched_id) {
                                    setCurrentLoadingID(item.movies.id);
                                    deleteFromWatched.mutate({ id: item.watched_id });
                                  } else {
                                    setCurrentLoadingID(item.movies.id);
                                    markAsWatched.mutate({
                                      movieId: item.movies.id,
                                    });
                                  }
                                }}
                              >
                                {item.watched ? (
                                  <MdDelete className="text-2xl" />
                                ) : (
                                  <AiOutlineCheckCircle className="text-2xl" />
                                )}
                              </button>
                            ))}
                          {(deleteItem.isLoading || markAsWatched.isLoading) && item.id === currentLoadingID ? (
                            <ImSpinner2 className="w-6 h-6 animate-spin" />
                          ) : (
                            <button
                              className="ml-auto text-3xl transition-all duration-300 ease-in-out hover:text-red-700"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleDelete(item.id);
                              }}
                              title="Remove from watchlist"
                            >
                              <AiOutlineCloseCircle className="text-2xl" />
                            </button>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </PosterGrid>
            ) : (
              <div>Nothing on your watchlist</div>
            )}

            {(watchlist?.WatchlistItem || [])?.length > 6 && !isRefetching && status === "success" && (
              <div className="flex items-center justify-center gap-4 m-5 align-middle">
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
            )}
          </div>
        </>
      )}
    </LoadingPageComponents>
  );
};

export default WatchlistPage;
