import { MdList } from "react-icons/md";
import { IThemeColor } from "../watchButton/BaseWatchButton";

interface IWatchlistButtonProps {
  themeColor: IThemeColor;
}

const WatchlistButton = ({ themeColor }: IWatchlistButtonProps) => {
  return (
    <button
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
