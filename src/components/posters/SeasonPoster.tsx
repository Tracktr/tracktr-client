import { useSession } from "next-auth/react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { AiFillStar, AiOutlineCheckCircle } from "react-icons/ai";
import { ImSpinner2 } from "react-icons/im";
import { IoIosAdd, IoIosRemove, IoMdInformation } from "react-icons/io";
import { MdDelete } from "react-icons/md";
import { toast } from "react-toastify";
import ConditionalLink from "../../utils/ConditionalLink";
import { PosterImage } from "../../utils/generateImages";
import { trpc } from "../../utils/trpc";

interface IPoster {
  imageSrc: string;
  name: string;
  url?: string;
  score?: number;
  id: number;
  watched: boolean | null;
  refetch: () => void;
  fetchStatus: boolean;
  seasonNumber: number;
  seriesID: number;
}

const SeasonPoster = ({
  imageSrc,
  name,
  url,
  score,
  id,
  watched,
  refetch,
  fetchStatus,
  seasonNumber,
  seriesID,
}: IPoster) => {
  const { status } = useSession();
  const [currentLoadingID, setCurrentLoadingID] = useState<number>();

  useEffect(() => {
    if (!fetchStatus) setCurrentLoadingID(undefined);
  }, [fetchStatus]);

  const markAsWatched = trpc.season.markSeasonAsWatched.useMutation({
    onSuccess: () => {
      toast(`Added all episodes for season ${seasonNumber} to watched`, {
        icon: <IoIosAdd className="text-3xl text-green-500" />,
      });
      refetch();
    },
    onError: () => {
      toast(`Failed to add all episodes for season ${seasonNumber} to watched`, {
        icon: <IoMdInformation className="text-3xl text-blue-500" />,
      });
    },
  });

  const deleteFromWatched = trpc.season.removeSeasonFromWatched.useMutation({
    onSuccess: () => {
      toast(`Removed all episodes for ${name} from watched`, {
        icon: <IoIosRemove className="text-3xl text-red-500" />,
      });
      refetch();
    },
    onError: () => {
      toast(`Failed to remove all episodes for ${name} to watched`, {
        icon: <IoMdInformation className="text-3xl text-blue-500" />,
      });
    },
  });

  return (
    <div className="group">
      <div className="relative">
        <ConditionalLink href={url} condition={Boolean(url)}>
          <div className={`relative ${url ? "" : "pointer-events-none"}`}>
            <Image
              alt={"Poster image for" + name}
              src={PosterImage({ path: imageSrc, size: "sm" })}
              width={170}
              height={240}
              className="rounded w-[170px] h-[240px]"
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
        <div className="flex pt-1 mt-auto mb-4 text-gray-500 transition-all duration-300 ease-in-out opacity-25 group-hover:opacity-100">
          <button
            disabled={markAsWatched.isLoading || deleteFromWatched.isLoading}
            className={`text-2xl transition-all duration-300 ease-in-out ${
              watched ? "hover:text-red-500" : "hover:text-white"
            }`}
            onClick={() => {
              if (watched && id) {
                setCurrentLoadingID(id);
                deleteFromWatched.mutate({ seriesID, seasonID: id });
              } else {
                setCurrentLoadingID(id);
                markAsWatched.mutate({ seriesID, seasonNumber });
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

export default SeasonPoster;
