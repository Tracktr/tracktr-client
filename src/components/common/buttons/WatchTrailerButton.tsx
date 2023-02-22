import { useState } from "react";
import { MdOndemandVideo } from "react-icons/md";
import ReactPlayer from "react-player";
import Modal from "../../modal/Modal";
import { IThemeColor } from "../../watchButton/BaseWatchButton";

interface WatchTrailerButtonProps {
  themeColor: IThemeColor;
  data: any;
}

const WatchTrailerButton = ({ themeColor, data }: WatchTrailerButtonProps) => {
  const [modalOpen, setModalOpen] = useState(false);

  const close = () => setModalOpen(false);
  const open = () => setModalOpen(true);

  const trailer = data.results.filter((item: any) => item.type === "Trailer").slice(0, 1);

  return data.results.length >= 1 ? (
    <button
      onClick={() => (modalOpen ? close() : open())}
      style={{
        backgroundColor: themeColor.hex,
      }}
      className={`
        flex items-center justify-between w-full px-3 py-2 mt-2 rounded-md          
        ${themeColor.isDark && "text-white"}
        ${themeColor.isLight && "text-primaryBackground"}
      `}
    >
      <span className="font-bold">Watch trailer</span>
      <MdOndemandVideo className="text-2xl" />

      {modalOpen && (
        <Modal handleClose={close}>
          {trailer.length >= 1 ? (
            trailer.map((item: any) => {
              const site = item.site === "YouTube" && "https://youtube.com/watch?v=" + item.key;
              return (
                <div className="relative h-auto aspect-video" key={item.key}>
                  <ReactPlayer url={`${site}`} width="100%" height="100%" />
                </div>
              );
            })
          ) : (
            <p className="p-4">Something went wrong finding a video...</p>
          )}
        </Modal>
      )}
    </button>
  ) : (
    <></>
  );
};

export default WatchTrailerButton;
