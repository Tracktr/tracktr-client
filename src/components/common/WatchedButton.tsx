import { signIn, useSession } from "next-auth/react";
import { ReactFragment, ReactNode, useEffect, useState } from "react";
import { ImSpinner2, ImCheckmark } from "react-icons/im";
import { trpc } from "../../utils/trpc";

interface IWatchedButtonProps {
  itemID: number;
  episodeID: number;
  seasonID: number;
  themeColor: any;
}

interface IButton {
  onClick?: () => void;
  onKeyDown?: (e: any) => void;
  themeColor: any;
  children: ReactNode;
}

const Button = ({ onClick, onKeyDown, children, themeColor }: IButton) => (
  <div
    style={{
      borderColor: themeColor.hex,
      background: themeColor.hex,
    }}
    className={`
      text-left px-3 my-2 flex justify-between py-2 align-middle items-center gap-2 rounded font-bold text-white 
      ${onClick === undefined && onKeyDown === undefined && "cursor-default select-auto"}
      ${themeColor.isDark && "text-white"}
      ${themeColor.isLight && "text-primaryBackground"}
    `}
    onClick={onClick}
    onKeyDown={onKeyDown}
    role="button"
    tabIndex={0}
  >
    {children}
  </div>
);

const WatchedButton = ({ itemID, episodeID, seasonID, themeColor }: IWatchedButtonProps) => {
  const [state, setState] = useState<"watched" | "unwatched" | "loading" | undefined>();
  const { data: session, status: sessionStatus } = useSession();
  let watchHistory: any;
  let markAsWatched: any;

  if (episodeID && seasonID) {
    watchHistory = trpc.episode.watchHistoryByID.useQuery(
      {
        episodeNumber: Number(episodeID),
        seasonNumber: Number(seasonID),
        seriesId: itemID,
      },
      {
        enabled: sessionStatus !== "loading",
        refetchOnWindowFocus: false,
      }
    );
    markAsWatched = trpc.episode.markEpisodeAsWatched.useMutation({
      onMutate: async () => {
        setState("loading");
      },
      onSuccess: () => {
        watchHistory.refetch();
      },
    });
  } else {
    watchHistory = trpc.movie.watchHistoryByID.useQuery(
      { movieId: itemID },
      {
        enabled: sessionStatus !== "loading",
        refetchOnWindowFocus: false,
      }
    );

    markAsWatched = trpc.movie.markMovieAsWatched.useMutation({
      onMutate: async () => {
        setState("loading");
      },
      onSuccess: () => {
        watchHistory.refetch();
      },
    });
  }

  useEffect(() => {
    if (sessionStatus !== "loading" && session && watchHistory.status === "success") {
      if (Object.keys(watchHistory.data).length > 0) {
        setState("watched");
      } else {
        setState("unwatched");
      }
    }
  }, [session, sessionStatus, watchHistory.data, watchHistory.status, markAsWatched.status]);

  const handleOnClick = async (e?: any) => {
    if (e?.key === "Enter" || e?.key === undefined) {
      setState("loading");

      if (episodeID && seasonID) {
        markAsWatched.mutate({
          episodeNumber: episodeID,
          seasonNumber: seasonID,
          seriesId: itemID,
        });
      } else {
        markAsWatched.mutate({
          movieId: itemID,
        });
      }
    }
  };

  if (state === "loading") {
    return (
      <Button themeColor={themeColor}>
        <div>Adding to list</div>
        <div>
          <ImSpinner2 className="w-6 h-6 animate-spin" />
        </div>
      </Button>
    );
  }

  if (state === "watched" && watchHistory.data) {
    const data: any[] = Object.values(watchHistory.data);
    const date = new Date(data[data.length - 1].datetime).toLocaleDateString(
      "en-UK", // TODO: get time format from user language
      {
        year: "numeric",
        month: "short",
        day: "numeric",
      }
    );

    return (
      <Button themeColor={themeColor} onClick={(e: void) => handleOnClick(e)} onKeyDown={handleOnClick}>
        <div>
          <div className="text-sm font-bold">
            Watched {Object.keys(watchHistory.data).length > 0 && `${Object.keys(watchHistory.data).length} times`}
          </div>
          <div className="text-xs italic normal-case">Last on {date}</div>
        </div>
      </Button>
    );
  }

  if (state === "unwatched") {
    return (
      <Button themeColor={themeColor} onClick={(e: void) => handleOnClick(e)} onKeyDown={handleOnClick}>
        <div>Add to watched</div>
        <div>
          <ImCheckmark className="mr-1 text-lg" />
        </div>
      </Button>
    );
  }

  return <></>;
};

export default WatchedButton;
