import { useRouter } from "next/router";
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
      console.error("Failed to share ", err);
    }
  };

  if (!navigator.canShare) {
    return <></>;
  }

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
        aria-label="Share item"
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
