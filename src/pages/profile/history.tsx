import { EpisodesHistory, MoviesHistory } from "@prisma/client";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import LoadingPageComponents from "../../components/common/LoadingPageComponents";
import ProfileHeader from "../../components/pageBlocks/ProfileHeader";
import { PosterImage } from "../../utils/generateImages";
import { trpc } from "../../utils/trpc";

interface IHistoryGrid {
  history: (MoviesHistory | EpisodesHistory)[];
  status: "error" | "success" | "loading";
}

const HistoryGrid = ({ history, status }: IHistoryGrid): JSX.Element => {
  if (history.length < 1 && status !== "loading") {
    return <div>No history found, start watching some shows and movies!</div>;
  }

  return (
    <LoadingPageComponents status={status} posters>
      {() => (
        <div className="grid gap-4 py-5 grid-cols-fluid">
          {history.map((item: any) => {
            const date = new Date(item.datetime).toLocaleString(
              "en-UK", // TODO: get time format from user language
              {
                dateStyle: "medium",
                timeStyle: "short",
              }
            );

            return (
              <Link
                href={
                  item?.movie_id
                    ? `/movies/${item.movie.id}`
                    : `/tv/${item.series_id}/season/${item.season_number}/episode/${item.episode_number}`
                }
                key={item.id}
              >
                <a className="w-[170px]">
                  <div className="relative">
                    <Image
                      alt={`Poster image for ${
                        item?.movie_id
                          ? item.movie.title
                          : `${item.season_number}x${item.episode_number} ${item.series.name}`
                      }`}
                      src={PosterImage({
                        path: item.movie_id ? item.movie.poster : item.series.poster,
                        size: "sm",
                      })}
                      width="170px"
                      height="240px"
                      className="rounded"
                    />
                    <div className="absolute bottom-0 left-0 right-0 px-4 py-2 bg-gradient-to-t from-primaryBackground">
                      <span className="w-full text-sm line-clamp-2">
                        {item?.movie_id
                          ? `${item.movie.title}`
                          : `${item.season_number}x${item.episode_number} ${item.series.name}`}
                      </span>
                      <div className="text-xs line-clamp-1">{date}</div>
                    </div>
                  </div>
                </a>
              </Link>
            );
          })}
        </div>
      )}
    </LoadingPageComponents>
  );
};

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
          <div className="items-center mt-6 align-middle md:flex">
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
