import { ImSpinner2 } from "react-icons/im";
import { Tooltip } from "react-tooltip";
import { toast } from "react-toastify";
import { IoIosAdd, IoIosRemove, IoMdInformation } from "react-icons/io";
import { BsBookmarkCheck, BsFillBookmarkDashFill } from "react-icons/bs";
import { IThemeColor } from "../../watchButton/BaseWatchButton";
import { trpc } from "../../../utils/trpc";

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

  const addToMovies = trpc.watchlist.addMovie.useMutation({
    onSuccess: () => {
      toast(`Added ${name} to watchlist`, {
        icon: <IoIosAdd className="text-3xl text-green-500" />,
      });
      refetch();
    },
    onError: () => {
      toast(`Failed to ${name} to watchlist`, {
        icon: <IoMdInformation className="text-3xl text-blue-500" />,
      });
    },
  });
  const addToSeries = trpc.watchlist.addSeries.useMutation({
    onSuccess: () => {
      toast(`Added ${name} to watchlist`, {
        icon: <IoIosAdd className="text-3xl text-green-500" />,
      });
      refetch();
    },
    onError: () => {
      toast(`Failed to ${name} to watchlist`, {
        icon: <IoMdInformation className="text-3xl text-blue-500" />,
      });
    },
  });

  const deleteFromWatchlist = trpc.watchlist.removeItem.useMutation({
    onSuccess: () => {
      toast(`Removed ${name} from watchlist`, {
        icon: <IoIosRemove className="text-3xl text-red-500" />,
      });
      refetch();
    },
    onError: () => {
      toast(`Failed to remove ${name} from watchlist`, {
        icon: <IoMdInformation className="text-3xl text-blue-500" />,
      });
    },
  });

  const handleButtonClick = () => {
    if (data?.id) {
      deleteFromWatchlist.mutate({
        id: data?.id,
      });
    } else {
      if (movieID) {
        addToMovies.mutate({
          movie_id: movieID,
        });
      } else if (seriesID) {
        addToSeries.mutate({
          series_id: seriesID,
        });
      }
    }
  };

  return (
    <div>
      {addToMovies.isLoading || addToSeries.isLoading || deleteFromWatchlist.isLoading || isRefetching ? (
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
        <>
          <button
            data-tooltip-id="watchlist"
            data-tooltip-content={data?.inWatchlist ? "Remove from watchlist" : "Add to watchlist"}
            onClick={handleButtonClick}
            style={{
              backgroundColor: themeColor.hex,
            }}
            className={`flex items-center justify-between mt-2 rounded-md
              ${themeColor.isDark && "text-white"}
              ${themeColor.isLight && "text-primaryBackground"}`}
          >
            {data?.inWatchlist ? (
              <span className="px-3 py-2">
                <BsFillBookmarkDashFill className="text-2xl" />
              </span>
            ) : (
              <span className="px-3 py-2">
                <BsBookmarkCheck className="text-2xl" />
              </span>
            )}
          </button>
          <Tooltip id="watchlist" />
        </>
      )}
    </div>
  );
};

export default WatchlistButton;
