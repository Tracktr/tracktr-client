import { MdList } from "react-icons/md";
import { trpc } from "../../utils/trpc";
import { IThemeColor } from "../watchButton/BaseWatchButton";

interface IWatchlistButtonProps {
  themeColor: IThemeColor;
  movieID: number | undefined;
  seriesID: number | undefined;
}

const WatchlistButton = ({ movieID, seriesID, themeColor }: IWatchlistButtonProps) => {
  const addToWatchlist = trpc.watchlist.addItem.useMutation();

  return (
    <button
      onClick={() =>
        addToWatchlist.mutate({
          watchlist_id: "clawhxsx9000297to1cn7nc08",
          movie_id: movieID,
          series_id: seriesID,
        })
      }
      style={{
        backgroundColor: themeColor.hex,
      }}
      className={`
        flex items-center justify-between w-full px-3 py-2 mt-2 rounded-md          
        ${themeColor.isDark && "text-white"}
        ${themeColor.isLight && "text-primaryBackground"}
      `}
    >
      <span className="font-bold">Add to watchlist</span>
      <MdList className="text-2xl" />
    </button>
  );
};

export default WatchlistButton;
