import Image from "next/image";
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

interface Series {
  id: number;
  name: string;
  poster: string;
}

interface IEpisode {
  id: number;
  name: string;
  episode_number: number;
  season_number: number;
  seasons_id: number;
  series: Series;
}

interface IEpisodesGrid {
  episodes: IEpisode[];
  status: "error" | "success" | "loading";
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

  if (episodes.length < 1 && status !== "loading") {
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
                  className="relative w-[170px] group"
                  key={item.id}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -150, opacity: 0 }}
                  transition={{ type: "spring" }}
                >
                  <Link href={`/tv/${item.series.id}/season/${item.season_number}/episode/${item.episode_number}`}>
                    <a>
                      <Image
                        alt={`Poster image for ${`S${item.season_number} - E${item.episode_number}`}`}
                        src={PosterImage({
                          path: item.series.poster,
                          size: "sm",
                        })}
                        width="170px"
                        height="240px"
                        className="rounded"
                      />
                    </a>
                  </Link>
                  <div className="h-4 pb-2 text-xs line-clamp-1">
                    {`${item.season_number}x${item.episode_number}`}&nbsp;
                    {item.name}
                  </div>
                  {(markAsWatched.isLoading || isRefetching) && item.series.id === currentLoadingID ? (
                    <ImSpinner2 className="w-6 h-6 animate-spin" />
                  ) : (
                    <button
                      disabled={markAsWatched.isLoading}
                      className="flex text-gray-500 text-opacity-100 hover:text-green-500"
                      onClick={() =>
                        markAsWatched.mutate({
                          episodeID: item.id,
                          seriesID: item.series.id,
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
