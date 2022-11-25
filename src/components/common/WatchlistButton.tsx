import { BsListCheck, BsList } from "react-icons/Bs";
import { ImSpinner2 } from "react-icons/im";
import { trpc } from "../../utils/trpc";
import { IThemeColor } from "../watchButton/BaseWatchButton";

interface IWatchlistButtonProps {
  themeColor: IThemeColor;
  movieID: number | undefined;
  seriesID: number | undefined;
}

const WatchlistButton = ({ movieID, seriesID, themeColor }: IWatchlistButtonProps) => {
  const { data, status, refetch, isRefetching } = trpc.watchlist.checkItemInWatchlist.useQuery({
    itemID: Number(movieID || seriesID),
  });

  const addToWatchlist = trpc.watchlist.addItem.useMutation({
    onSuccess: () => refetch(),
  });

  return (
    <div>
      {addToWatchlist.isLoading || isRefetching ? (
        <button
          disabled
          style={{
            backgroundColor: themeColor.hex,
          }}
          className={`
        flex items-center justify-between w-full px-3 py-2 mt-2 rounded-md          
        ${themeColor.isDark && "text-white"}
        ${themeColor.isLight && "text-primaryBackground"}
      `}
        >
          <span className="font-bold">Loading</span>
          <ImSpinner2 className="w-6 h-6 animate-spin" />
        </button>
      ) : (
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
          {data?.inWatchlist ? (
            <>
              <span className="font-bold">In your watchlist</span>
              <BsListCheck className="text-2xl" />
            </>
          ) : (
            <>
              <span className="font-bold">Add to watchlist</span>
              <BsList className="text-2xl" />
            </>
          )}
        </button>
      )}
    </div>
  );
};

export default WatchlistButton;
