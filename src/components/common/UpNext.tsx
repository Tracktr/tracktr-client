import Image from "next/image";
import Link from "next/link";
import { PosterImage } from "../../utils/generateImages";
import LoadingPageComponents from "./LoadingPageComponents";
import { PosterGrid } from "./PosterGrid";
import { Episodes } from "@prisma/client";
import { ImCheckmark2 } from "react-icons/im";
import { AnimatePresence, motion } from "framer-motion";
import { AiOutlineCheckCircle } from "react-icons/ai";

interface IepisodesGrid {
  episodes: Episodes[];
  status: "error" | "success" | "loading";
  markAsWatched: (e: any) => void;
}

const UpNext = ({ episodes, status, markAsWatched }: IepisodesGrid): JSX.Element => {
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
                  <button
                    className="flex text-gray-500 text-opacity-100 hover:text-green-500"
                    onClick={() =>
                      markAsWatched({
                        episodeNumber: item.episode_number,
                        seasonNumber: item.season_number,
                        seriesId: item.series.id,
                      })
                    }
                  >
                    <AiOutlineCheckCircle className="text-2xl" />
                  </button>
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
