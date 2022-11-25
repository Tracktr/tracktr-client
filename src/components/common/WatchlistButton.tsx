import { BsListCheck, BsList } from "react-icons/bs";
import { ImSpinner2 } from "react-icons/im";
import { MdOutlineBookmarkAdd, MdOutlineBookmarkAdded } from "react-icons/md";
import { trpc } from "../../utils/trpc";
import { IThemeColor } from "../watchButton/BaseWatchButton";

interface IWatchlistButtonProps {
  themeColor: IThemeColor;
  movieID: number | undefined;
  seriesID: number | undefined;
}

const WatchlistButton = ({ movieID, seriesID, themeColor }: IWatchlistButtonProps) => {
  const { data, refetch, isRefetching } = trpc.watchlist.checkItemInWatchlist.useQuery({
    itemID: Number(movieID || seriesID),
  });

  const addToWatchlist = trpc.watchlist.addItem.useMutation({
    onSuccess: () => refetch(),
  });

  const deleteFromWatchlist = trpc.watchlist.removeItem.useMutation({
    onSuccess: () => {
      refetch();
    },
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
          onClick={() => {
            if (data?.id) {
              deleteFromWatchlist.mutate({
                id: data?.id,
              });
            } else {
              addToWatchlist.mutate({
                movie_id: movieID,
                series_id: seriesID,
              });
            }
          }}
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
              <MdOutlineBookmarkAdded className="mr-1 text-2xl" />
            </>
          ) : (
            <>
              <span className="font-bold">Add to watchlist</span>
              <MdOutlineBookmarkAdd className="mr-1 text-2xl" />
            </>
          )}
        </button>
      )}
    </div>
  );
};

export default WatchlistButton;
