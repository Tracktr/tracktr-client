import { signIn, useSession } from "next-auth/react";
import { ReactFragment, useEffect, useState } from "react";
import { ImSpinner2, ImCheckmark, ImCheckmark2 } from "react-icons/im";
import { trpc } from "../../utils/trpc";

interface IWatchedButtonProps {
  itemID: number;
}

interface IButton {
  onClick?: () => void;
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

const WatchedButton = ({ itemID }: IWatchedButtonProps) => {
  const [state, setState] = useState<"watched" | "unwatched" | "loading" | undefined>();
  const { data: session, status: sessionStatus } = useSession();

  const { data, status, refetch } = trpc.movie.watchHistoryByID.useQuery(
    { movieId: itemID },
    {
      enabled: sessionStatus !== "loading",
      refetchOnWindowFocus: false,
    }
  );

  const { mutate, status: mutationStatus } = trpc.movie.markMovieAsWatched.useMutation({
    onMutate: async () => {
      setState("loading");
    },
    onSuccess: () => {
      refetch();
    },
  });

  useEffect(() => {
    if (sessionStatus !== "loading" && session && status === "success") {
      if (Object.keys(data).length > 0) {
        setState("watched");
      } else {
        setState("unwatched");
      }
    }
  }, [session, sessionStatus, data, status, mutationStatus]);

  const handleOnClick = async (e?: any) => {
    if (e?.key === "Enter" || e?.key === undefined) {
      setState("loading");

      mutate({
        movieId: itemID,
      });
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

  if (state === "watched" && data) {
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
            Watched {Object.keys(data).length > 0 && `${Object.keys(data).length} times`}
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
