import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import LoadingPageComponents from "../../components/common/LoadingPageComponents";
import { trpc } from "../../utils/trpc";
import Link from "next/link";
import SearchHeader from "../../components/search/SearchHeader";
import HistoryGrid from "../../components/common/HistoryGrid";
import UpNext from "../../components/common/UpNext";

const DashboardPage = () => {
  const router = useRouter();
  const { status: sessionStatus } = useSession();
  const {
    data: history,
    status: historyStatus,
    refetch,
  } = trpc.profile.watchHistory.useQuery({ page: 1, pageSize: 6 });
  const { data: upNext, status: upNextStatus } = trpc.profile.upNext.useQuery();

  const deleteEpisodeFromHistory = trpc.episode.removeEpisodeFromWatched.useMutation({
    onSuccess: () => {
      refetch();
    },
  });

  const deleteMovieFromHistory = trpc.movie.removeMovieFromWatched.useMutation({
    onSuccess: () => {
      refetch();
    },
  });

  useEffect(() => {
    if (sessionStatus !== "loading" && sessionStatus === "unauthenticated") {
      router.push("/");
    }
  });

  const handleDelete = (id: string, type: "movie" | "episode") => {
    if (type === "episode") {
      deleteEpisodeFromHistory.mutate({ id });
    } else if (type === "movie") {
      deleteMovieFromHistory.mutate({ id });
    }
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
          <div className="max-w-6xl m-auto">
            <div className="my-6">
              <div className="items-center align-middle md:flex">
                <div className="flex flex-wrap gap-4 mb-5">
                  <div className="text-3xl">Up next</div>
                </div>
              </div>
              <UpNext episodes={upNext?.result || []} status={upNextStatus} />
            </div>
            <div className="my-6">
              <div className="items-center align-middle md:flex">
                <div className="flex flex-wrap gap-4 mb-5">
                  <div className="text-3xl">Recently watched</div>
                  <Link href="/profile/history">
                    <a className="flex flex-wrap items-center px-3 py-1 text-sm text-center rounded-full bg-primary text-primaryBackground">
                      See all history
                    </a>
                  </Link>
                </div>
              </div>
              <HistoryGrid history={history?.history || []} status={historyStatus} handleDelete={handleDelete} />
            </div>
          </div>
        </div>
      )}
    </LoadingPageComponents>
  );
};

export default DashboardPage;
