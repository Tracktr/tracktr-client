import { useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import nProgress from "nprogress";
import { ChangeEvent, useEffect, useState } from "react";
import ImageWithFallback from "../../components/common/ImageWithFallback";
import ProfileHeader from "../../components/pageBlocks/ProfileHeader";
import LoadingPosters from "../../components/posters/LoadingPoster";
import { IThemeColor } from "../../components/watchButton/BaseWatchButton";
import { PosterImage } from "../../utils/generateImages";
import { trpc } from "../../utils/trpc";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "react-toastify";
import { IoIosAdd, IoMdInformation } from "react-icons/io";
import { ImSpinner2 } from "react-icons/im";
import { AiOutlineCheckCircle } from "react-icons/ai";

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
                    key={s.series.id}
                    name={s.series.name}
                    imageSrc={s.series.backdrop_path}
                    url={`/tv/${s.series.id}`}
                    number_of_episodes={s.series.number_of_episodes}
                    episodes_watched={s.series.episodes_watched}
                    nextEpisode={{
                      id: s.id,
                      name: s.name,
                      episode_number: s.episode_number,
                      season_number: s.season_number,
                      seasons_id: s.seasons_id,
                      datetime: s.datetime,
                    }}
                    themeColor={s.color}
                    seriesID={s.series.id}
                    episodeID={s.id}
                    refetch={refetch}
                  />
                ))}
              </AnimatePresence>
            ) : (
              <div>You&apos;ve finished all series!</div>
            )
          ) : (
            <LoadingPosters />
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

const SeriesProgress = ({
  name,
  imageSrc,
  url,
  number_of_episodes,
  episodes_watched,
  nextEpisode,
  themeColor,
  seriesID,
  episodeID,
  refetch,
}: {
  name: string;
  imageSrc: string;
  url: string;
  number_of_episodes: number;
  episodes_watched: number;
  nextEpisode: {
    id: number;
    name: string;
    episode_number: number;
    season_number: number;
    seasons_id: number;
    datetime: Date;
  };
  themeColor: IThemeColor;
  seriesID: number;
  episodeID: number;
  refetch: () => void;
}) => {
  const percent = Math.ceil((episodes_watched / number_of_episodes) * 100);
  const markAsWatched = trpc.episode.markEpisodeAsWatched.useMutation({
    onSuccess: () => {
      toast(`Marked ${name} episode ${nextEpisode.episode_number} as watched`, {
        icon: <IoIosAdd className="text-3xl text-green-500" />,
      });
      refetch();
    },
    onError: () => {
      toast("Failed to mark episode as watched", {
        icon: <IoMdInformation className="text-3xl text-blue-500" />,
      });
    },
  });

  return (
    <motion.div
      layout
      initial={{ opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -150, opacity: 0 }}
      transition={{ type: "spring" }}
      className="flex flex-col gap-2 mx-4 md:flex-row group"
    >
      <Link href={url} className="flex justify-center md:block">
        <ImageWithFallback
          alt={"Still image for" + name}
          src={PosterImage({ path: imageSrc, size: "md" })}
          width={300}
          height={168}
          className="rounded-t rounded-b md:rounded-b-none w-[300px] h-[168px]"
        />
        <div className="hidden md:flex bg-[#343434] rounded-b-full">
          <span
            className="h-4 duration-300 ease-in-out rounded-b-full tra8sition-all bg-primary"
            style={{
              width: `${percent}%`,
            }}
          />
        </div>
      </Link>

      <div className="md:hidden flex bg-[#343434] rounded-full">
        <span
          className={`h-6 ${
            percent > 10 ? "text-black" : "text-white"
          } transition-all duration-300 ease-in-out rounded-full bg-primary`}
          style={{
            width: `${Math.ceil((episodes_watched / number_of_episodes) * 100)}%`,
          }}
        >
          <span className="pl-4">{percent}%</span>
        </span>
      </div>

      <div>
        <Link href={url} className="text-xl font-bold">
          {name}
        </Link>
        <div>
          Watched <span className="font-bold">{episodes_watched}</span> of{" "}
          <span className="font-bold">{number_of_episodes}</span> episodes{" "}
          <span className="hidden md:inline-block">({percent}%)</span>, leaving{" "}
          <span className="font-bold">{number_of_episodes - episodes_watched}</span> episodes left to watch. Last
          episode watched on{" "}
          {nextEpisode.datetime &&
            nextEpisode.datetime.toLocaleString("en-UK", {
              dateStyle: "long",
              timeStyle: "medium",
            })}
          .
        </div>
        <div className="mt-4">
          <div>Up next:</div>
          <Link
            href={`${url}/season/${nextEpisode.season_number}/episode/${nextEpisode.episode_number}`}
            className="flex items-center mt-1"
          >
            <span
              style={{
                background: themeColor?.hex,
              }}
              className={`
                    px-3 py-1 mr-2 rounded-full
                    ${themeColor.isDark && "text-white"}
                    ${themeColor.isLight && "text-primaryBackground"}
                  `}
            >
              {nextEpisode.season_number}x{nextEpisode.episode_number}
            </span>
            {nextEpisode.name}
          </Link>
          <div className="flex pt-1 mt-auto mb-4">
            <button
              disabled={markAsWatched.isLoading}
              className="text-2xl transition-all duration-300 ease-in-out "
              onClick={() => {
                markAsWatched.mutate({
                  episodeID,
                  seriesID,
                });
              }}
            >
              {markAsWatched.isLoading ? (
                <ImSpinner2 className="w-6 h-6 animate-spin" />
              ) : (
                <AiOutlineCheckCircle className="text-gray-500 text-opacity-100 hover:text-green-500" />
              )}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
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
