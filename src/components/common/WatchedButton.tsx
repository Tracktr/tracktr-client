import { signIn, useSession } from "next-auth/react";
import { ReactFragment, useEffect, useState } from "react";
import { ImSpinner2, ImCheckmark, ImCheckmark2 } from "react-icons/im";
import { trpc } from "../../utils/trpc";

interface IWatchedButtonProps {
  itemID: number;
  episodeID: number;
  seasonID: number;
}

interface IButton {
  onClick?: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onKeyDown?: (e: any) => void;
  children: ReactFragment;
}

const Button = ({ onClick, onKeyDown, children }: IButton) => (
  <div
    className={`h-16 flex justify-center align-middle items-center gap-2 uppercase border-2 border-solid rounded ${
      onClick === undefined && onKeyDown === undefined && "cursor-default select-auto"
    } border-primary text-primary`}
    onClick={onClick}
    onKeyDown={onKeyDown}
    role="button"
    tabIndex={0}
  >
    {children}
  </div>
);

const WatchedButton = ({ itemID, episodeID, seasonID }: IWatchedButtonProps) => {
  const [state, setState] = useState<"watched" | "unwatched" | "loading" | undefined>();
  const { data: session, status: sessionStatus } = useSession();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let watchHistory: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
      <Button>
        <div>
          <ImSpinner2 className="w-6 h-6 animate-spin" />
        </div>
        <div>Loading</div>
      </Button>
    );
  }

  if (state === "watched" && watchHistory.data) {
    const date = new Date().toLocaleDateString(
      "en-UK", // TODO: get time format from user language
      {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
      }
    );

    return (
      <Button onClick={(e: void) => handleOnClick(e)} onKeyDown={handleOnClick}>
        <div>
          <ImCheckmark className="w-6 h-6" />
        </div>
        <div>
          <div className="text-sm font-bold">
            Watched {Object.keys(watchHistory.data).length > 0 && `${Object.keys(watchHistory.data).length} times`}
          </div>
          <div className="text-xs italic normal-case">Last seen on {date}</div>
        </div>
      </Button>
    );
  }

  if (state === "unwatched") {
    return (
      <Button onClick={(e: void) => handleOnClick(e)} onKeyDown={handleOnClick}>
        <div>
          <ImCheckmark2 className="w-6 h-6" />
        </div>
        <div>Add to watched</div>
      </Button>
    );
  }

  return (
    <Button onClick={signIn} onKeyDown={signIn}>
      <div>
        <ImCheckmark2 className="w-6 h-6" />
      </div>
      <div>Add to watched</div>
    </Button>
  );
};

export default WatchedButton;
