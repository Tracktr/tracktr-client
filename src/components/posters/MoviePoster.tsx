import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { AiFillStar, AiOutlineCheckCircle } from "react-icons/ai";
import { BsBookmarkCheck, BsFillBookmarkDashFill } from "react-icons/bs";
import { ImSpinner2 } from "react-icons/im";
import { IoIosAdd, IoIosRemove, IoMdInformation } from "react-icons/io";
import { MdDelete } from "react-icons/md";
import { toast } from "react-toastify";
import ConditionalLink from "../../utils/ConditionalLink";
import { PosterImage } from "../../utils/generateImages";
import { trpc } from "../../utils/trpc";
import ImageWithFallback from "../common/ImageWithFallback";

export interface IPoster {
  imageSrc: string;
  name: string;
  url?: string;
  score?: number;
  id: number;
  watched: boolean | null;
  watched_id: string | null;
  watchlist: boolean;
  watchlist_id: string | null;
  refetch: () => void;
  fetchStatus: boolean;
}

const MoviePoster = ({
  imageSrc,
  name,
  url,
  score,
  id,
  watched,
  watched_id,
  watchlist,
  watchlist_id,
  refetch,
  fetchStatus,
}: IPoster) => {
  const { status } = useSession();
  const [currentLoadingID, setCurrentLoadingID] = useState<number>();

  useEffect(() => {
    if (!fetchStatus) setCurrentLoadingID(undefined);
  }, [fetchStatus]);

  const markAsWatched = trpc.movie.markMovieAsWatched.useMutation({
    onMutate: (e) => setCurrentLoadingID(e.movieId),
    onSuccess: () => {
      toast(`Added ${name} to watched`, {
        icon: <IoIosAdd className="text-3xl text-green-500" />,
      });
      refetch();
    },
    onError: () => {
      toast(`Failed to add ${name} to watched`, {
        icon: <IoMdInformation className="text-3xl text-blue-500" />,
      });
    },
  });

  const deleteFromWatched = trpc.movie.removeMovieFromWatched.useMutation({
    onMutate: () => setCurrentLoadingID(id),
    onSuccess: () => {
      toast(`Removed ${name} from watched`, {
        icon: <IoIosRemove className="text-3xl text-red-500" />,
      });
      refetch();
    },
    onError: () => {
      toast(`Failed to remove ${name} from watched`, {
        icon: <IoMdInformation className="text-3xl text-blue-500" />,
      });
    },
  });

  const addToWatchlist = trpc.watchlist.addMovie.useMutation({
    onMutate: () => setCurrentLoadingID(id),
    onSuccess: () => {
      toast(`Added ${name} to watchlist`, {
        icon: <IoIosAdd className="text-3xl text-green-500" />,
      });
      refetch();
    },
    onError: () => {
      toast(`Failed to ${name} to watchlist`, {
        icon: <IoMdInformation className="text-3xl text-blue-500" />,
      });
    },
  });

  const deleteFromWatchlist = trpc.watchlist.removeItem.useMutation({
    onMutate: () => setCurrentLoadingID(id),
    onSuccess: () => {
      toast(`Removed ${name} from watchlist`, {
        icon: <IoIosRemove className="text-3xl text-red-500" />,
      });
      refetch();
    },
    onError: () => {
      toast(`Failed to remove ${name} from watchlist`, {
        icon: <IoMdInformation className="text-3xl text-blue-500" />,
      });
    },
  });

  return (
    <div className="group">
      <div className="relative">
        <ConditionalLink href={url} condition={Boolean(url)}>
          <div className={`relative ${url ? "" : "pointer-events-none"}`}>
            <ImageWithFallback
              alt={"Poster image for" + name}
              src={PosterImage({ path: imageSrc, size: "sm" })}
              width={170}
              height={240}
              className="rounded"
            />
            <div className="absolute bottom-0 left-0 z-10 flex items-center justify-center w-full max-w-[170px] transition-all duration-300 ease-in-out opacity-0 select-none group-hover:opacity-100 bg-gradient-to-t from-primaryBackground">
              {score !== undefined && (
                <div className="flex justify-end w-full">
                  <span className="flex items-center p-2 text-sm">
                    <AiFillStar className="mr-2 text-primary" size={18} />
                    {score > 0 ? score.toPrecision(2) + "/10" : "N/A"}
                  </span>
                </div>
              )}
            </div>
          </div>
        </ConditionalLink>
      </div>
      <div className="text-xs max-w-[170px] px-1 truncate">{name}</div>

      {status === "authenticated" && watched !== null && (
        <div className="flex gap-2 pt-1 mt-auto mb-4 text-gray-500 transition-all duration-300 ease-in-out opacity-25 group-hover:opacity-100">
          <button
            disabled={markAsWatched.isPending || deleteFromWatched.isPending}
            className={`text-2xl transition-all duration-300 ease-in-out ${
              watched ? "hover:text-red-500" : "hover:text-white"
            }`}
            onClick={() => {
              if (watched && watched_id) {
                deleteFromWatched.mutate({ id: watched_id });
              } else {
                markAsWatched.mutate({
                  movieId: id,
                });
              }
            }}
            title="Add to history"
          >
            {(markAsWatched.isPending || deleteFromWatched.isPending || fetchStatus) && id === currentLoadingID ? (
              <ImSpinner2 className="w-6 h-6 animate-spin" />
            ) : watched ? (
              <MdDelete />
            ) : (
              <AiOutlineCheckCircle />
            )}
          </button>

          <button
            disabled={addToWatchlist.isPending || deleteFromWatchlist.isPending}
            className={`text-xl transition-all duration-300 ease-in-out ${
              watched ? "hover:text-red-500" : "hover:text-white"
            }`}
            onClick={() => {
              if (watchlist && watchlist_id) {
                deleteFromWatchlist.mutate({
                  id: watchlist_id,
                });
              } else if (!watchlist) {
                addToWatchlist.mutate({
                  movie_id: id,
                });
              }
            }}
            title="Add to watchlist"
          >
            {(addToWatchlist.isPending || deleteFromWatchlist.isPending || fetchStatus) && id === currentLoadingID ? (
              <ImSpinner2 className="w-6 h-6 animate-spin" />
            ) : watchlist ? (
              <BsFillBookmarkDashFill />
            ) : (
              <BsBookmarkCheck />
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default MoviePoster;
