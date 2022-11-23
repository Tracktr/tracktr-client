import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { AiFillStar, AiOutlineCheckCircle } from "react-icons/ai";
import { ImSpinner2 } from "react-icons/im";
import { MdDelete } from "react-icons/md";
import { PosterImage } from "../../utils/generateImages";
import { trpc } from "../../utils/trpc";

export interface IPoster {
  imageSrc: string;
  name: string;
  url?: string;
  score?: number;
  id: number;
  watched: boolean | null;
  watched_id: string | null;
  refetch: () => void;
  fetchStatus: boolean;
}

const MoviePoster = ({ imageSrc, name, url, score, id, watched, watched_id, refetch, fetchStatus }: IPoster) => {
  const { status } = useSession();
  const [currentLoadingID, setCurrentLoadingID] = useState<number>();

  const markAsWatched = trpc.movie.markMovieAsWatched.useMutation({
    onMutate: (e) => setCurrentLoadingID(e.movieId),
    onSuccess: () => refetch(),
  });

  const deleteFromWatched = trpc.movie.removeMovieFromWatched.useMutation({
    onMutate: () => setCurrentLoadingID(id),
    onSuccess: () => refetch(),
  });

  return (
    <div className="group">
      <div className="relative">
        <Link href={url || "#"}>
          <a className={`relative ${url ? "" : "pointer-events-none"}`}>
            <Image
              alt={"Poster image for" + name}
              src={PosterImage({ path: imageSrc, size: "sm" })}
              width="170px"
              height="240px"
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
          </a>
        </Link>
      </div>
      <div className="text-xs max-w-[170px] px-1 truncate">{name}</div>

      {status === "authenticated" && watched !== null && (
        <div className="flex pt-1 mt-auto mb-4 text-gray-500 transition-all duration-300 ease-in-out opacity-25 group-hover:opacity-100">
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
                  movieId: id,
                });
              }
            }}
          >
            {(markAsWatched.isLoading || deleteFromWatched.isLoading || fetchStatus) && id === currentLoadingID ? (
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
  );
};

export default MoviePoster;
