import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { ImCheckmark, ImCheckmark2 } from "react-icons/im";
import { IWatchButtonProps } from ".";
import { trpc } from "../../utils/trpc";
import BaseWatchButton from "./BaseWatchButton";
import LoadingWatchButton from "./LoadingWatchButton";

const EpisodeWatchButton = ({ itemID, episodeID, seasonID, themeColor }: IWatchButtonProps) => {
  const { data: session, status: sessionStatus } = useSession();
  const [state, setState] = useState<"watched" | "unwatched" | "loading">("loading");

  const watchHistory = trpc.episode.watchHistoryByID.useQuery(
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

  const markAsWatched = trpc.episode.markEpisodeAsWatched.useMutation({
    onMutate: () => {
      setState("loading");
    },
    onSuccess: () => {
      watchHistory.refetch();
    },
  });

  const removeFromWatched = trpc.episode.removeEpisodeFromWatched.useMutation({
    onMutate: () => {
      setState("loading");
    },
    onSuccess: () => {
      watchHistory.refetch();
    },
  });

  useEffect(() => {
    if (sessionStatus !== "loading" && session && watchHistory.status === "success") {
      if (Object.keys(watchHistory.data).length > 0) {
        setState("watched");
      } else {
        setState("unwatched");
      }
    }
  }, [session, sessionStatus, watchHistory.data, watchHistory.status, markAsWatched.status]);

  const addToHistory = (e: any) => {
    if (e?.key === "Enter" || e?.key === undefined) {
      setState("loading");

      markAsWatched.mutate({
        episodeNumber: episodeID,
        seasonNumber: seasonID,
        seriesId: itemID,
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
      <BaseWatchButton onClick={addToHistory} onKeyDown={addToHistory} themeColor={themeColor}>
        <div>Add to watched</div>
        <div>
          <ImCheckmark2 className="mr-1 text-lg" />
        </div>
      </BaseWatchButton>
    );
  }

  if (state === "watched") {
    const data: any[] = Object.values(watchHistory.data as any[]);
    const date = new Date(data[data.length - 1].datetime).toLocaleDateString("en-UK", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
    const plays = Object.keys(watchHistory.data as []).length;

    return (
      <BaseWatchButton onClick={removeFromHistory} onKeyDown={removeFromHistory} themeColor={themeColor}>
        <div>
          <div className="text-sm font-bold">Watched {plays > 0 && `${plays} times`}</div>
          <div className="text-xs italic normal-case">Last on {date}</div>
        </div>
      </BaseWatchButton>
    );
  }

  return <LoadingWatchButton themeColor={themeColor} />;
};

export default EpisodeWatchButton;
