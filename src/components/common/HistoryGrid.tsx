import { EpisodesHistory, MoviesHistory } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { PosterImage } from "../../utils/generateImages";
import LoadingPageComponents from "./LoadingPageComponents";
import { PosterGrid } from "./PosterGrid";
import { MdDelete } from "react-icons/md";
import { AnimatePresence, motion } from "framer-motion";
import { trpc } from "../../utils/trpc";
import { ImSpinner2 } from "react-icons/im";
import { useState } from "react";

const HistoryGrid = ({ history, status, hasScrollContainer, refetch }: IHistoryGrid): JSX.Element => {
  const [currentLoadingID, setCurrentLoadingID] = useState<string | undefined>();

  const deleteEpisodeFromHistory = trpc.episode.removeEpisodeFromWatched.useMutation({
    onMutate: (e) => {
      setCurrentLoadingID(e.id);
    },
    onSuccess: () => {
      refetch();
    },
  });

  const deleteMovieFromHistory = trpc.movie.removeMovieFromWatched.useMutation({
    onMutate: (e) => {
      setCurrentLoadingID(e.id);
    },
    onSuccess: () => {
      refetch();
    },
  });

  const handleDelete = (id: string, type: "movie" | "episode") => {
    if (type === "episode") {
      deleteEpisodeFromHistory.mutate({ id });
    } else if (type === "movie") {
      deleteMovieFromHistory.mutate({ id });
    }
  };

  return (
    <LoadingPageComponents status={status} posters>
      {() => (
        <PosterGrid hasScrollContainer={hasScrollContainer}>
          <AnimatePresence mode="popLayout" initial={false}>
            {history.map((item: IHistoryItem) => {
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
                        ? `/movies/${item.movie?.id}`
                        : `/tv/${item.series_id}/season/${item.season_number}/episode/${item.episode_number}`
                    }
                  >
                    <a className="relative w-[170px] group">
                      <Image
                        alt={`Poster image for ${
                          item?.movie_id
                            ? item.movie?.title
                            : `${item.season_number}x${item.episode_number} ${item.series?.name}`
                        }`}
                        src={PosterImage({
                          path: item.movie_id ? String(item.movie?.poster) : String(item.series?.poster),
                          size: "sm",
                        })}
                        width="170px"
                        height="240px"
                        className="rounded"
                      />
                      <div>
                        <span className="w-full text-xs truncate line-clamp-2">
                          {item?.movie_id
                            ? `${item.movie?.title}`
                            : `${item.season_number}x${item.episode_number} ${item.series?.name}`}
                        </span>
                        <div className="text-xs opacity-50 line-clamp-1">{date}</div>
                      </div>
                    </a>
                  </Link>
                  <div className="pt-1 text-gray-500 transition-all duration-300 ease-in-out opacity-25 group-hover:opacity-100">
                    {(deleteEpisodeFromHistory.isLoading && item.id === currentLoadingID) ||
                    (deleteMovieFromHistory.isLoading && item.id === currentLoadingID) ? (
                      <ImSpinner2 className="w-6 h-6 animate-spin" />
                    ) : (
                      <button
                        className="text-3xl transition-all duration-300 ease-in-out hover:text-red-700"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleDelete(item.id, item.movie_id ? "movie" : "episode");
                        }}
                      >
                        <MdDelete className="text-2xl" />
                      </button>
                    )}
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

interface IHistoryGrid {
  history: (MoviesHistory | EpisodesHistory)[];
  status: "error" | "success" | "loading";
  hasScrollContainer?: boolean;
  refetch: () => void;
}

interface ISeries {
  id: number;
  name: string;
  poster: string;
}

interface IMovie {
  id: number;
  title: string;
  poster: string;
}

interface IHistoryItem {
  id: string;
  datetime: Date;
  user_id: string;
  series_id?: number;
  season_number?: number;
  episode_number?: number;
  series?: ISeries;
  movie_id?: number;
  movie?: IMovie;
}

export default HistoryGrid;
