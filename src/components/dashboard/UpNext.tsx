import Link from "next/link";
import { PosterImage } from "../../utils/generateImages";
import LoadingPageComponents from "../common/LoadingPageComponents";
import { PosterGrid } from "../common/PosterGrid";
import { AnimatePresence, motion } from "framer-motion";
import { AiOutlineCheckCircle } from "react-icons/ai";
import { trpc } from "../../utils/trpc";
import { ImSpinner2 } from "react-icons/im";
import { useState } from "react";
import { IoIosAdd, IoMdInformation } from "react-icons/io";
import { toast } from "react-toastify";
import { Seasons, Series } from "@prisma/client";
import ImageWithFallback from "../common/ImageWithFallback";

interface IEpisode {
  id: number;
  name: string;
  episode_number: number;
  season_number: number;
  seasons_id: number;
  Seasons: Seasons & {
    Series: Series;
  };
  episodes_watched: number;
  number_of_episodes: number;
}

interface IEpisodesGrid {
  episodes: IEpisode[];
  status: "error" | "success" | "pending";
  refetch: () => void;
  isRefetching: boolean;
}

const UpNext = ({ episodes, status, refetch, isRefetching }: IEpisodesGrid): JSX.Element => {
  const [currentLoadingID, setCurrentLoadingID] = useState<number | undefined>();

  const markAsWatched = trpc.episode.markEpisodeAsWatched.useMutation({
    onMutate: (e) => {
      setCurrentLoadingID(e.seriesID);
    },
    onSuccess: () => {
      toast(`Marked episode as watched`, {
        icon: <IoIosAdd className="text-3xl text-green-500" />,
      });
      refetch();
    },
    onError: () => {
      toast("Failed to mark episode as watched", {
        icon: <IoMdInformation className="text-3xl text-blue-500" />,
      });
    },
  });

  if (episodes.length < 1 && status !== "pending") {
    return <div>No up next episodes found</div>;
  }

  return (
    <LoadingPageComponents status={status} posters>
      {() => (
        <PosterGrid hasScrollContainer>
          <AnimatePresence mode="popLayout" initial={false}>
            {episodes.map((item) => {
              return (
                <motion.div
                  className="relative w-[170px]"
                  key={item.id}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -150, opacity: 0 }}
                  transition={{ type: "spring" }}
                >
                  <Link
                    href={`/tv/${item.Seasons.Series.id}/season/${item.season_number}/episode/${item.episode_number}`}
                  >
                    <ImageWithFallback
                      alt={`Poster image for ${`S${item.season_number} - E${item.episode_number}`}`}
                      src={PosterImage({
                        path: item.Seasons.Series.poster,
                        size: "sm",
                      })}
                      width={170}
                      height={240}
                      className="rounded-t"
                    />
                  </Link>
                  <div className="flex bg-[#343434] rounded-b-full">
                    <span
                      className="h-2 transition-all duration-300 ease-in-out rounded-b-full bg-primary"
                      style={{
                        width: `${Math.ceil((item.episodes_watched / item.number_of_episodes) * 100)}%`,
                      }}
                    />
                  </div>
                  <div className="h-4 pb-2 text-xs line-clamp-1">
                    {`${item.season_number}x${item.episode_number}`}&nbsp;
                    {item.name}
                  </div>
                  {(markAsWatched.isPending || isRefetching) && item.Seasons.Series.id === currentLoadingID ? (
                    <ImSpinner2 className="w-6 h-6 animate-spin" />
                  ) : (
                    <button
                      disabled={markAsWatched.isPending}
                      className="flex text-gray-500 text-opacity-100 hover:text-green-500"
                      onClick={() =>
                        markAsWatched.mutate({
                          episodeID: item.id,
                          seriesID: item.Seasons.Series.id,
                        })
                      }
                      aria-label="Mark as watched"
                    >
                      <AiOutlineCheckCircle className="text-2xl" />
                    </button>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </PosterGrid>
      )}
    </LoadingPageComponents>
  );
};

export default UpNext;
