import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { AiOutlineCheckCircle } from "react-icons/ai";
import { MdDelete, MdOpenInNew } from "react-icons/md";
import { trpc } from "../../utils/trpc";
import Modal from "../modal/Modal";
import BaseWatchButton, { IThemeColor } from "./BaseWatchButton";
import LoadingWatchButton from "./LoadingWatchButton";

interface IWatchButtonProps {
  itemID: number;
  episodeID: number;
  seasonID: number;
  themeColor: IThemeColor;
  refetchProgression?: () => void;
}

const EpisodeWatchButton = ({ itemID, episodeID, seasonID, themeColor, refetchProgression }: IWatchButtonProps) => {
  const { status: sessionStatus } = useSession();
  const [modalOpen, setModalOpen] = useState(false);
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
      refetchProgression && refetchProgression();
      watchHistory.refetch();
    },
  });

  const removeFromWatched = trpc.episode.removeEpisodeFromWatched.useMutation({
    onMutate: () => {
      setState("loading");
    },
    onSuccess: () => {
      refetchProgression && refetchProgression();
      watchHistory.refetch();
    },
  });

  useEffect(() => {
    if (sessionStatus === "authenticated" && watchHistory.status === "success") {
      if (Object.keys(watchHistory.data).length > 0) {
        setState("watched");
      } else {
        setModalOpen(false);
        setState("unwatched");
      }
    }
  }, [sessionStatus, watchHistory.data, watchHistory.status, markAsWatched.status]);

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

  const removeFromHistory = (e: any, id: string) => {
    if (e?.key === "Enter" || e?.key === undefined) {
      setState("loading");

      removeFromWatched.mutate({
        id,
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

  if (state === "watched" || modalOpen) {
    const data = Object.values(watchHistory.data as any[]);

    const date = new Date(data[data.length - 1].datetime).toLocaleDateString("en-UK", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
    const plays = Object.keys(watchHistory.data as []).length;

    return (
      <>
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
            <button
              className="flex flex-col items-center text-3xl"
              onClick={() =>
                removeFromHistory(
                  undefined,
                  String(
                    Object.values(watchHistory.data as any[])[Object.values(watchHistory.data as any[]).length - 1].id
                  )
                )
              }
            >
              <span className="text-center text-red-700">
                <MdDelete className="text-xl" />
              </span>
              <span className="py-1 text-xs font-normal">Remove</span>
            </button>
            <button className="flex flex-col items-center text-3xl" onClick={() => setModalOpen(!modalOpen)}>
              <span className="text-center">
                <MdOpenInNew className="text-xl" />
              </span>
              <span className="py-1 text-xs font-normal">More</span>
            </button>
          </div>
        </div>

        {modalOpen && (
          <Modal handleClose={() => setModalOpen(!modalOpen)}>
            <div className="py-4">
              <div className="mb-2 text-2xl">History</div>

              <div className="flex flex-col gap-2">
                <div className="grid items-center grid-cols-4 gap-4 font-bold align-middle">
                  <div className="col-span-3">Date watched</div>
                  <div className="flex flex-col items-center">Remove</div>
                </div>
                {removeFromWatched.isLoading
                  ? data.map((play) => {
                      return (
                        <div key={play.id} className="grid items-center grid-cols-4 gap-4 font-bold align-middle">
                          <div className="animate-pulse col-span-3 h-[24px] rounded bg-[#343434]" />
                          <div className="flex flex-col items-center">
                            <div className="animate-pulse w-[24px] h-[24px] rounded-full bg-[#343434]" />
                          </div>
                        </div>
                      );
                    })
                  : data.map((play) => {
                      const date = new Date(play.datetime).toLocaleString("en-UK", {
                        dateStyle: "long",
                        timeStyle: "medium",
                      });

                      return (
                        <div key={play.id} className="grid items-center grid-cols-4 gap-4 align-middle">
                          <div className="col-span-3">{date}</div>
                          <button
                            className="flex flex-col items-center"
                            onClick={() => {
                              removeFromHistory(undefined, play.id);

                              if (data.length === 1) {
                                setModalOpen(false);
                              }
                            }}
                          >
                            <span className="text-center text-red-700">
                              <MdDelete className="text-2xl" />
                            </span>
                          </button>
                        </div>
                      );
                    })}
              </div>
            </div>
          </Modal>
        )}
      </>
    );
  }

  return <LoadingWatchButton themeColor={themeColor} />;
};

export default EpisodeWatchButton;
