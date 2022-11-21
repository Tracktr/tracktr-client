import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { AiFillStar, AiOutlineCheckCircle } from "react-icons/ai";
import { ImSpinner2 } from "react-icons/im";
import { MdDelete } from "react-icons/md";
import { PosterImage } from "../../utils/generateImages";
import { trpc } from "../../utils/trpc";

export interface IEpisodePoster {
  imageSrc: string;
  name: string;
  url?: string;
  overview: string;
  season: number;
  episode: number;
  score?: number;
  series_id: number;
  watched: boolean;
  watched_id: string;
  refetch: () => void;
}

const EpisodePoster = ({
  imageSrc,
  name,
  url,
  overview,
  season,
  episode,
  score,
  series_id,
  watched,
  watched_id,
  refetch,
}: IEpisodePoster) => {
  const { status } = useSession();

  const markAsWatched = trpc.episode.markEpisodeAsWatched.useMutation({
    onSuccess: () => {
      refetch();
    },
  });

  const deleteFromWatched = trpc.episode.removeEpisodeFromWatched.useMutation({
    onSuccess: () => {
      refetch();
    },
  });

  return (
    <div className="md:flex group">
      <div className="relative flex flex-shrink-0">
        <Link href={url || "#"}>
          <a>
            <Image
              alt={"still image for" + name}
              src={PosterImage({ path: imageSrc, size: "md" })}
              width="300px"
              height="168px"
              className="rounded"
            />
          </a>
        </Link>
        <div className="absolute bottom-0 left-0 z-10 flex items-center w-full select-none bg-gradient-to-t from-primaryBackground"></div>
        <div className="flex flex-col max-w-md py-4 md:py-0 md:pl-2">
          <Link href={url || "#"}>
            <a>
              <p className="flex items-center justify-center pb-2 font-bold text-md">
                <span className="px-3 py-1 mr-2 rounded-full bg-primary text-primaryBackground">
                  {season}x{episode}
                </span>
                {name}
                {score !== undefined && (
                  <span className="flex ml-auto text-white">
                    <span className="flex items-center text-sm">
                      <AiFillStar className="mr-1 text-primary" size={18} />
                      {score > 0 ? score.toPrecision(2) + " / 10" : "N/A"}
                    </span>
                  </span>
                )}
              </p>
            </a>
          </Link>

          <Link href={url || "#"}>
            <a>
              <p className="text-sm line-clamp-4">{overview}</p>
            </a>
          </Link>

          {status === "authenticated" && (
            <div className="flex pt-1 mt-auto mb-4 text-gray-500 transition-all duration-300 ease-in-out opacity-25 group-hover:opacity-100">
              <button
                disabled={markAsWatched.isLoading || deleteFromWatched.isLoading}
                className={`text-2xl transition-all duration-300 ease-in-out ${
                  watched ? "hover:text-red-500" : "hover:text-white"
                }`}
                onClick={() => {
                  if (watched) {
                    deleteFromWatched.mutate({ id: watched_id });
                  } else {
                    markAsWatched.mutate({
                      episodeNumber: episode,
                      seasonNumber: season,
                      seriesId: series_id,
                    });
                  }
                }}
              >
                {markAsWatched.isLoading || deleteFromWatched.isLoading ? (
                  <ImSpinner2 className="w-6 h-6 animate-spin" />
                ) : watched ? (
                  <MdDelete />
                ) : (
                  <AiOutlineCheckCircle />
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EpisodePoster;
