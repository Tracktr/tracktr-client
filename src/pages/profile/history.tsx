import { EpisodesHistory, MoviesHistory } from "@prisma/client";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";
import LoadingPageComponents from "../../components/common/LoadingPageComponents";
import ProfileHeader from "../../components/pageBlocks/ProfileHeader";
import LoadingPosters from "../../components/posters/LoadingPoster";
import { PosterImage } from "../../utils/generateImages";
import { trpc } from "../../utils/trpc";

interface IHistoryBlock {
  history: (MoviesHistory | EpisodesHistory)[];
  status: "error" | "success" | "loading";
}

const HistoryBlock = ({ history, status }: IHistoryBlock): JSX.Element => {
  if (status === "loading") {
    return (
      <div className="grid justify-center gap-2 my-6 text-center md:grid-cols-4 lg:grid-cols-6">
        <LoadingPosters />
      </div>
    );
  }

  if (history.length > 0) {
    return (
      <div className="grid justify-center gap-2 my-6 text-center md:grid-cols-4 lg:grid-cols-6">
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
              <a>
                <div className="relative w-[170px]">
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
                  <div className="absolute bottom-0 left-0 right-0 px-4 py-2 bg-black bg-opacity-75">
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
    );
  }

  return <div>No history found, start watching some shows and movies!</div>;
};

const HistoryPage = () => {
  const router = useRouter();
  const session = useSession();
  const { data, status } = trpc.profile.profileBySession.useQuery();
  const { data: history, status: historyStatus } = trpc.profile.watchHistory.useQuery();

  useEffect(() => {
    if (session.status === "unauthenticated" && status !== "loading") {
      router.push("/");
    }
  });

  return (
    <LoadingPageComponents status={status}>
      {() => (
        <div className="max-w-6xl m-auto">
          <ProfileHeader image={data?.image} name={data?.name} />
          <h1 className="mt-6 text-3xl">History</h1>
          <HistoryBlock history={history?.history || []} status={historyStatus} />
        </div>
      )}
    </LoadingPageComponents>
  );
};

export default HistoryPage;
