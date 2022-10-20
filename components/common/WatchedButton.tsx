import { useSession } from "next-auth/react";
import { ReactFragment, useEffect, useState } from "react";
import { ImCheckmark2 } from "react-icons/im";

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
    className={`flex justify-center gap-2 px-5 py-4 text-center uppercase border-2 border-solid rounded ${
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
  const { data: session, status } = useSession();
  const [state, setState] = useState<"watched" | "unwatched" | "loading" | undefined>();

  useEffect(() => {
    if (status !== "loading" && session) {
      setState("unwatched");
    }
  }, [session, status]);

  const handleOnClick = async (e?: any) => {
    if (e?.key === "Enter" || e?.key === undefined) {
      setState("loading");

      const result = await fetch(`/api/movies/${movieID}/watch`, { method: "POST" }).then((res) => res.json());

      if (result) {
        setState("watched");
      }
    }
  };

  if (state === "loading") {
    return <Button>Loading...</Button>;
  }

  if (state === "watched") {
    return (
      <Button onClick={handleOnClick} onKeyDown={handleOnClick}>
        <div>
          <ImCheckmark2 className="w-6 h-6" />
        </div>
        <div>Watched</div>
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
    <Button>
      <div>
        <ImCheckmark2 className="w-6 h-6" />
      </div>
      <div>Sign in to track</div>
    </Button>
  );
};

export default WatchedButton;
