import { signIn, useSession } from "next-auth/react";
import { ReactFragment, useEffect, useState } from "react";
import { ImSpinner2, ImCheckmark, ImCheckmark2 } from "react-icons/im";
import { useQuery } from "react-query";

interface IWatchedButtonProps {
  movieID: number;
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

const WatchedButton = ({ movieID }: IWatchedButtonProps) => {
  const { data: session, status: sessionStatus } = useSession();
  const [state, setState] = useState<"watched" | "unwatched" | "loading" | undefined>();

  const { data, status, refetch } = useQuery(
    ["watch_history", movieID],
    () => fetch(`/api/movies/${movieID}/watch`).then((res) => res.json()),
    { enabled: sessionStatus !== "loading", refetchOnWindowFocus: false }
  );

  useEffect(() => {
    if (sessionStatus !== "loading" && session && status === "success") {
      if (data.length > 0) {
        setState("watched");
      } else {
        setState("unwatched");
      }
    }
  }, [session, sessionStatus, data, status]);

  const handleOnClick = async (e?: any) => {
    if (e?.key === "Enter" || e?.key === undefined) {
      setState("loading");

      const result = await fetch(`/api/movies/${movieID}/watch`, { method: "POST" }).then((res) => res.json());

      if (result) {
        refetch();
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

  if (state === "watched") {
    const date = new Date(data[data.length - 1]?.datetime).toLocaleDateString(
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
      <Button onClick={handleOnClick} onKeyDown={handleOnClick}>
        <div>
          <ImCheckmark className="w-6 h-6" />
        </div>
        <div>
          <div className="text-sm font-bold">Watched {data.length > 1 && `${data.length} times`}</div>
          <div className="text-xs italic normal-case">Last on {date}</div>
        </div>
      </Button>
    );
  }

  if (state === "unwatched") {
    return (
      <Button onClick={handleOnClick} onKeyDown={handleOnClick}>
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
