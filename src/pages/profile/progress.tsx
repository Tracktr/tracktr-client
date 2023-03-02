import { useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import ImageWithFallback from "../../components/common/ImageWithFallback";
import LoadingPageComponents from "../../components/common/LoadingPageComponents";
import ProfileHeader from "../../components/pageBlocks/ProfileHeader";
import EpisodePoster from "../../components/posters/EpisodePoster";
import LoadingPosters from "../../components/posters/LoadingPoster";
import ConditionalLink from "../../utils/ConditionalLink";
import { PosterImage } from "../../utils/generateImages";
import { trpc } from "../../utils/trpc";

const ProgressPage = () => {
  const router = useRouter();
  const [showFilters, setShowFilters] = useState<boolean>();
  const { data: sessionData, status: sessionStatus } = useSession();

  useEffect(() => {
    if (sessionStatus === "unauthenticated") {
      router.push("/404");
    }
  }, [sessionStatus, router]);

  const { data, status, refetch, isRefetching } = trpc.dashboard.upNext.useQuery(
    {
      page: 1,
      pageSize: 6,
    },
    { enabled: sessionStatus === "authenticated" }
  );

  return (
    <LoadingPageComponents status={sessionStatus === "authenticated" ? "success" : "loading"}>
      {() => (
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
              {/* <div className="flex justify-center gap-4 mx-5 align-middle ss-center">
                <button className="text-sm disabled:text-gray-500" onClick={previousPage} disabled={page < 2}>
                  Previous page
                </button>
                <div className="flex gap-4 mx-6 ss-center">
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
              </div> */}
            </div>

            <div className="flex flex-col gap-4">
              {status !== "loading" ? (
                data && data.result.length > 0 ? (
                  data.result.map((s) => (
                    <SeriesProgress
                      key={s.series.id}
                      id={s.id}
                      name={s.series.name}
                      imageSrc={s.series.backdrop_path}
                      url={`/tv/${s.series.id}`}
                      number_of_episodes={s.series.number_of_episodes}
                      episodes_watched={s.series.episodes_watched}
                    />
                  ))
                ) : (
                  <div>You&apos;ve finished all series!</div>
                )
              ) : (
                <LoadingPosters />
              )}
            </div>
          </div>
        </>
      )}
    </LoadingPageComponents>
  );
};

const SeriesProgress = ({
  name,
  imageSrc,
  url,
  number_of_episodes,
  episodes_watched,
}: {
  id: number;
  name: string;
  imageSrc: string;
  url: string;
  number_of_episodes: number;
  episodes_watched: number;
}) => {
  return (
    <div className="flex gap-2">
      <Link href={url}>
        <ImageWithFallback
          alt={"Still image for" + name}
          src={PosterImage({ path: imageSrc, size: "md" })}
          width={300}
          height={168}
          className="rounded w-[300px] h-[168px]"
        />
      </Link>
      <div>
        <Link href={url} className="text-xl font-bold">
          {name}
        </Link>
        <div>
          Watched {episodes_watched} of {number_of_episodes} episodes
        </div>
      </div>
    </div>
  );
};

export default ProgressPage;
