import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import LoadingPageComponents from "../../components/common/LoadingPageComponents";
import { trpc } from "../../utils/trpc";
import Link from "next/link";
import SearchHeader from "../../components/search/SearchHeader";
import HistoryGrid from "../../components/common/HistoryGrid";
import UpNext from "../../components/common/UpNext";
import { MdOutlineNextWeek, MdOutlineWrapText, MdPeopleOutline, MdQueuePlayNext } from "react-icons/md";
import Head from "next/head";
import dynamic from "next/dynamic";
import FriendReview, { LoadingFriendReview } from "../../components/common/FriendReviews";

const DashboardChart = dynamic(() => import("../../components/common/DashboardChart"), { ssr: false });

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

  const refetch = () => {
    refetchUpNext();
    refetchHistory();
    refetchStats();
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
                  You watched {stats?.episodeAmount || 0} episodes and {stats?.movieAmount || 0} movies the past 14 days
                </div>
                <DashboardChart stats={stats} />
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
                <h2 className="mb-4 text-xl">Recently watched</h2>
                <HistoryGrid
                  hasScrollContainer
                  history={friendsData?.history || []}
                  status={friendsStatus}
                  refetch={refetchFriends}
                  inPublic
                />

                <h2 className="my-2 text-xl">Reviews</h2>

                {!friendsData?.seriesReviews[0] && !friendsData?.movieReviews[0] && <div>No reviews found</div>}
                <div className="flex flex-col md:flex-row">
                  {friendsStatus === "loading" ? (
                    <LoadingFriendReview />
                  ) : (
                    friendsData?.seriesReviews[0] && (
                      <FriendReview
                        content={friendsData?.seriesReviews[0].content}
                        created={friendsData?.seriesReviews[0].created}
                        item={friendsData?.seriesReviews[0].Series}
                        friend={friendsData?.seriesReviews[0].friend}
                      />
                    )
                  )}
                  {friendsStatus === "loading" ? (
                    <LoadingFriendReview />
                  ) : (
                    friendsData?.movieReviews[0] && (
                      <FriendReview
                        content={friendsData?.movieReviews[0].content}
                        created={friendsData?.movieReviews[0].created}
                        item={friendsData?.movieReviews[0].Movies}
                        friend={friendsData?.movieReviews[0].friend}
                      />
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </LoadingPageComponents>
    </>
  );
};

export default DashboardPage;
