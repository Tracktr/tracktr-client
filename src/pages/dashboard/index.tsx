import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import LoadingPageComponents from "../../components/common/LoadingPageComponents";
import { trpc } from "../../utils/trpc";
import Link from "next/link";
import SearchHeader from "../../components/search/SearchHeader";
import HistoryGrid from "../../components/common/HistoryGrid";

const DashboardPage = () => {
  const router = useRouter();
  const { status: sessionStatus } = useSession();
  const { data: history, status: historyStatus } = trpc.profile.watchHistory.useQuery(
    { page: 1, pageSize: 6 },
    { keepPreviousData: true }
  );

  useEffect(() => {
    if (sessionStatus !== "loading" && sessionStatus === "unauthenticated") {
      router.push("/");
    }
  });

  return (
    <LoadingPageComponents status={sessionStatus === "loading" ? "loading" : "success"}>
      {() => (
        <div>
          <SearchHeader
            title="things to watch"
            type="multi"
            backgroundImage="https://www.themoviedb.org/t/p/original/xMMrBziwJqrgjerqpNeQvwuwiUp.jpg"
          />
          <div className="max-w-6xl m-auto">
            <div className="items-center mt-6 align-middle md:flex">
              <div className="flex gap-4">
                <div className="text-3xl">Recently watched</div>
                <Link href="/profile/history">
                  <a className="flex items-center px-3 py-1 rounded-full bg-primary text-primaryBackground">
                    See all history
                  </a>
                </Link>
              </div>
            </div>
            <HistoryGrid history={history?.history || []} status={historyStatus} />
          </div>
        </div>
      )}
    </LoadingPageComponents>
  );
};

export default DashboardPage;
