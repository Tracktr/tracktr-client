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

const DashboardPage = () => {
  const router = useRouter();
  const { status: sessionStatus } = useSession();
  const {
    data: history,
    status: historyStatus,
    refetch: refetchHistory,
  } = trpc.profile.watchHistory.useQuery({ page: 1, pageSize: 6 });
  const { data: upNext, status: upNextStatus, refetch: refetchUpNext } = trpc.profile.upNext.useQuery();
  const { data: stats, refetch: refetchStats } = trpc.profile.stats.useQuery();

  useEffect(() => {
    if (sessionStatus !== "loading" && sessionStatus === "unauthenticated") {
      router.push("/");
    }
  });

  const CustomTooltip = ({ active, payload }: TooltipProps<ValueType, NameType>) => {
    if (active && payload && payload.length)
      return (
        <div className="px-5 py-2 text-sm text-black rounded-full shadow-xl bg-primary active:border-none">{`Watched ${
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
    <LoadingPageComponents status={sessionStatus === "authenticated" ? "success" : "loading"}>
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
                <UpNext episodes={upNext?.result || []} status={upNextStatus} refetch={refetch} />
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
                    <XAxis dataKey="date" allowDecimals={false} />
                    <YAxis dataKey="count" allowDecimals={false} tick={false} />
                    <Bar dataKey="count" fill="#f9bd13" />
                    <Tooltip cursor={false} content={<CustomTooltip />} />
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
                  refetch={refetch}
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
