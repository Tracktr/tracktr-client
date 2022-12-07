import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import LoadingPageComponents from "../../components/common/LoadingPageComponents";
import { trpc } from "../../utils/trpc";
import Link from "next/link";
import SearchHeader from "../../components/search/SearchHeader";
import HistoryGrid from "../../components/common/HistoryGrid";
import UpNext from "../../components/common/UpNext";
import { Bar, BarChart, ResponsiveContainer, Tooltip, TooltipProps, XAxis, YAxis } from "recharts";
import { ValueType, NameType } from "recharts/types/component/DefaultTooltipContent";
import { MdOutlineNextWeek, MdOutlineWrapText, MdQueuePlayNext } from "react-icons/md";
import Head from "next/head";

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
  const { data: stats, refetch: refetchStats } = trpc.dashboard.stats.useQuery(undefined, {
    enabled: sessionStatus === "authenticated",
  });

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
                    <XAxis dataKey="date" allowDecimals={false} />
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
            </div>
          </div>
        )}
      </LoadingPageComponents>
    </>
  );
};

export default DashboardPage;
