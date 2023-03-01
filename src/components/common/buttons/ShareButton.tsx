import { useRouter } from "next/router";
import { IoMdInformation } from "react-icons/io";
import { MdShare } from "react-icons/md";
import { Tooltip } from "react-tooltip";
import { IThemeColor } from "../../watchButton/BaseWatchButton";

const ShareButton = ({ themeColor, title, text }: { themeColor: IThemeColor; title: string; text: string }) => {
  const router = useRouter();

  const handleClick = async () => {
    try {
      await navigator.share({
        title,
        text,
        url: router.asPath,
      });
    } catch (err) {
      console.log("Failed to share ", err);
    }
  };

  return (
    <div>
      <button
        data-tooltip-id="share"
        data-tooltip-content="Share"
        className={`flex items-center justify-between mt-2 rounded-md          
          ${themeColor.isDark && "text-white"}
          ${themeColor.isLight && "text-primaryBackground"}`}
        style={{
          backgroundColor: themeColor.hex,
        }}
        aria-label="Create a share"
        onClick={handleClick}
      >
        <span className="px-3 py-2">
          <MdShare className="text-2xl" />
        </span>
      </button>
      <Tooltip id="share" />
    </div>
  );
};

export default ShareButton;
