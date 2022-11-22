import Image from "next/image";
import Link from "next/link";
import { PosterImage } from "../../utils/generateImages";
import LoadingPageComponents from "./LoadingPageComponents";
import { PosterGrid } from "./PosterGrid";
import { Episodes } from "@prisma/client";
import { AnimatePresence, motion } from "framer-motion";
import { AiOutlineCheckCircle } from "react-icons/ai";
import { trpc } from "../../utils/trpc";
import { ImSpinner2 } from "react-icons/im";
import { useState } from "react";

interface IepisodesGrid {
  episodes: Episodes[];
  status: "error" | "success" | "loading";
  refetchHistory: () => void;
  refetchUpNext: () => void;
}

const UpNext = ({ episodes, status, refetchHistory, refetchUpNext }: IepisodesGrid): JSX.Element => {
  const [currentLoadingID, setCurrentLoadingID] = useState<number | undefined>();

  const markAsWatched = trpc.episode.markEpisodeAsWatched.useMutation({
    onMutate: (e) => {
      setCurrentLoadingID(e.seriesId);
    },
    onSuccess: () => {
      refetchUpNext();
      refetchHistory();
    },
  });

  return (
    <LoadingPageComponents status={status} posters>
      {() => (
        <PosterGrid hasScrollContainer>
          <AnimatePresence mode="popLayout" initial={false}>
            {episodes.map((item: any) => {
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
                  <div className="pb-2 text-xs">
                    {`${item.season_number}x${item.episode_number}`}
                    {` `}
                    {item.series.name}
                  </div>
                  {markAsWatched.isLoading && item.series.id === currentLoadingID ? (
                    <ImSpinner2 className="w-6 h-6 animate-spin" />
                  ) : (
                    <button
                      disabled={markAsWatched.isLoading}
                      className="flex text-gray-500 text-opacity-100 hover:text-green-500"
                      onClick={() =>
                        markAsWatched.mutate({
                          episodeNumber: item.episode_number,
                          seasonNumber: item.season_number,
                          seriesId: item.series.id,
                        })
                      }
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
