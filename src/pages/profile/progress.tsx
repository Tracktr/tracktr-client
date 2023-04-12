import { useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import nProgress from "nprogress";
import { ChangeEvent, useEffect, useState } from "react";
import ProfileHeader from "../../components/pageBlocks/ProfileHeader";
import { trpc } from "../../utils/trpc";
import { AnimatePresence, motion } from "framer-motion";
import SeriesProgress from "../../components/progress/SeriesProgress";
import LoadingSeriesProgress from "../../components/progress/LoadingSeriesProgress";

const ProgressPage = () => {
  const router = useRouter();
  const [page, setPage] = useState<number>(1);
  const [orderInput, setOrderInput] = useState(
    JSON.stringify({
      field: "datetime",
      order: "desc",
    })
  );
  const [showFilters, setShowFilters] = useState(false);
  const { data: sessionData, status: sessionStatus } = useSession();

  useEffect(() => {
    if (sessionStatus === "unauthenticated") {
      router.push("/404");
    }
  }, [sessionStatus, router]);

  const { data, status, refetch, isFetching } = trpc.dashboard.upNext.useQuery(
    { page, pageSize: 25, orderBy: JSON.parse(orderInput) },
    {
      enabled: sessionStatus === "authenticated",
      keepPreviousData: true,
    }
  );

  useEffect(() => {
    if (isFetching) {
      typeof window !== "undefined" && nProgress.start();
    } else if (!isFetching) {
      typeof window !== "undefined" && nProgress.done();
    }
  }, [isFetching]);

  const nextPage = () => {
    setPage(page + 1);
    refetch();
  };

  const previousPage = () => {
    setPage(page - 1);
    refetch();
  };

  const handleOrderInput = (e: ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.currentTarget;
    setOrderInput(value);
    setPage(1);
  };

  if (sessionStatus === "loading") {
    typeof window !== "undefined" && nProgress.start();

    return <div className="h-screen" />;
  }

  return (
    <>
      <Head>
        <title>{sessionData?.user?.name}&apos;s Progress - Tracktr.</title>
      </Head>

      <div className="max-w-6xl pb-4 m-auto">
        <ProfileHeader
          image={String(sessionData?.user?.image)}
          name={String(sessionData?.user?.profile.username)}
          currentPage="Progress"
        />

        <div className="flex flex-col p-4 my-5 align-middle md:flex-row md:ss-center">
          <h1 className="text-3xl">Progress</h1>
          <button onClick={() => setShowFilters(!showFilters)} className="my-2 md:mr-4 md:ml-auto">
            Show filters
          </button>
          <div className="flex justify-center gap-4 mx-5 align-middle ss-center">
            <button className="text-sm disabled:text-gray-500" onClick={previousPage} disabled={page < 2}>
              Previous page
            </button>
            <div className="flex gap-4 mx-6 ss-center">
              <button onClick={previousPage} className="p-2 text-xs text-gray-200">
                {page > 1 && page - 1}
              </button>
              <div>{page}</div>
              <button onClick={nextPage} className="p-2 text-xs text-gray-200">
                {page < Number(data?.pagesAmount) && page + 1}
              </button>
            </div>
            <button
              className="text-sm disabled:text-gray-500"
              onClick={nextPage}
              disabled={page >= Number(data?.pagesAmount)}
            >
              Next page
            </button>
          </div>
        </div>

        {showFilters && <Filters handleOrderInput={handleOrderInput} orderInput={orderInput} />}

        <div className="flex flex-col gap-8">
          {status !== "loading" ? (
            data && data.result.length > 0 ? (
              <AnimatePresence mode="popLayout" initial={false}>
                {data.result.map((s) => (
                  <SeriesProgress
                    key={s.Seasons.Series.id}
                    name={s.Seasons.Series.name}
                    imageSrc={s.Seasons.Series.poster}
                    url={`/tv/${s.Seasons.Series.id}`}
                    number_of_episodes={s.number_of_episodes}
                    episodes_watched={s.episodes_watched}
                    nextEpisode={{
                      id: s.id,
                      name: s.name,
                      episode_number: s.episode_number,
                      season_number: s.season_number,
                      seasons_id: s.seasons_id,
                      datetime: s.datetime,
                    }}
                    themeColor={s.color}
                    seriesID={s.Seasons.Series.id}
                    episodeID={s.id}
                    refetch={refetch}
                  />
                ))}
              </AnimatePresence>
            ) : (
              <div>You&apos;ve finished all series!</div>
            )
          ) : (
            <LoadingSeriesProgress />
          )}
        </div>

        {(data?.result || [])?.length >= 4 && status === "success" && (
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
                {page < Number(data?.pagesAmount) && page + 1}
              </button>
            </div>
            <button
              className="text-sm disabled:text-gray-500"
              onClick={nextPage}
              disabled={page >= Number(data?.pagesAmount)}
            >
              Next page
            </button>
          </div>
        )}
      </div>
    </>
  );
};

const Filters = ({
  handleOrderInput,
  orderInput,
}: {
  handleOrderInput: (e: ChangeEvent<HTMLSelectElement>) => void;
  orderInput: string;
}) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -150, opacity: 0 }}
      transition={{ type: "spring" }}
      className="flex gap-4 p-4 mb-4"
    >
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
              field: "datetime",
              order: "desc",
            })}
          >
            Recently watched
          </option>
          <option
            value={JSON.stringify({
              field: "datetime",
              order: "asc",
            })}
          >
            Oldest watched
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
              field: "air_date",
              order: "desc",
            })}
          >
            Recently aired
          </option>
          <option
            value={JSON.stringify({
              field: "air_date",
              order: "asc",
            })}
          >
            Previously aired
          </option>
        </select>
      </div>
    </motion.div>
  );
};

export default ProgressPage;
