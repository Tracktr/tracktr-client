import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import HistoryGrid from "../../components/common/HistoryGrid";
import LoadingPageComponents from "../../components/common/LoadingPageComponents";
import ProfileHeader from "../../components/pageBlocks/ProfileHeader";
import { trpc } from "../../utils/trpc";

const HistoryPage = () => {
  const router = useRouter();
  const session = useSession();
  const [page, setPage] = useState<number>(1);
  const { data, status } = trpc.profile.profileBySession.useQuery();
  const {
    data: history,
    status: historyStatus,
    refetch,
  } = trpc.profile.watchHistory.useQuery({ page, pageSize: 50 }, { keepPreviousData: true });

  useEffect(() => {
    if (session.status === "unauthenticated" && status !== "loading") {
      router.push("/");
    }
  });

  const nextPage = () => {
    setPage(page + 1);
    refetch();
  };

  const previousPage = () => {
    setPage(page - 1);
    refetch();
  };

  return (
    <LoadingPageComponents status={status}>
      {() => (
        <div className="max-w-6xl m-auto">
          <ProfileHeader image={data?.image} name={data?.name} />
          <div className="items-center my-5 align-middle md:flex">
            <h1 className="text-3xl">History</h1>
            <div className="flex items-center justify-center gap-4 mx-5 ml-auto align-middle">
              <button className="text-sm disabled:text-gray-500" onClick={previousPage} disabled={page < 2}>
                Previous page
              </button>
              <div className="flex items-center gap-4 mx-6">
                <button onClick={previousPage} className="p-2 text-xs text-gray-200">
                  {page > 1 && page - 1}
                </button>
                <div>{page}</div>
                <button onClick={nextPage} className="p-2 text-xs text-gray-200">
                  {page < Number(history?.pagesAmount) && page + 1}
                </button>
              </div>
              <button
                className="text-sm disabled:text-gray-500"
                onClick={nextPage}
                disabled={page >= Number(history?.pagesAmount)}
              >
                Next page
              </button>
            </div>
          </div>
          <HistoryGrid history={history?.history || []} status={historyStatus} />
        </div>
      )}
    </LoadingPageComponents>
  );
};

export default HistoryPage;
