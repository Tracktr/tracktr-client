import { useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import nProgress from "nprogress";
import { ChangeEvent, useEffect, useState } from "react";
import ExportButton from "../../components/common/buttons/ExportButton";
import HistoryGrid from "../../components/common/HistoryGrid";
import ProfileHeader from "../../components/pageBlocks/ProfileHeader";
import { trpc } from "../../utils/trpc";
import { keepPreviousData } from "@tanstack/react-query";

const HistoryPage = () => {
  const router = useRouter();
  const session = useSession();
  const [page, setPage] = useState<number>(1);
  const [orderInput, setOrderInput] = useState(
    JSON.stringify({
      field: "datetime",
      order: "desc",
    }),
  );
  const [filterInput, setFilterInput] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const {
    data: history,
    status: historyStatus,
    refetch,
    isRefetching,
    isFetching,
  } = trpc.profile.watchHistory.useQuery(
    { page, pageSize: 60, orderBy: JSON.parse(orderInput), filter: filterInput },
    { enabled: session.status === "authenticated", placeholderData: keepPreviousData },
  );

  useEffect(() => {
    if (session.status === "unauthenticated") {
      router.push("/404");
    }
  }, [session, router]);

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

  const handleFilterInput = (e: ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.currentTarget;
    setFilterInput(value);
    setPage(1);
  };

  if (session.status === "loading") {
    typeof window !== "undefined" && nProgress.start();

    return <div className="h-screen" />;
  }

  return (
    <>
      <Head>
        <title>{session.data?.user?.name}&apos;s History - Tracktr.</title>
      </Head>

      <div className="max-w-6xl m-auto">
        <ProfileHeader
          image={String(session.data?.user?.image)}
          name={String(session.data?.user?.profile.username)}
          currentPage="History"
        />

        <div className="flex flex-col gap-2 p-4 my-5 align-middle md:flex-row md:items-center">
          <h1 className="text-3xl">History</h1>

          <ExportButton />
          <button onClick={() => setShowFilters(!showFilters)} className="my-2">
            Show filters
          </button>
          <div className="flex items-center justify-center gap-4 mx-5 align-middle">
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

        {showFilters && (
          <Filters
            filterInput={filterInput}
            handleFilterInput={handleFilterInput}
            handleOrderInput={handleOrderInput}
            orderInput={orderInput}
          />
        )}

        <div className="p-4">
          <HistoryGrid
            history={history?.history || []}
            status={historyStatus}
            refetch={refetch}
            isRefetching={isRefetching}
          />
        </div>

        {(history?.history || [])?.length > 6 && !isRefetching && historyStatus === "success" && (
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
        )}
      </div>
    </>
  );
};

const Filters = ({
  handleFilterInput,
  handleOrderInput,
  orderInput,
  filterInput,
}: {
  handleFilterInput: (e: ChangeEvent<HTMLSelectElement>) => void;
  handleOrderInput: (e: ChangeEvent<HTMLSelectElement>) => void;
  orderInput: string;
  filterInput: string;
}) => {
  return (
    <div className="flex gap-4 p-4 mb-4">
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
              field: "date",
              order: "desc",
            })}
          >
            Recently aired
          </option>
          <option
            value={JSON.stringify({
              field: "date",
              order: "asc",
            })}
          >
            Previously aired
          </option>
        </select>
      </div>

      <div className="w-full">
        <label htmlFor="Filter" className="block mb-2 text-sm font-medium text-white">
          Filter
        </label>
        <select
          onChange={handleFilterInput}
          value={filterInput}
          id="filter"
          className="border  text-sm rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">No filter</option>
          <option value="movies">Hide Episodes</option>
          <option value="episodes">Hide Movies</option>
        </select>
      </div>
    </div>
  );
};

export default HistoryPage;
