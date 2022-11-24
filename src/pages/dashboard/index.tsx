import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import LoadingPageComponents from "../../components/common/LoadingPageComponents";
import { trpc } from "../../utils/trpc";
import Link from "next/link";
import SearchHeader from "../../components/search/SearchHeader";
import HistoryGrid from "../../components/common/HistoryGrid";
import UpNext from "../../components/common/UpNext";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const DashboardPage = () => {
  const router = useRouter();
  const { status: sessionStatus } = useSession();
  const {
    data: history,
    status: historyStatus,
    refetch: refetchHistory,
  } = trpc.profile.watchHistory.useQuery({ page: 1, pageSize: 6 });
  const { data: upNext, status: upNextStatus, refetch: refetchUpNext } = trpc.profile.upNext.useQuery();
  const { data: stats, status: statsStatus, refetch: refetchStats } = trpc.profile.stats.useQuery();

  useEffect(() => {
    if (sessionStatus !== "loading" && sessionStatus === "unauthenticated") {
      router.push("/");
    }
  });

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length)
      return (
        <div className="px-5 py-2 text-sm rounded-full bg-slate-500 active:border-none">{`Watched ${payload[0].value} items`}</div>
      );

    return null;
  };

  return (
    <LoadingPageComponents status={sessionStatus === "loading" ? "loading" : "success"}>
      {() => (
        <div>
          <SearchHeader
            title="things to watch"
            type="multi"
            backgroundImage="https://www.themoviedb.org/t/p/original/xMMrBziwJqrgjerqpNeQvwuwiUp.jpg"
          />
          <div className="max-w-6xl px-4 m-auto">
            {upNext?.result && upNext?.result?.length > 0 && (
              <div className="my-6">
                <div className="items-center align-middle md:flex">
                  <div className="flex flex-wrap gap-4 mb-5">
                    <div className="text-xl md:text-3xl">Up next</div>
                  </div>
                </div>
                <UpNext
                  episodes={upNext?.result || []}
                  status={upNextStatus}
                  refetchHistory={refetchHistory}
                  refetchUpNext={refetchUpNext}
                />
              </div>
            )}
            {stats?.history && stats?.history.length > 0 && (
              <div className="my-6">
                <div className="text-xl md:text-3xl">Your two weeks</div>
                <div className="pt-1 pb-5">
                  You watched watched {stats?.episodeAmount} episodes and {stats?.movieAmount} movies the past 14 days
                </div>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={stats?.history} margin={{ left: -50 }}>
                    <XAxis dataKey="date" allowDecimals={false} interval={0} />
                    <YAxis dataKey="count" allowDecimals={false} tick={false} />
                    <Bar dataKey="count" fill="#8884d8" />
                    <Tooltip content={<CustomTooltip />} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
            {history?.history && history?.history?.length > 0 && (
              <div className="my-6">
                <div className="items-center align-middle md:flex">
                  <div className="flex items-center justify-between w-full gap-4 mb-5">
                    <div className="text-xl md:text-3xl">Recently watched</div>
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
                  refetchHistory={refetchHistory}
                  refetchUpNext={refetchUpNext}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </LoadingPageComponents>
  );
};

export default DashboardPage;
