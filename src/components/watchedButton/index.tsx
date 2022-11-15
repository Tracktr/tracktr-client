import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { trpc } from "../../utils/trpc";
import LoadingButton from "./LoadingButton";
import UnwatchedButton from "./UnwatchedButton";
import WatchedItemButton from "./WatchedItemButton";

interface IWatchedButtonProps {
  itemID: number;
  episodeID: number;
  seasonID: number;
  themeColor: any;
}

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
    return <LoadingButton themeColor={themeColor} />;
  }

  if (state === "watched" && watchHistory.data) {
    return <WatchedItemButton themeColor={themeColor} watchHistory={watchHistory} handleOnClick={handleOnClick} />;
  }

  if (state === "unwatched") {
    return <UnwatchedButton themeColor={themeColor} handleOnClick={handleOnClick} />;
  }

  return <></>;
};

export default WatchedButton;
