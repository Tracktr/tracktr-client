import { useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { ChangeEvent, useEffect, useState } from "react";
import HistoryGrid from "../../components/common/HistoryGrid";
import LoadingPageComponents from "../../components/common/LoadingPageComponents";
import ProfileHeader from "../../components/pageBlocks/ProfileHeader";
import { trpc } from "../../utils/trpc";

const HistoryPage = () => {
  const router = useRouter();
  const session = useSession();
  const [page, setPage] = useState<number>(1);
  const [input, setInput] = useState(
    JSON.stringify({
      field: "datetime",
      order: "desc",
    })
  );

  const { data, status } = trpc.profile.profileBySession.useQuery();
  const {
    data: history,
    status: historyStatus,
    refetch,
    isRefetching,
  } = trpc.profile.watchHistory.useQuery(
    { page, pageSize: 60, orderBy: JSON.parse(input) },
    { keepPreviousData: true }
  );

  useEffect(() => {
    if (session.status === "unauthenticated") {
      router.push("/");
    }
  }, [session, router]);

  const nextPage = () => {
    setPage(page + 1);
    refetch();
  };

  const previousPage = () => {
    setPage(page - 1);
    refetch();
  };

  const handleInput = (e: ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.currentTarget;
    setInput(value);
  };

  return (
    <LoadingPageComponents status={status}>
      {() => (
        <>
          <Head>
            <title>{session.data?.user?.name}&apos;s History - Tracktr.</title>
          </Head>

          <div className="max-w-6xl m-auto">
            <ProfileHeader image={String(data?.image)} name={String(data?.name)} currentPage="History" />
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

            <div className="flex my-5">
              <div>
                <label htmlFor="orderBy" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Order by
                </label>
                <select
                  id="orderBY"
                  className="border text-sm rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
                  onChange={handleInput}
                  value={input}
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
                </select>
              </div>
            </div>

            <HistoryGrid
              history={history?.history || []}
              status={isRefetching ? "loading" : historyStatus}
              refetch={refetch}
            />
          </div>
        </>
      )}
    </LoadingPageComponents>
  );
};

export default HistoryPage;
