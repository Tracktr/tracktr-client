import { EpisodesHistory, MoviesHistory } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { PosterImage } from "../../utils/generateImages";
import LoadingPageComponents from "./LoadingPageComponents";
import { PosterGrid } from "./PosterGrid";
import { MdDelete } from "react-icons/md";
import { AnimatePresence, motion } from "framer-motion";

interface IHistoryGrid {
  history: (MoviesHistory | EpisodesHistory)[];
  status: "error" | "success" | "loading";
  handleDelete: (id: string, type: "movie" | "episode") => void;
  hasScrollContainer?: boolean;
}

const HistoryGrid = ({ history, status, handleDelete, hasScrollContainer }: IHistoryGrid): JSX.Element => {
  if (history.length < 1 && status !== "loading") {
    return <div>No history found, start watching some shows and movies!</div>;
  }

  return (
    <LoadingPageComponents status={status} posters>
      {() => (
        <PosterGrid hasScrollContainer={hasScrollContainer}>
          <AnimatePresence mode="popLayout" initial={false}>
            {history.map((item: any) => {
              const date = new Date(item.datetime).toLocaleString("en-UK", {
                dateStyle: "medium",
                timeStyle: "short",
              });
              return (
                <motion.div
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -150, opacity: 0 }}
                  transition={{ type: "spring" }}
                  className="relative w-[170px] group"
                  key={item.id}
                >
                  <Link
                    href={
                      item?.movie_id
                        ? `/movies/${item.movie.id}`
                        : `/tv/${item.series_id}/season/${item.season_number}/episode/${item.episode_number}`
                    }
                  >
                    <a className="relative w-[170px] group">
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
                      <div>
                        <span className="w-full text-xs truncate line-clamp-2">
                          {item?.movie_id
                            ? `${item.movie.title}`
                            : `${item.season_number}x${item.episode_number} ${item.series.name}`}
                        </span>
                        <div className="text-xs opacity-50 line-clamp-1">{date}</div>
                      </div>
                    </a>
                  </Link>
                  <div className="pt-1 transition-all duration-300 ease-in-out opacity-0 group-hover:opacity-100">
                    <button
                      className="text-3xl text-red-500 transition-all duration-300 ease-in-out hover:text-red-700"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleDelete(item.id, item.movie_id ? "movie" : "episode");
                      }}
                    >
                      <MdDelete className="text-2xl" />
                    </button>
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

export default HistoryGrid;
