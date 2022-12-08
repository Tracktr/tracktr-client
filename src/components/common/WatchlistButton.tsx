import { ImSpinner2 } from "react-icons/im";
import { trpc } from "../../utils/trpc";
import { IThemeColor } from "../watchButton/BaseWatchButton";
import { MdBookmarkAdd, MdBookmarkRemove } from "react-icons/md";
import ReactTooltip from "react-tooltip";
import { toast } from "react-toastify";
import { IoIosAdd, IoIosRemove } from "react-icons/io";

interface IWatchlistButtonProps {
  themeColor: IThemeColor;
  movieID?: number | undefined;
  seriesID?: number | undefined;
  name: string;
}

const WatchlistButton = ({ movieID, seriesID, themeColor, name }: IWatchlistButtonProps) => {
  const { data, refetch, isRefetching } = trpc.watchlist.checkItemInWatchlist.useQuery({
    itemID: Number(movieID || seriesID),
  });

  const addToWatchlist = trpc.watchlist.addItem.useMutation({
    onSuccess: () => {
      toast(`Added ${name} to watchlist`, {
        icon: <IoIosAdd className="text-3xl text-green-500" />,
      });
      refetch();
    },
  });

  const deleteFromWatchlist = trpc.watchlist.removeItem.useMutation({
    onSuccess: () => {
      toast(`Removed ${name} from watchlist`, {
        icon: <IoIosRemove className="text-3xl text-red-500" />,
      });
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
        flex items-center justify-between mt-2 rounded-md px-3 py-2       
        ${themeColor.isDark && "text-white"}
        ${themeColor.isLight && "text-primaryBackground"}
      `}
        >
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
        flex items-center justify-between mt-2 rounded-md          
        ${themeColor.isDark && "text-white"}
        ${themeColor.isLight && "text-primaryBackground"}
      `}
        >
          {data?.inWatchlist ? (
            <span className="px-3 py-2" data-tip="Remove from Watchlist">
              <ReactTooltip />
              <MdBookmarkRemove className="text-2xl" />
            </span>
          ) : (
            <span className="px-3 py-2" data-tip="Add to Watchlist">
              <ReactTooltip />
              <MdBookmarkAdd className="text-2xl" />
            </span>
          )}
        </button>
      )}
    </div>
  );
};

export default WatchlistButton;
