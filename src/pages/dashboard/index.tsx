import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import LoadingPageComponents from "../../components/common/LoadingPageComponents";
import { trpc } from "../../utils/trpc";
import Link from "next/link";
import SearchHeader from "../../components/search/SearchHeader";
import HistoryGrid from "../../components/common/HistoryGrid";
import UpNext from "../../components/common/UpNext";
import { Bar, BarChart, ResponsiveContainer, Text, Tooltip, TooltipProps, XAxis, YAxis } from "recharts";
import { ValueType, NameType } from "recharts/types/component/DefaultTooltipContent";
import { MdOutlineNextWeek, MdOutlineWrapText, MdPeopleOutline, MdQueuePlayNext } from "react-icons/md";
import Head from "next/head";
import { PosterImage } from "../../utils/generateImages";
import Image from "next/image";
import ImageWithFallback from "../../components/common/ImageWithFallback";

const DashboardPage = () => {
  const router = useRouter();
  const { status: sessionStatus } = useSession();
  const {
    data: history,
    status: historyStatus,
    refetch: refetchHistory,
  } = trpc.profile.watchHistory.useQuery(
    {
      page: 1,
      pageSize: 6,
      orderBy: {
        field: "datetime",
        order: "desc",
      },
    },
    { enabled: sessionStatus === "authenticated" }
  );
  const {
    data: upNext,
    status: upNextStatus,
    refetch: refetchUpNext,
  } = trpc.dashboard.upNext.useQuery(undefined, { enabled: sessionStatus === "authenticated" });
  const { data: stats, refetch: refetchStats } = trpc.dashboard.stats.useQuery(
    { timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone },
    {
      enabled: sessionStatus === "authenticated",
    }
  );
  const {
    data: friendsData,
    status: friendsStatus,
    refetch: refetchFriends,
  } = trpc.dashboard.friendsActivity.useQuery(undefined, { enabled: sessionStatus === "authenticated" });

  useEffect(() => {
    if (sessionStatus !== "loading" && sessionStatus === "unauthenticated") {
      router.push("/");
    }
  });

  const CustomTooltip = ({ active, payload }: TooltipProps<ValueType, NameType>) => {
    if (active && payload && payload.length)
      return (
        <div className="px-5 py-2 text-sm text-black rounded-full shadow-xl outline-none bg-primary active:border-none">{`Watched ${
          payload[0] !== undefined && payload[0].value
        } items`}</div>
      );

    return null;
  };

  const refetch = () => {
    refetchUpNext();
    refetchHistory();
    refetchStats();
  };

  const CustomXAxisTick = ({ x, y, payload }: any) => {
    if (payload && payload.value && payload.value !== "auto") {
      return (
        <Text fontSize={"0.5rem"} width={"0.5rem"} x={x} y={y} textAnchor="middle" verticalAnchor="start">
          {payload.value.toLocaleDateString("en-UK", {
            month: "2-digit",
            day: "numeric",
          })}
        </Text>
      );
    }
    return null;
  };

  return (
    <>
      <Head>
        <title>Dashboard - Tracktr.</title>
      </Head>

      <LoadingPageComponents status={sessionStatus === "authenticated" ? "success" : "loading"}>
        {() => (
          <div>
            <SearchHeader
              title="things to watch"
              type="multi"
              backgroundImage="https://www.themoviedb.org/t/p/original/xMMrBziwJqrgjerqpNeQvwuwiUp.jpg"
            />
            <div className="max-w-6xl px-4 m-auto">
              <div className="mt-6 mb-12">
                <div className="items-center align-middle md:flex">
                  <div className="flex flex-wrap gap-4 mb-5">
                    <div className="flex items-center text-xl align-middle md:text-3xl">
                      <MdQueuePlayNext className="mr-4" />
                      Up next
                    </div>
                  </div>
                </div>
                <UpNext episodes={upNext?.result || []} status={upNextStatus} refetch={refetch} />
              </div>

              <div className="mt-6 mb-12">
                <div className="flex items-center text-xl align-middle md:text-3xl">
                  <MdOutlineNextWeek className="mr-4" />
                  Your last two weeks
                </div>
                <div className="pt-1 pb-5">
                  You watched {stats?.episodeAmount} episodes and {stats?.movieAmount} movies the past 14 days
                </div>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={stats?.history} margin={{ left: -50 }}>
                    <XAxis dataKey="date" allowDecimals={false} interval={0} tick={<CustomXAxisTick />} />
                    <YAxis dataKey="count" allowDecimals={false} tick={false} />
                    <Bar dataKey="count" fill="#f9bd13" />
                    <Tooltip wrapperStyle={{ outline: "none" }} cursor={false} content={<CustomTooltip />} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="my-6">
                <div className="items-center align-middle md:flex">
                  <div className="flex items-center justify-between w-full gap-4 mb-5">
                    <div className="flex items-center justify-center text-xl md:text-3xl">
                      <MdOutlineWrapText className="mr-4" />
                      Recently watched
                    </div>
                    <Link href="/profile/history">
                      <a className="items-center px-3 py-1 text-xs text-center rounded-full bg-primary text-primaryBackground">
                        See all history
                      </a>
                    </Link>
                  </div>
                </div>
                <HistoryGrid
                  hasScrollContainer
                  history={history?.history || []}
                  status={historyStatus}
                  refetch={refetch}
                />
              </div>
              <div className="my-6">
                <div className="items-center align-middle md:flex">
                  <div className="flex items-center justify-between w-full gap-4 mb-5">
                    <div className="flex items-center justify-center text-xl md:text-3xl">
                      <MdPeopleOutline className="mr-4" />
                      Friend activity
                    </div>
                  </div>
                </div>
                {(friendsData?.history || []).length < 1 &&
                  (friendsData?.movieReviews || []).length < 1 &&
                  (friendsData?.seriesReviews || []).length < 1 && (
                    <div>Your friends haven&apos;t done anyting yet!</div>
                  )}
                {(friendsData?.history || []).length > 0 && (
                  <>
                    <h2 className="mb-4 text-xl">Recently watched</h2>
                    <HistoryGrid
                      hasScrollContainer
                      history={friendsData?.history || []}
                      status={friendsStatus}
                      refetch={refetchFriends}
                      inPublic
                    />
                  </>
                )}

                {((friendsData?.movieReviews || []).length > 0 || (friendsData?.seriesReviews || []).length > 0) && (
                  <>
                    <h2 className="my-2 text-xl">Reviews</h2>
                    <div className="flex flex-col md:flex-row">
                      {friendsData?.seriesReviews[0] && (
                        <div className="flex items-center w-full gap-2 mb-4">
                          <Link href={`/tv/${friendsData?.seriesReviews[0]?.Series.id}#reviews`}>
                            <a>
                              <Image
                                alt={"Poster image for:" + friendsData?.seriesReviews[0]?.Series.name}
                                width="100"
                                height="150"
                                src={PosterImage({ path: friendsData?.seriesReviews[0]?.Series.poster, size: "lg" })}
                              />
                            </a>
                          </Link>
                          <div>
                            <Link href={`/profile/${friendsData?.seriesReviews[0].friend.name}`}>
                              <a className="flex items-center gap-2">
                                <ImageWithFallback
                                  src={friendsData?.seriesReviews[0].friend.image}
                                  fallbackSrc="/placeholder_profile.png"
                                  width="16"
                                  height="16"
                                  alt="Profile picture"
                                  className="rounded-full"
                                />
                                <p className="text-sm">{friendsData?.seriesReviews[0].friend.name}</p>
                              </a>
                            </Link>
                            <p className="text-xl">{friendsData?.seriesReviews[0]?.Series.name}</p>
                            <div className="mb-4 text-sm">
                              {friendsData?.seriesReviews[0].created.toLocaleString("en-UK", {
                                dateStyle: "medium",
                                timeStyle: "short",
                              })}
                            </div>
                            <div>{friendsData?.seriesReviews[0].content}</div>
                          </div>
                        </div>
                      )}
                      {(friendsData?.movieReviews || []).length > 0 && (
                        <div className="flex items-center w-full gap-2 mb-4">
                          <Link href={`/movies/${friendsData?.movieReviews[0]?.Movies.id}#reviews`}>
                            <a>
                              <Image
                                alt={"Poster image for:" + friendsData?.movieReviews[0]?.Movies.title}
                                width="100"
                                height="150"
                                src={PosterImage({ path: friendsData?.movieReviews[0]?.Movies.poster, size: "lg" })}
                              />
                            </a>
                          </Link>
                          <div>
                            <Link href={`/profile/${friendsData?.movieReviews[0].friend.name}`}>
                              <a className="flex items-center gap-2">
                                <ImageWithFallback
                                  src={friendsData?.movieReviews[0].friend.image}
                                  fallbackSrc="/placeholder_profile.png"
                                  width="16"
                                  height="16"
                                  alt="Profile picture"
                                  className="rounded-full"
                                />
                                <p className="text-sm">{friendsData?.movieReviews[0].friend.name}</p>
                              </a>
                            </Link>
                            <p className="text-xl">{friendsData?.movieReviews[0]?.Movies.title}</p>
                            <div className="mb-4 text-sm">
                              {friendsData?.movieReviews[0].created.toLocaleString("en-UK", {
                                dateStyle: "medium",
                                timeStyle: "short",
                              })}
                            </div>
                            <div>{friendsData?.movieReviews[0].content}</div>
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </LoadingPageComponents>
    </>
  );
};

export default DashboardPage;
