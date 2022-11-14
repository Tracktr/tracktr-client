import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import LoadingPageComponents from "../../components/common/LoadingPageComponents";
import ProfileHeader from "../../components/pageBlocks/ProfileHeader";
import MoviePoster from "../../components/posters/MoviePoster";
import { PosterImage } from "../../utils/generateImages";
import { trpc } from "../../utils/trpc";

const ProfilePage = () => {
  const router = useRouter();
  const session = useSession();
  const { data, status } = trpc.profile.watchHistory.useQuery();
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    if (session.status === "unauthenticated") {
      router.push("/");
    }
  });

  useEffect(() => {
    const episodes = data?.EpisodesHistory || [];
    const movies = data?.MoviesHistory || [];

    setHistory([...episodes, ...movies]);
  }, [data]);

  return (
    <LoadingPageComponents status={status}>
      {() => (
        <div className="max-w-6xl m-auto">
          <ProfileHeader image={data?.image} name={data?.name} />
          <h1 className="mt-6 text-3xl">History</h1>
          {history.length > 0 ? (
            <div className="grid justify-center gap-2 my-6 text-center md:grid-cols-4 lg:grid-cols-6">
              {history
                .sort((a, b) => {
                  if (a.datetime < b.datetime) {
                    return 1;
                  } else {
                    return -1;
                  }
                })
                .map((item) => {
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
                            <span className="w-full text-sm">
                              {item?.movie_id
                                ? `${item.movie.title}`
                                : `${item.season_number}x${item.episode_number} ${item.series.name}`}
                            </span>
                            <div className="text-xs">{date}</div>
                          </div>
                        </div>
                      </a>
                    </Link>
                  );
                })}
            </div>
          ) : (
            <div>No history found, start watching some shows and movies!</div>
          )}
        </div>
      )}
    </LoadingPageComponents>
  );
};

export default ProfilePage;
