import Image from "next/image";
import Link from "next/link";
import { PosterImage } from "../../utils/generateImages";
import LoadingPageComponents from "./LoadingPageComponents";
import { PosterGrid } from "./PosterGrid";
import { Episodes } from "@prisma/client";
import { ImCheckmark2 } from "react-icons/im";
import { AnimatePresence, motion } from "framer-motion";

interface IepisodesGrid {
  episodes: Episodes[];
  status: "error" | "success" | "loading";
  markAsWatched: (e: any) => void;
}

const UpNext = ({ episodes, status, markAsWatched }: IepisodesGrid): JSX.Element => {
  if (episodes.length < 1 && status !== "loading") {
    return (
      <div>
        You have finished all your shows, go check out some{" "}
        <Link href="/tv">
          <a className="underline">new ones!</a>
        </Link>
      </div>
    );
  }

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
                  <div className="absolute bottom-0 left-0 right-0 overflow-hidden text-center select-none bg-gradient-to-t from-primaryBackground">
                    <div className="px-4 pt-2">
                      <span className="w-full text-sm line-clamp-2">
                        {`S${item.season_number} - E${item.episode_number}`}
                      </span>
                    </div>
                    <div className="max-h-0 group-hover:max-h-40 animated">
                      <div className="pb-2 text-sm">{item.series.name}</div>
                      <button
                        className="flex justify-center w-full text-3xl text-opacity-100"
                        onClick={() =>
                          markAsWatched({
                            episodeNumber: item.episode_number,
                            seasonNumber: item.season_number,
                            seriesId: item.series.id,
                          })
                        }
                      >
                        <ImCheckmark2 />
                      </button>
                    </div>
                  </div>
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
