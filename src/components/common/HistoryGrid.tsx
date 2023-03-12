import { EpisodesHistory, MoviesHistory } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { PosterImage } from "../../utils/generateImages";
import { PosterGrid } from "./PosterGrid";
import { MdDelete } from "react-icons/md";
import { AnimatePresence, motion } from "framer-motion";
import { trpc } from "../../utils/trpc";
import { ImSpinner2 } from "react-icons/im";
import { useState } from "react";
import { IoIosRemove, IoMdInformation } from "react-icons/io";
import { toast } from "react-toastify";
import ImageWithFallback from "./ImageWithFallback";
import LoadingPosters from "../posters/LoadingPoster";

const HistoryGrid = ({
  history,
  status,
  hasScrollContainer,
  refetch,
  inPublic,
  isRefetching,
}: IHistoryGrid): JSX.Element => {
  const [currentLoadingID, setCurrentLoadingID] = useState<string | undefined>();

  const deleteEpisodeFromHistory = trpc.episode.removeEpisodeFromWatched.useMutation({
    onMutate: (e) => {
      setCurrentLoadingID(e.id);
    },
    onSuccess: () => {
      toast(`Removed episode from history`, {
        icon: <IoIosRemove className="text-3xl text-red-500" />,
      });
      refetch();
    },
    onError: () => {
      toast("Failed to remove episode from history", {
        icon: <IoMdInformation className="text-3xl text-blue-500" />,
      });
    },
  });

  const deleteMovieFromHistory = trpc.movie.removeMovieFromWatched.useMutation({
    onMutate: (e) => {
      setCurrentLoadingID(e.id);
    },
    onSuccess: () => {
      toast(`Removed movie from history`, {
        icon: <IoIosRemove className="text-3xl text-red-500" />,
      });
      refetch();
    },
    onError: () => {
      toast("Failed to remove movie from history", {
        icon: <IoMdInformation className="text-3xl text-blue-500" />,
      });
    },
  });

  const handleDelete = (id: string, type: "movie" | "episode") => {
    if (type === "episode") {
      deleteEpisodeFromHistory.mutate({ id });
    } else if (type === "movie") {
      deleteMovieFromHistory.mutate({ id });
    }
  };

  if (status === "loading") {
    return <LoadingPosters />;
  } else if (history.length < 1) {
    return <div>No items found</div>;
  }

  return (
    <PosterGrid hasScrollContainer={hasScrollContainer}>
      <AnimatePresence mode="popLayout" initial={false}>
        {history.map((item: IHistoryItem, i) => {
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
              {item?.friend && (history[i - 1] as IHistoryItem)?.friend?.name !== item?.friend?.name ? (
                <Link href={`/profile/${item?.friend?.name}`} className="flex h-6">
                  <ImageWithFallback
                    unoptimized
                    src={item?.friend?.image ? item?.friend?.image : ""}
                    fallbackSrc="/placeholder_profile.png"
                    width={16}
                    height={16}
                    className="rounded-full w-[16px] h-[16px]"
                    alt="User profile image"
                  />
                  <p className="ml-2 text-sm">{item?.friend?.name}</p>
                </Link>
              ) : (
                <div className="h-6" />
              )}
              <Link
                href={
                  item?.movie_id
                    ? `/movies/${item.movie?.id}`
                    : `/tv/${item.series_id}/season/${item?.season?.season_number}/episode/${item?.episode?.episode_number}`
                }
                className="relative w-[170px] group"
              >
                <Image
                  alt={`Poster image for ${
                    item?.movie_id
                      ? item.movie?.title
                      : `${item?.season?.season_number}x${item?.episode?.episode_number} ${item.series?.name}`
                  }`}
                  src={PosterImage({
                    path: item.movie_id ? String(item.movie?.poster) : String(item.series?.poster),
                    size: "sm",
                  })}
                  width={170}
                  height={240}
                  className="rounded w-[170px] h-[240px]"
                />
                <div>
                  <span className="w-full text-xs truncate line-clamp-2">
                    {item?.season && item?.episode
                      ? `${item.season.season_number}x${item.episode.episode_number} ${item.series?.name}`
                      : `${item?.movie?.title}`}
                  </span>
                  <div className="text-xs opacity-50 line-clamp-1">{date}</div>
                </div>
              </Link>
              {!inPublic && (
                <div className="pt-1 text-gray-500 transition-all duration-300 ease-in-out opacity-25 group-hover:opacity-100">
                  {(deleteEpisodeFromHistory.isLoading && item.id === currentLoadingID) ||
                  ((deleteMovieFromHistory.isLoading || isRefetching) && item.id === currentLoadingID) ? (
                    <ImSpinner2 className="w-6 h-6 animate-spin" />
                  ) : (
                    <button
                      className="text-3xl transition-all duration-300 ease-in-out hover:text-red-700"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleDelete(item.id, item.movie_id ? "movie" : "episode");
                      }}
                      aria-label="Remove item"
                    >
                      <MdDelete className="text-2xl" />
                    </button>
                  )}
                </div>
              )}
            </motion.div>
          );
        })}
      </AnimatePresence>
    </PosterGrid>
  );
};

interface IHistoryGrid {
  history: (MoviesHistory | EpisodesHistory)[];
  status: "error" | "success" | "loading";
  hasScrollContainer?: boolean;
  refetch: () => void;
  inPublic?: boolean;
  isRefetching: boolean;
}

interface ISeries {
  id: number;
  name: string;
  poster: string;
}

interface ISeason {
  id: number;
  name: string;
  poster: string;
  season_number: number;
  series_id: number;
}

interface IEpisode {
  id: number;
  name: string;
  episode_number: number;
  season_number: number;
  seasons_id: number;
  air_date: Date;
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
  movie_id?: number;
  movie?: IMovie;
  series?: ISeries;
  season?: ISeason;
  episode?: IEpisode;
  friend?: {
    name: string;
    image: string;
  };
}

export default HistoryGrid;
