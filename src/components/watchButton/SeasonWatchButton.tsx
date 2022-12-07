import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { AiOutlineCheckCircle } from "react-icons/ai";
import { IoIosAdd, IoIosRemove } from "react-icons/io";
import { MdDelete } from "react-icons/md";
import { toast } from "react-toastify";
import { trpc } from "../../utils/trpc";
import BaseWatchButton, { IThemeColor } from "./BaseWatchButton";
import LoadingWatchButton from "./LoadingWatchButton";

interface IWatchButtonProps {
  itemID: number;
  seasonID: number;
  themeColor: IThemeColor;
  refetchProgression?: () => void;
  watchHistory: any;
}

const SeasonWatchButton = ({ itemID, seasonID, themeColor, refetchProgression, watchHistory }: IWatchButtonProps) => {
  const { status: sessionStatus } = useSession();
  const [state, setState] = useState<"watched" | "unwatched" | "loading">("loading");

  const markAsWatched = trpc.season.markSeasonAsWatched.useMutation({
    onMutate: () => {
      setState("loading");
    },
    onSuccess: () => {
      toast(`Added all episodes for season ${seasonID} to watched`, {
        icon: <IoIosAdd className="text-3xl text-green-500" />,
      });
      refetchProgression && refetchProgression();
      watchHistory.refetch();
    },
  });

  const removeFromWatched = trpc.season.removeSeasonFromWatched.useMutation({
    onMutate: () => {
      setState("loading");
    },
    onSuccess: () => {
      toast(`Removed all episodes for season ${seasonID} from watched`, {
        icon: <IoIosRemove className="text-3xl text-red-500" />,
      });
      refetchProgression && refetchProgression();
      watchHistory.refetch();
    },
  });

  useEffect(() => {
    if (sessionStatus === "authenticated" && watchHistory.status === "success") {
      if (watchHistory.data.results.length > 0) {
        setState("watched");
      } else {
        setState("unwatched");
      }
    }
  }, [sessionStatus, watchHistory.data, watchHistory.status, markAsWatched.status]);

  const addToHistory = (e: any) => {
    if (e?.key === "Enter" || e?.key === undefined) {
      setState("loading");

      markAsWatched.mutate({
        seasonNumber: seasonID,
        seriesId: itemID,
      });
    }
  };

  const removeFromHistory = (e: any) => {
    if (e?.key === "Enter" || e?.key === undefined) {
      setState("loading");

      removeFromWatched.mutate({
        seasonNumber: seasonID,
        seriesId: itemID,
      });
    }
  };

  if (state === "unwatched") {
    return (
      <BaseWatchButton onClick={addToHistory} themeColor={themeColor}>
        <div className="flex items-center justify-between">
          <div>Add to watched</div>
          <div>
            <AiOutlineCheckCircle className="mr-1 text-2xl" />
          </div>
        </div>
      </BaseWatchButton>
    );
  }

  if (state === "watched") {
    const plays: number = watchHistory?.data?.results?.length || 0;
    const lastDate = watchHistory?.data?.results[0]?.datetime;
    const date = new Date(String(lastDate)).toLocaleDateString("en-UK", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

    return (
      <div
        style={{
          borderColor: themeColor.hex,
          background: themeColor.hex,
        }}
        className={`
      text-left rounded font-bold h-14 w-full relative group
      ${themeColor.isDark && "text-white"}
      ${themeColor.isLight && "text-primaryBackground"}
    `}
      >
        <div className="absolute top-0 w-full h-full px-3 py-2">
          <div className="text-sm font-bold">
            Watched {plays > 0 && `${plays}/${watchHistory?.data?.episodeAmount} episodes`}
          </div>
          <div className="text-xs italic normal-case">Last on {date}</div>
        </div>
        <div className="absolute top-0 flex items-center w-full h-full px-3 py-2 transition-all duration-300 ease-in-out opacity-0 justify-evenly grow group-hover:opacity-100 backdrop-blur ">
          <button className="flex flex-col items-center text-xl" onClick={addToHistory}>
            <span className="text-center text-green-700">
              <AiOutlineCheckCircle />
            </span>
            <span className="py-1 text-xs font-normal">Watch</span>
          </button>
          <button className="flex flex-col items-center text-3xl" onClick={removeFromHistory}>
            <span className="text-center text-red-700">
              <MdDelete className="text-xl" />
            </span>
            <span className="py-1 text-xs font-normal">Remove</span>
          </button>
        </div>
      </div>
    );
  }

  return <LoadingWatchButton themeColor={themeColor} />;
};

export default SeasonWatchButton;
