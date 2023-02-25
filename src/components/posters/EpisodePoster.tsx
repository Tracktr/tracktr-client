import { useSession } from "next-auth/react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { AiFillStar, AiOutlineCheckCircle } from "react-icons/ai";
import { ImSpinner2 } from "react-icons/im";
import { MdDelete } from "react-icons/md";
import ConditionalLink from "../../utils/ConditionalLink";
import { PosterImage } from "../../utils/generateImages";
import { trpc } from "../../utils/trpc";
import { IThemeColor } from "../watchButton/BaseWatchButton";

export interface IEpisodePoster {
  id: number;
  imageSrc: string;
  name: string;
  url?: string;
  overview: string;
  season: number;
  episode: number;
  score?: number;
  series_id: number;
  watched: boolean;
  watched_id: string | null;
  refetch: () => void;
  fetchStatus: boolean;
  themeColor: IThemeColor;
}

const EpisodePoster = ({
  id,
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
  fetchStatus,
  themeColor,
}: IEpisodePoster) => {
  const { status } = useSession();
  const [currentLoadingID, setCurrentLoadingID] = useState<number>();

  useEffect(() => {
    if (!fetchStatus) setCurrentLoadingID(undefined);
  }, [fetchStatus]);

  const markAsWatched = trpc.episode.markEpisodeAsWatched.useMutation({
    onMutate: () => setCurrentLoadingID(episode),
    onSuccess: () => refetch(),
  });

  const deleteFromWatched = trpc.episode.removeEpisodeFromWatched.useMutation({
    onMutate: () => setCurrentLoadingID(episode),
    onSuccess: () => {
      refetch();
    },
  });

  return (
    <div className="md:flex group">
      <div className="relative flex flex-wrap justify-center flex-shrink-0">
        <ConditionalLink condition={Boolean(url)} href={url}>
          <Image
            alt={"Still image for" + name}
            src={PosterImage({ path: imageSrc, size: "md" })}
            width={300}
            height={168}
            className="rounded"
          />
        </ConditionalLink>
        <div className="absolute bottom-0 left-0 z-10 flex items-center w-full select-none bg-gradient-to-t from-primaryBackground"></div>
        <div className="flex flex-col max-w-md py-4 md:py-0 md:pl-2">
          <ConditionalLink condition={Boolean(url)} href={url}>
            <p className="flex items-center justify-center pb-2 font-bold text-md">
              <span
                style={{
                  background: themeColor?.hex,
                }}
                className={`
                    px-3 py-1 mr-2 rounded-full
                    ${themeColor.isDark && "text-white"}
                    ${themeColor.isLight && "text-primaryBackground"}
                  `}
              >
                {season}x{episode}
              </span>
              {name}
              {score !== undefined && (
                <span className="flex ml-auto text-white min-w-[25%]">
                  <span className="flex items-center text-sm">
                    <AiFillStar className="mr-1 text-primary" size={18} />
                    {score > 0 ? score.toPrecision(2) + " / 10" : "N/A"}
                  </span>
                </span>
              )}
            </p>
          </ConditionalLink>

          <ConditionalLink condition={Boolean(url)} href={url}>
            <p className="text-sm line-clamp-4">{overview}</p>
          </ConditionalLink>

          {status === "authenticated" && (
            <div className="flex pt-1 mt-auto mb-4 text-gray-500 opacity-25 group-hover:opacity-100">
              <button
                disabled={markAsWatched.isLoading || deleteFromWatched.isLoading}
                className={`text-2xl transition-all duration-300 ease-in-out ${
                  watched ? "hover:text-red-500" : "hover:text-white"
                }`}
                onClick={() => {
                  if (watched && watched_id) {
                    deleteFromWatched.mutate({ id: watched_id });
                  } else {
                    markAsWatched.mutate({
                      episodeID: id,
                      seriesID: series_id,
                    });
                  }
                }}
              >
                {(markAsWatched.isLoading || deleteFromWatched.isLoading || fetchStatus) &&
                episode === currentLoadingID ? (
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
