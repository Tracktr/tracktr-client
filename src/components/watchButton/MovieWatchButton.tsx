import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { AiOutlineCheckCircle } from "react-icons/ai";
import { MdDelete } from "react-icons/md";
import { IWatchButtonProps } from ".";
import { trpc } from "../../utils/trpc";
import BaseWatchButton from "./BaseWatchButton";
import LoadingWatchButton from "./LoadingWatchButton";

const MovieWatchButton = ({ itemID, themeColor }: IWatchButtonProps) => {
  const { status: sessionStatus } = useSession();
  const [state, setState] = useState<"watched" | "unwatched" | "loading">("loading");

  const watchHistory = trpc.movie.watchHistoryByID.useQuery(
    { movieId: itemID },
    {
      enabled: sessionStatus !== "loading",
      refetchOnWindowFocus: false,
    }
  );

  const markAsWatched = trpc.movie.markMovieAsWatched.useMutation({
    onMutate: async () => {
      setState("loading");
    },
    onSuccess: () => {
      watchHistory.refetch();
    },
  });

  const removeFromWatched = trpc.movie.removeMovieFromWatched.useMutation({
    onMutate: async () => {
      setState("loading");
    },
    onSuccess: () => {
      watchHistory.refetch();
    },
  });

  useEffect(() => {
    if (sessionStatus === "authenticated" && watchHistory.status === "success") {
      if (Object.keys(watchHistory.data).length > 0) {
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
        movieId: itemID,
      });
    }
  };

  const removeFromHistory = (e: any) => {
    if (e?.key === "Enter" || e?.key === undefined) {
      setState("loading");

      removeFromWatched.mutate({
        id: Object.values(watchHistory.data as any[])[Object.values(watchHistory.data as any[]).length - 1].id,
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
    const date = Object.values(watchHistory.data as any[]);
    const date = new Date(data[data.length - 1].datetime).toLocaleDateString("en-UK", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
    const plays = Object.keys(watchHistory.data as []).length;

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
          <div className="text-sm font-bold">Watched {plays > 0 && `${plays} times`}</div>
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

export default MovieWatchButton;
