import { MdReviews } from "react-icons/md";
import { IThemeColor } from "../watchButton/BaseWatchButton";

const ReviewButton = ({ themeColor }: { themeColor: IThemeColor }) => {
  return (
    <div>
      <button
        style={{
          backgroundColor: themeColor.hex,
        }}
        className={`
        flex items-center justify-between mt-2 rounded-md          
        ${themeColor.isDark && "text-white"}
        ${themeColor.isLight && "text-primaryBackground"}
      `}
      >
        <span className="px-3 py-2">
          <MdReviews className="text-2xl" />
        </span>
      </button>
    </div>
  );
};

export default ReviewButton;
