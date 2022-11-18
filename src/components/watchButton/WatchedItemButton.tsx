import Button from "./Button";

interface IWatchedButtonProps {
  themeColor: string;
  watchHistory: any;
  handleOnClick: (e: any) => void;
}

const WatchedItemButton = ({ themeColor, watchHistory, handleOnClick }: IWatchedButtonProps) => {
  const data: any[] = Object.values(watchHistory.data);
  const date = new Date(data[data.length - 1].datetime).toLocaleDateString("en-UK", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

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
};

export default WatchedItemButton;
